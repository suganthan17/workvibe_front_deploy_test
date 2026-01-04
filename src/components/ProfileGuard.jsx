import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileGuard = ({ role, children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkProfile = async () => {
      try {
        const url =
          role === "seeker"
            ? `${BASE_URL}/api/seeker/profile`
            : `${BASE_URL}/api/recruiter/profile`;

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await res.json();

        const isValid =
          role === "seeker"
            ? data.basicInfo?.fullName && data.basicInfo?.phone
            : data.basicInfo?.name && data.companyInfo?.name;

        if (!isValid) {
          navigate(
            role === "seeker" ? "/seeker/profile" : "/recruiter/profile",
            { replace: true }
          );
          return;
        }

        if (mounted) {
          setAllowed(true);
          setChecking(false);
        }
      } catch {
        navigate("/login", { replace: true });
      }
    };

    checkProfile();

    return () => {
      mounted = false;
    };
  }, [navigate, role]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (!allowed) return null;

  return children;
};

export default ProfileGuard;
