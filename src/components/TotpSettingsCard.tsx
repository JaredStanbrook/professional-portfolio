// src/components/profile/TotpSettingsCard.tsx
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Copy, Check, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import {
  useSetupTotpMutation,
  useEnableTotpMutation,
  useDisableTotpMutation,
  type TotpSetupResponse,
} from "@/api/authApi";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TotpSettingsProps {
  isEnabled: boolean;
}

export function TotpSettingsCard({ isEnabled }: TotpSettingsProps) {
  // State for the Dialog Flow
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"LOADING" | "SCAN" | "SUCCESS">("LOADING");

  // State for Data
  const [secretData, setSecretData] = useState<TotpSetupResponse | null>(null);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Mutations
  const setupMutation = useSetupTotpMutation();
  const enableMutation = useEnableTotpMutation();
  const disableMutation = useDisableTotpMutation();

  // 1. Start Setup: Open Dialog & Fetch Secret
  const handleStartSetup = () => {
    setOpen(true);
    setStep("LOADING");
    setCode("");

    setupMutation.mutate(undefined, {
      onSuccess: (data) => {
        setSecretData(data);
        setStep("SCAN");
      },
      onError: () => {
        setOpen(false); // Close if we can't generate a secret
      },
    });
  };

  // 2. Verify Code: Send secret + code to backend
  const handleVerify = () => {
    if (!secretData) return;

    enableMutation.mutate(
      { secret: secretData.secret, code },
      {
        onSuccess: () => {
          setStep("SUCCESS");
          // Close dialog automatically after 2 seconds
          setTimeout(() => setOpen(false), 2000);
        },
      }
    );
  };

  // Helper: Copy Secret to Clipboard
  const copyToClipboard = () => {
    if (secretData?.secret) {
      void navigator.clipboard.writeText(secretData.secret);
      setCopied(true);
      toast.success("Secret copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-full ${isEnabled ? "bg-primary/10" : "bg-muted"}`}>
          {isEnabled ? (
            <ShieldCheck className="h-5 w-5 text-primary" />
          ) : (
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">Authenticator App</h4>
            {isEnabled && (
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary shadow-none">
                Enabled
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Use an app like Google Authenticator or Authy to generate verification codes.
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {isEnabled ? (
          // STATE: ENABLED (Show Disable Button)
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
            disabled={disableMutation.isPending}
            onClick={() => {
              if (confirm("Are you sure you want to disable 2FA?")) {
                disableMutation.mutate();
              }
            }}>
            {disableMutation.isPending ? "Disabling..." : "Disable"}
          </Button>
        ) : (
          // STATE: DISABLED (Show Enable Button)
          <Button variant="outline" size="sm" onClick={handleStartSetup}>
            Enable
          </Button>
        )}

        {/* SETUP DIALOG CONTENT */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setup Authenticator</DialogTitle>
            <DialogDescription>Follow the steps below to secure your account.</DialogDescription>
          </DialogHeader>

          {/* STEP 1: LOADING */}
          {step === "LOADING" && (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* STEP 2: SCAN QR */}
          {step === "SCAN" && secretData && (
            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-white/50 dark:bg-black/20">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <QRCodeCanvas
                    value={secretData.otpauthUrl}
                    size={150}
                    level={"H"}
                    marginSize={1}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Scan this QR code with your authenticator app.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                  Or enter code manually
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input readOnly value={secretData.secret} className="font-mono text-xs pr-10" />
                  </div>
                  <Button size="icon" variant="outline" onClick={copyToClipboard}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="code">Verify Code</Label>
                <Input
                  id="code"
                  placeholder="000 000"
                  className="text-center text-lg tracking-[0.5em] font-mono"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === "SUCCESS" && (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">You're all set!</h3>
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication is now enabled on your account.
                </p>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <DialogFooter className="sm:justify-between gap-2">
            {step === "SCAN" && (
              <>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={enableMutation.isPending || code.length !== 6}>
                  {enableMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Activate
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
