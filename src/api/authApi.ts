// src/api/authApi.ts
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { toast } from "sonner";
import { api } from "@/api/apiClient";
import { getErrorMessage } from "@/lib/utils";

// Import types directly from your shared schema
import type {
  SafeUser,
  LoginUser,
  RegisterUser,
  RegisterPasskeyVerify,
  LoginPasskeyVerify,
} from "@server/schema/auth.schema";
import type { AuthMethod } from "@server/config/auth.config";
import { z } from "zod";

export const auth = api.auth;

export interface AuthConfigResponse {
  methods: AuthMethod[];
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  roles: string[];
  defaultRole: string;
}
type LoginResponse = {
  user?: SafeUser;
  requireTotp?: boolean;
};
type UserResponse = {
  user?: SafeUser;
};
type AuthResult = {
  user?: SafeUser;
  requireTotp?: boolean;
};
export type TotpSetupResponse = {
  secret: string;
  otpauthUrl: string;
};
type RegistrationOptionsJSON = Parameters<typeof startRegistration>[0]["optionsJSON"];
type AuthenticationOptionsJSON = Parameters<typeof startAuthentication>[0]["optionsJSON"];

const getToastMessage = (err: unknown) =>
  err instanceof Error ? err.message : "An unexpected error occurred";

async function readJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const changePinSchema = z.object({
  currentPin: z.string().min(1, "Current PIN is required"),
  newPin: z.string().min(4, "New PIN must be at least 4 digits"),
});

export const updateUserSchema = z.object({
  displayName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
});

// --- Queries ---

async function getCurrentUser() {
  const res = await auth.me.$get();
  if (!res.ok) throw new Error(await getErrorMessage(res));
  return await readJson<SafeUser>(res);
}

export const getUserQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
  retry: false,
});

async function getAuthMethods() {
  const res = await auth.methods.$get();
  if (!res.ok) throw new Error(await getErrorMessage(res));
  return await readJson<AuthConfigResponse>(res);
}

export const getAuthMethodsQueryOptions = queryOptions({
  queryKey: ["get-auth-methods"],
  queryFn: getAuthMethods,
  staleTime: Infinity,
});

// --- Mutations: Password/Standard ---

