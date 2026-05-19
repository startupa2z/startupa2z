import { useEffect, useState } from "react";
import { Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ApiError, getLinkedInOAuthUrl, sendOtp, verifyOtp } from "@/lib/api";
import { assignTopLevel } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup";

type AuthDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const inputClass = "rounded-xl h-11";
const ctaClass =
  "w-full h-11 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold";
const linkedInClass =
  "w-full h-11 rounded-full gap-2 border-border text-foreground hover:bg-muted/50";

function FormField({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function LinkedInSignIn({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>
      <Button
        type="button"
        variant="outline"
        className={linkedInClass}
        onClick={onClick}
        disabled={loading}
      >
        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
        Sign in with LinkedIn
      </Button>
    </>
  );
}

function OtpStep({
  otp,
  setOtp,
  loading,
  onVerify,
  onBack,
}: {
  otp: string;
  setOtp: (v: string) => void;
  loading: boolean;
  onVerify: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5 pt-1">
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        className={ctaClass}
        disabled={loading || otp.length < 6}
        onClick={onVerify}
      >
        {loading ? "Verifying..." : "Verify & sign in"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm text-muted-foreground hover:text-foreground"
        onClick={onBack}
      >
        ← Use a different email
      </Button>
    </div>
  );
}

const AuthDialog = ({ children, open: controlledOpen, onOpenChange }: AuthDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [mode, setMode] = useState<AuthMode>("signin");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [otp, setOtp] = useState("");

  const resetForm = () => {
    setOtpStep(false);
    setMode("signin");
    setEmail("");
    setFullName("");
    setOrganization("");
    setOtp("");
    setLoading(false);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleModeChange = (value: string) => {
    setMode(value as AuthMode);
    setOtpStep(false);
    setOtp("");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (mode === "signup" && (!fullName.trim() || !organization.trim())) {
      toast({
        title: "Missing details",
        description: "Please enter your full name and organization.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await sendOtp({
        email: trimmedEmail,
        mode,
        fullName: mode === "signup" ? fullName.trim() : undefined,
        organization: mode === "signup" ? organization.trim() : undefined,
      });
    } catch (err) {
      setLoading(false);
      toast({
        title: "Could not send code",
        description: err instanceof ApiError ? err.message : "Something went wrong.",
        variant: "destructive",
      });
      return;
    }
    setLoading(false);

    setOtpStep(true);
    toast({
      title: "Check your email",
      description: `We sent a one-time code to ${trimmedEmail}.`,
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;

    setLoading(true);
    try {
      const { session } = await verifyOtp({ email: email.trim(), token: otp });
      const { error } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      if (error) throw error;
    } catch (err) {
      setLoading(false);
      toast({
        title: "Invalid code",
        description: err instanceof ApiError ? err.message : "Verification failed.",
        variant: "destructive",
      });
      return;
    }
    setLoading(false);

    toast({ title: "Welcome!", description: "You're signed in." });
    setOpen(false);
  };

  const handleLinkedIn = async () => {
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { url } = await getLinkedInOAuthUrl(redirectTo);
      assignTopLevel(url);
    } catch (err) {
      setLoading(false);
      toast({
        title: "LinkedIn sign-in failed",
        description: err instanceof ApiError ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2">
            <img
              src="/icon-only-transparent.webp"
              alt=""
              className="h-10 w-10"
              aria-hidden
            />
          </div>
          <DialogTitle className="font-heading text-2xl text-primary">
            {otpStep ? "Enter your code" : "Welcome to Startupa2z"}
          </DialogTitle>
          <DialogDescription>
            {otpStep
              ? `We sent a 6-digit code to ${email}`
              : mode === "signup"
                ? "Join founders, investors, and builders in the Bay Area."
                : "Sign in to RSVP, save events, and connect with the community."}
          </DialogDescription>
        </DialogHeader>

        {otpStep ? (
          <OtpStep
            otp={otp}
            setOtp={setOtp}
            loading={loading}
            onVerify={handleVerifyOtp}
            onBack={() => {
              setOtpStep(false);
              setOtp("");
            }}
          />
        ) : (
          <Tabs value={mode} onValueChange={handleModeChange} className="mt-1">
            <TabsList className="grid w-full grid-cols-2 h-auto rounded-full bg-muted p-1">
              <TabsTrigger
                value="signin"
                className="rounded-full text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-full text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-5 space-y-4">
              <form onSubmit={handleSendOtp} className="space-y-4">
                <FormField
                  id="signin-email"
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                  placeholder="you@company.com"
                />
                <Button type="submit" className={ctaClass} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
              <LinkedInSignIn loading={loading} onClick={handleLinkedIn} />
            </TabsContent>

            <TabsContent value="signup" className="mt-5 space-y-4">
              <form
                onSubmit={handleSendOtp}
                className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4"
              >
                <FormField
                  id="signup-name"
                  label="Full name"
                  required
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Jane Doe"
                />
                <FormField
                  id="signup-org"
                  label="Organization"
                  required
                  value={organization}
                  onChange={setOrganization}
                  placeholder="Your company or fund"
                />
                <FormField
                  id="signup-email"
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                  placeholder="you@company.com"
                />
                <Button type="submit" className={ctaClass} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
              <LinkedInSignIn loading={loading} onClick={handleLinkedIn} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
