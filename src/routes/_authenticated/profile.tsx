import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  getUserQueryOptions,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useChangePinMutation,
  useDeleteAccountMutation,
  getAuthMethodsQueryOptions,
} from "@/api/authApi";

// UI Components (shadcn/ui patterns)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TotpSettingsCard } from "@/components/TotpSettingsCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User as UserIcon,
  Shield,
  Trash2,
  CheckCircle2,
  XCircle,
  KeyRound,
  Hash,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { data: user } = useSuspenseQuery(getUserQueryOptions);
  const { data: config } = useQuery(getAuthMethodsQueryOptions);

  const updateProfileMutation = useUpdateProfileMutation();

  // State for editable fields
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(
      { displayName },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  // Helper for dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) return null;

  return (
    <div className="container max-w-4xl lg:py-20 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <Separator />

      {/* 1. PERSONAL INFORMATION */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>Basic identification details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase">
              User ID
            </Label>
            <div className="font-mono text-sm bg-muted p-2 rounded truncate">
              {user.id}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase">
              Email Address
            </Label>
            <div className="flex items-center gap-2">
              <span>{user.email}</span>
              {user.emailVerified ? (
                <Badge
                  variant="secondary"
                  className="text-green-600 bg-green-50"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600">
                  <XCircle className="w-3 h-3 mr-1" /> Unverified
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase">
              Display Name
            </Label>
            {isEditing ? (
              <div className="flex gap-2 max-w-xs">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={handleUpdateProfile}
                  disabled={updateProfileMutation.isPending}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {user.displayName || "Not set"}
                </span>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase">
              Account Roles
            </Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.roles.map((role) => (
                <Badge
                  key={role}
                  variant={role === "admin" ? "default" : "secondary"}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase">
              Joined
            </Label>
            <div>{formatDate(user.createdAt)}</div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase">
              Last Login
            </Label>
            <div>{formatDate(user.lastLoginAt)}</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SECURITY SETTINGS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your password and authentication methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* --- TOTP SECTION --- */}
          {config?.methods.includes("totp") && (
            <TotpSettingsCard isEnabled={!!user.totpEnabled} />
          )}
          {/* Change Password Dialog */}
          {config?.methods.includes("password") && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
              </div>
              <ChangePasswordDialog />
            </div>
          )}

          {/* Change PIN Dialog */}
          {config?.methods.includes("pin") && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Security PIN</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your numeric PIN
                  </p>
                </div>
              </div>
              <ChangePinDialog />
            </div>
          )}
          {/* Active Sessions info could go here */}
        </CardContent>
      </Card>

      {/* 3. DANGER ZONE */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            <CardTitle>Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions regarding your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently remove your account and all data.
              </p>
            </div>
            <DeleteAccountDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- SUB-COMPONENTS (DIALOGS) ---

function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const { mutate, isPending } = useChangePasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setOpen(false);
          setCurrent("");
          setNew("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password to set a new one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ChangePinDialog() {
  const [open, setOpen] = useState(false);
  const [currentPin, setCurrent] = useState("");
  const [newPin, setNew] = useState("");
  const { mutate, isPending } = useChangePinMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { currentPin, newPin },
      {
        onSuccess: () => {
          setOpen(false);
          setCurrent("");
          setNew("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change PIN</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change PIN</DialogTitle>
          <DialogDescription>
            Enter your current PIN to set a new one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current PIN</Label>
            <Input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              required
              value={currentPin}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>New PIN</Label>
            <Input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              required
              minLength={4}
              value={newPin}
              onChange={(e) => setNew(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update PIN"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccountDialog() {
  const [confirmation, setConfirmation] = useState("");
  const { mutate, isPending } = useDeleteAccountMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label>
            Type <span className="font-mono font-bold">DELETE</span> to confirm
          </Label>
          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="DELETE"
          />
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={confirmation !== "DELETE" || isPending}
            onClick={() => mutate()}
          >
            {isPending ? "Deleting..." : "Confirm Deletion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