export async function registerUser(payload: RegisterUser) {
  const res = await auth.register.$post({ json: payload });
  if (!res.ok) throw new Error(await getErrorMessage(res));
  return await readJson<UserResponse>(res);
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Account created!");
      if (data.user) {
        queryClient.setQueryData(getUserQueryOptions.queryKey, data.user);
      }
      void queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export async function loginUser(payload: LoginUser): Promise<LoginResponse> {
  const res = await auth.login.$post({ json: payload });

  if (res.status === 403) {
    const data = await readJson<Record<string, unknown>>(res);
    if ("requireTotp" in data) {
      return { requireTotp: true };
    }
  }

  if (!res.ok) throw new Error(await getErrorMessage(res));
  return await readJson<LoginResponse>(res);
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.requireTotp) return;
      toast.success("Welcome back!");
      void queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

// --- Mutations: Passkey ---

// Note: We use a subset of RegisterPasskey because the server handles challenge generation
export async function registerUserPasskey({ email }: Pick<RegisterPasskeyVerify, "email">) {
  // 1. Get Options
  const optRes = await auth.passkey.register.options.$post({ json: { email } });
  if (optRes.status === 409) throw new Error("Email already registered.");
  if (!optRes.ok) throw new Error(await getErrorMessage(optRes));

  const options = await readJson<RegistrationOptionsJSON & { challengeId: string }>(optRes);

  // 2. Browser Interaction
  const attResp = await startRegistration({ optionsJSON: options });

  // 3. Verify
  const verRes = await auth.passkey.register.verify.$post({
    json: {
      email,
      response: attResp as RegisterPasskeyVerify["response"],
      challengeId: options.challengeId,
    },
  });

  if (!verRes.ok) throw new Error(await getErrorMessage(verRes));
  return await readJson<UserResponse>(verRes);
}

export function useRegisterPasskeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUserPasskey,
    onSuccess: (data) => {
      toast.success("Passkey registered!");
      if (data.user) {
        queryClient.setQueryData(getUserQueryOptions.queryKey, data.user);
      }
      void queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export async function loginUserPasskey({ email }: Pick<LoginPasskeyVerify, "email">) {
  // 1. Get Options
  const optRes = await auth.passkey.login.options.$post({ json: { email } });
  if (!optRes.ok) throw new Error(await getErrorMessage(optRes));

  const options = await readJson<AuthenticationOptionsJSON & { challengeId: string }>(optRes);

  // 2. Browser Interaction
  const authResp = await startAuthentication({ optionsJSON: options });

  // 3. Verify
  const verRes = await auth.passkey.login.verify.$post({
    json: {
      email,
      response: authResp as LoginPasskeyVerify["response"],
      challengeId: options.challengeId,
    },
  });

  if (!verRes.ok) throw new Error(await getErrorMessage(verRes));
  return await readJson<AuthResult>(verRes);
}

export function useLoginPasskeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUserPasskey,
    onSuccess: () => {
      toast.success("Logged in with Passkey!");
      void queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}
// --- Mutations: TOTP / 2FA ---
export function useSetupTotpMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await auth.totp.setup.$get();
      if (!res.ok) throw new Error(await getErrorMessage(res));
      return await readJson<TotpSetupResponse>(res);
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export function useEnableTotpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { secret: string; code: string }) => {
      const res = await auth.totp.enable.$post({ json: payload });
      if (!res.ok) throw new Error(await getErrorMessage(res));
      return await readJson<unknown>(res);
    },
    onSuccess: () => {
      toast.success("Two-Factor Authentication Enabled!");
      void queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export function useDisableTotpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await auth.totp.disable.$delete();
      if (!res.ok) throw new Error(await getErrorMessage(res));
      return await readJson<unknown>(res);
    },
    onSuccess: () => {
      toast.info("Two-Factor Authentication Disabled");
      void queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
  });
}

// --- Logout ---

export async function logoutUser() {
  const res = await auth.logout.$post();
  if (!res.ok) throw new Error(await getErrorMessage(res));
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.info("Logged out");
      queryClient.setQueryData(getUserQueryOptions.queryKey, undefined);
      window.location.href = "/"; // Hard reload to clear client state often safer
    },
  });
}
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (json: z.infer<typeof updateUserSchema>) => {
      const res = await auth.me.$patch({ json });
      if (!res.ok) throw new Error(await getErrorMessage(res));
      return await readJson<UserResponse>(res);
    },
    onSuccess: (data) => {
      toast.success("Profile updated");
      if (data.user) {
        queryClient.setQueryData(getUserQueryOptions.queryKey, data.user);
      }
      void queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (json: z.infer<typeof changePasswordSchema>) => {
      const res = await auth["change-password"].$post({ json }); // Assuming POST /change-password
      if (!res.ok) throw new Error(await getErrorMessage(res));
      return await readJson<unknown>(res);
    },
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export function useChangePinMutation() {
  return useMutation({
    mutationFn: async (json: z.infer<typeof changePinSchema>) => {
      const res = await auth["change-pin"].$post({ json }); // Assuming POST /change-pin
      if (!res.ok) throw new Error(await getErrorMessage(res));
      return await readJson<unknown>(res);
    },
    onSuccess: () => toast.success("PIN changed successfully"),
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await auth.me.$delete(); // Assuming DELETE /me
      if (!res.ok) throw new Error(await getErrorMessage(res));
      return await readJson<unknown>(res);
    },
    onSuccess: () => {
      toast.error("Account deleted");
      queryClient.clear();
      window.location.href = "/";
    },
    onError: (err: unknown) => toast.error(getToastMessage(err)),
  });
}
