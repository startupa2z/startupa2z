import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Linkedin, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/lib/auth";
import { ApiError, exchangeLinkedInCode, getLinkedInOAuthUrl, sendOtp, verifyOtp } from "@/lib/api";
import { assignTopLevel } from "@/lib/navigation";
import { profileCompletionUrl } from "@/lib/member-profile";
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
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup";
type AuthStep = "choice" | "email" | "otp";

type AuthDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  redirectTo?: string;
  initialMode?: AuthMode;
  initialEmail?: string;
};

const inputClass = "h-11 rounded-xl";
const ctaClass = "h-11 w-full rounded-full bg-secondary font-semibold text-secondary-foreground hover:bg-secondary/90";

const AuthDialog = ({ children, open: controlledOpen, onOpenChange, redirectTo = "/welcome", initialMode = "signin", initialEmail = "" }: AuthDialogProps) => {
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>("choice");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const handledLinkedInCallback = useRef(false);

  useEffect(() => {
    if (handledLinkedInCallback.current) return;
    const params = new URLSearchParams(window.location.search);
    const linkedinCode = params.get("linkedin_code");
    const linkedinError = params.get("linkedin_error");
    if (!linkedinCode && !linkedinError) return;

    handledLinkedInCallback.current = true;
    params.delete("linkedin_code");
    params.delete("linkedin_error");
    const cleanQuery = params.toString();
    const cleanedPath = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", cleanedPath);

    if (linkedinError) {
      toast({ title: "LinkedIn authentication was not completed", description: "Please try again or continue with email.", variant: "destructive" });
      return;
    }

    void exchangeLinkedInCode(linkedinCode as string)
      .then(({ session, user }) => {
        setToken(session.access_token);
        toast({ title: "Welcome to StartupA2Z.org!" });
        const resumeRsvp = new URLSearchParams(window.location.search).get("rsvp") === "1";
        const destination = resumeRsvp ? cleanedPath : redirectTo;
        navigate(user.profile_complete ? destination : profileCompletionUrl(destination), { replace: true });
      })
      .catch((error) => toast({
        title: "LinkedIn authentication failed",
        description: error instanceof ApiError ? error.message : "Please try again.",
        variant: "destructive",
      }));
  }, [navigate, redirectTo]);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setEmail(initialEmail);
      setStep(initialEmail ? "email" : "choice");
    } else {
      setStep("choice");
      setLoading(false);
      setEmail("");
      setOtp("");
    }
  }, [initialEmail, initialMode, open]);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStep("choice");
    setOtp("");
  };

  const handleLinkedIn = async () => {
    setLoading(true);
    try {
      const { url } = await getLinkedInOAuthUrl(redirectTo);
      assignTopLevel(url);
    } catch (error) {
      setLoading(false);
      toast({
        title: "LinkedIn authentication is not ready",
        description: error instanceof ApiError ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await sendOtp({
        email: email.trim(),
        mode,
      });
      setStep("otp");
      toast({ title: "Check your email", description: `We sent a code to ${email.trim()}.` });
    } catch (error) {
      toast({ title: "Could not send code", description: error instanceof ApiError ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const { session, user } = await verifyOtp({ email: email.trim(), token: otp });
      setToken(session.access_token);
      toast({ title: mode === "signin" ? "Welcome back!" : "Welcome to StartupA2Z.org!" });
      setOpen(false);
      navigate(user.profile_complete ? redirectTo : profileCompletionUrl(redirectTo));
    } catch (error) {
      toast({ title: "Invalid code", description: error instanceof ApiError ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="mb-2 flex justify-center sm:justify-start"><img src="/icon-only-transparent.webp" alt="" className="h-10 w-10" aria-hidden /></div>
          <DialogTitle className="font-heading text-2xl text-primary">{step === "otp" ? "Verify your email" : mode === "signin" ? "Sign in" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {step === "choice" && (mode === "signin" ? "Welcome back. Choose how you want to sign in." : "Join the StartupA2Z.org community using LinkedIn or email.")}
            {step === "email" && (mode === "signin" ? "Enter the email address connected to your account." : "Create your membership using your email address.")}
            {step === "otp" && `Enter the 6-digit code sent to ${email}.`}
          </DialogDescription>
        </DialogHeader>

        {step !== "otp" && (
          <div className="grid grid-cols-2 rounded-xl bg-muted p-1">
            <button type="button" onClick={() => changeMode("signin")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${mode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>Sign In</button>
            <button type="button" onClick={() => changeMode("signup")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>Sign Up</button>
          </div>
        )}

        {step === "choice" && (
          <div className="space-y-4 pt-2">
            <Button type="button" className="h-12 w-full rounded-full bg-[#0A66C2] text-white hover:bg-[#0958a8]" onClick={handleLinkedIn} disabled={loading}>
              <Linkedin className="mr-2 h-5 w-5" /> {loading ? "Connecting..." : `${mode === "signin" ? "Sign in" : "Sign up"} with LinkedIn`}
            </Button>
            <div className="flex items-center gap-3"><Separator className="flex-1" /><span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span><Separator className="flex-1" /></div>
            <Button type="button" variant="outline" className="h-12 w-full rounded-full" onClick={() => setStep("email")}>
              <Mail className="mr-2 h-5 w-5" /> {mode === "signin" ? "Sign in with email address" : "Sign up with email address"}
            </Button>
            <button type="button" onClick={() => changeMode(mode === "signin" ? "signup" : "signin")} className="w-full text-center text-sm text-muted-foreground hover:text-primary">
              {mode === "signin" ? "New to StartupA2Z.org? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        )}

        {step === "email" && (
          <form onSubmit={handleEmail} className="space-y-4 pt-2">
            <div className="space-y-1.5"><Label htmlFor="auth-email">Email address *</Label><Input id="auth-email" type="email" className={inputClass} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jane@startup.com" autoComplete="email" /></div>
            <Button type="submit" className={ctaClass} disabled={loading}>{loading ? "Sending..." : "Send verification code"}</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("choice")}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
          </form>
        )}

        {step === "otp" && (
          <div className="space-y-5 pt-2">
            <div className="flex justify-center"><InputOTP maxLength={6} value={otp} onChange={setOtp}><InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((index) => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup></InputOTP></div>
            <Button type="button" className={ctaClass} disabled={loading || otp.length < 6} onClick={handleVerify}>{loading ? "Verifying..." : mode === "signin" ? "Verify and sign in" : "Verify and sign up"}</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep("email"); setOtp(""); }}><ArrowLeft className="mr-2 h-4 w-4" /> Change email</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
