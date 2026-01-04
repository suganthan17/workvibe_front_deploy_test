import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileGuard = ({ role, children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const url =
          role === "seeker"
            ? `${BASE_URL}/api/seeker/profile`
            : `${BASE_URL}/api/recruiter/profile`;

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (
          (role === "seeker" &&
            (!data.basicInfo?.fullName || !data.basicInfo?.phone)) ||
          (role === "recruiter" &&
            (!data.basicInfo?.name || !data.companyInfo?.name))
        ) {
          navigate(
            role === "seeker" ? "/seeker/profile" : "/recruiter/profile"
          );
          return;
        }

        setChecking(false);
      } catch {
        navigate("/login");
      }
    };
    checkProfile();
  }, [navigate, role]);

  if (checking) return null;

  return children;
};

export default ProfileGuard;
