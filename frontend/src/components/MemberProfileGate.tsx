import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, fetchMemberProfile } from "@/lib/api";
import { clearToken, isMemberAuthenticated } from "@/lib/auth";
import { profileCompletionUrl } from "@/lib/member-profile";

const MemberProfileGate = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!isMemberAuthenticated() || location.pathname === "/complete-profile") {
      setChecking(false);
      return;
    }

    let active = true;
    setChecking(true);
    void fetchMemberProfile()
      .then(({ user }) => {
        if (!active || user.profile_complete) return;
        navigate(profileCompletionUrl(`${location.pathname}${location.search}${location.hash}`), { replace: true });
      })
      .catch((error) => {
        if (active && error instanceof ApiError && error.status === 401) clearToken();
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, [location.hash, location.pathname, location.search, navigate]);

  if (checking) return <main className="min-h-screen bg-background" aria-label="Checking member profile" />;
  return children;
};

export default MemberProfileGate;
