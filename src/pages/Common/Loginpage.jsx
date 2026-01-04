import React, { useState } from "react";
import { Mail, Lock, Blend } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ab1 from "/src/assets/ab6.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [login, setLogin] = useState({ Email: "", Password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      const meRes = await fetch(`${BASE_URL}/api/users/me`, {
        credentials: "include",
      });
      const me = await meRes.json();

      toast.success("Login successful");
      navigate(
        me.Role?.toLowerCase() === "seeker" ? "/seekerhome" : "/recruiterhome"
      );
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex bg-gradient-to-br from-indigo-50 via-white to-sky-100">
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 mb-10 cursor-pointer"
          >
            <Blend size={34} className="text-blue-700" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              WORK<span className="text-blue-700">VIBE</span>
            </h1>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">Log In</h2>
          <p className="text-gray-500 text-sm mt-2 mb-8">
            Welcome back! Let’s continue your journey with WorkVibe.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-600">
              <Mail size={18} className="text-gray-500" />
              <input
                name="Email"
                type="email"
                value={login.Email}
                onChange={handleChange}
                required
                placeholder="Email address"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-600">
              <Lock size={18} className="text-gray-500" />
              <input
                name="Password"
                type={showPwd ? "text" : "password"}
                value={login.Password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full bg-transparent outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="text-xs font-bold cursor-pointer text-blue-700 hover:underline"
              >
                {showPwd ? "HIDE" : "SHOW"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <img
          src={ab1}
          alt="WorkVibe background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex items-center h-full px-14">
          <div className="max-w-md">
            <h1 className="text-white text-4xl font-extrabold leading-tight mb-4">
              Welcome Back to WorkVibe
            </h1>

            <p className="text-white/90 text-base leading-relaxed">
              Log in to access your dashboard, track job applications, explore
              new opportunities, and stay connected with recruiters — all in one
              place.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="text-white/80 text-sm">
                Don’t have an account?
              </span>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 cursor-pointer rounded-lg border border-white/40 text-white font-bold hover:bg-white hover:text-gray-900 transition"
              >
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
