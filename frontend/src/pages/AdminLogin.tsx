import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, setToken } from "@/lib/auth";
import { ApiError, sendOtp, verifyOtp } from "@/lib/api";
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
import { toast } from "@/hooks/use-toast";
import { Mail, ShieldCheck } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import SEO from "@/components/SEO";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login | Startupa2z";
    if (getToken()) navigate("/admin/submissions", { replace: true });
  }, [navigate]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await sendOtp({ email: trimmed, mode: "signin" });
      setOtpStep(true);
      toast({ title: "Code sent", description: `Check ${trimmed} for your one-time code.` });
    } catch (err) {
      toast({
        title: "Could not send code",
        description: err instanceof ApiError ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const { session } = await verifyOtp({ email: email.trim(), token: otp });
      setToken(session.access_token);
      navigate("/admin/submissions", { replace: true });
    } catch (err) {
      toast({
        title: "Invalid code",
        description: err instanceof ApiError ? err.message : "Verification failed.",
        variant: "destructive",
      });
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Login | StartupA2Z"
        description="Admin portal for Startupa2z."
        noindex={true}
        canonical="https://startupa2z.org/admin/login"
      />
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative w-full max-w-md space-y-6">
          <Link to="/" className="flex flex-col items-center gap-3 group">
            <img
              src="/logo-transparent.webp"
              alt="StartupA2Z logo"
              width={864}
              height={159}
              className="h-10 w-auto transition-transform group-hover:-translate-y-0.5"
            />
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-card/60 backdrop-blur px-3 py-1 rounded-full border">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Admin Portal
            </div>
          </Link>

          <Card className="border-border/60 shadow-2xl backdrop-blur-xl bg-card/80">
            <CardHeader className="space-y-1.5 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {otpStep ? "Enter your code" : "Welcome back"}
              </CardTitle>
              <CardDescription>
                {otpStep
                  ? `We sent a 6-digit code to ${email}`
                  : "Sign in with your email to access the admin dashboard."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {otpStep ? (
                <div className="space-y-5">
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
                    className="w-full"
                    disabled={loading || otp.length < 6}
                    onClick={handleVerify}
                  >
                    {loading ? "Verifying…" : "Verify & sign in"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => { setOtpStep(false); setOtp(""); }}
                  >
                    ← Use a different email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSendOtp} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@startupa2z.org"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending…" : "Send one-time code"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            ←{" "}
            <Link to="/" className="hover:text-foreground transition-colors">
              Back to startupa2z.org
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
