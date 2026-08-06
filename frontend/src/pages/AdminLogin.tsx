import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, setToken } from "@/lib/auth";
import { adminPasswordLogin, ApiError } from "@/lib/api";
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
import { KeyRound, ShieldCheck, User } from "lucide-react";
import SEO from "@/components/SEO";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login | Startupa2z";
    if (getToken()) navigate("/admin/submissions", { replace: true });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    try {
      const { session } = await adminPasswordLogin({ username: username.trim(), password });
      setToken(session.access_token);
      navigate("/admin/submissions", { replace: true });
    } catch (err) {
      toast({
        title: "Could not sign in",
        description: err instanceof ApiError ? err.message : "Sign-in failed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Login | StartupA2Z.org"
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
              alt="StartupA2Z.org logo"
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
                Welcome back
              </CardTitle>
              <CardDescription>
                Sign in to access the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-username"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
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
