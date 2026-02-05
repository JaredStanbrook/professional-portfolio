import { useState } from "react";
import QRCode from "qrcode.react"; // npm install qrcode.react
import {
  useSetupTotpMutation,
  useEnableTotpMutation,
  useDisableTotpMutation,
  getUserQueryOptions,
} from "@/api/authApi";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TotpSettings() {
  const { data: user } = useQuery(getUserQueryOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"IDLE" | "SCAN" | "SUCCESS">("IDLE");
  const [secretData, setSecretData] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [code, setCode] = useState("");

  const setupMutation = useSetupTotpMutation();
  const enableMutation = useEnableTotpMutation();
  const disableMutation = useDisableTotpMutation();

  const handleStartSetup = () => {
    setupMutation.mutate(undefined, {
      onSuccess: (data) => {
        setSecretData(data);
        setStep("SCAN");
        setIsOpen(true);
      },
    });
  };

  const handleVerify = () => {
    if (!secretData) return;
    enableMutation.mutate(
      { secret: secretData.secret, code },
      {
        onSuccess: () => {
          setStep("SUCCESS");
          setIsOpen(false);
        },
      }
    );
  };

  if (!user) return null;

  return (
    <div className="border p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Secure your account with an authenticator app.
          </p>
        </div>

        {user.totpEnabled ? (
          <Button variant="destructive" onClick={() => disableMutation.mutate()}>
            Disable 2FA
          </Button>
        ) : (
          <Button onClick={handleStartSetup}>Enable 2FA</Button>
        )}
      </div>

      {/* Setup Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Authenticator</DialogTitle>
          </DialogHeader>

          {step === "SCAN" && secretData && (
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={secretData.otpauthUrl} size={180} />
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>1. Open Google Authenticator or Authy.</p>
                <p>2. Scan the QR code above.</p>
                <p>3. Enter the 6-digit code below.</p>
              </div>

              <div className="w-full space-y-2">
                <Label>Verification Code</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="text-center tracking-widest text-lg"
                  maxLength={6}
                />
              </div>

              <Button onClick={handleVerify} disabled={enableMutation.isPending} className="w-full">
                {enableMutation.isPending ? "Verifying..." : "Verify & Enable"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
