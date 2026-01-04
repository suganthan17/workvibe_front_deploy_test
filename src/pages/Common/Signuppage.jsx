import React, { useState } from "react";
import { User as UserIcon, Mail, Lock, Blend } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Illustration from "/src/assets/ab4.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SignupPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    Username: "",
    Email: "",
    Password: "",
    Role: "seeker",
  });

  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const res = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful! Please log in.");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex bg-gradient-to-br from-sky-100 via-white to-indigo-50">
      {/* LEFT */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <img
          src={Illustration}
          alt="Signup Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-center px-16">
          <div className="max-w-lg">
            <h1 className="text-white text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Join WorkVibe Today
            </h1>
            <p className="text-white/95 text-base lg:text-lg leading-relaxed">
              Create your free account and start exploring career opportunities
              that fit your vibe. Build your profile, apply to jobs, and connect
              with employers — all in one place.
            </p>

            <div className="mt-8">
              <p className="text-sm text-white/90">Already a member?</p>
              <button
                onClick={() => navigate("/login")}
                className="mt-3 cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-white/40 text-white font-bold hover:bg-white hover:text-gray-900 transition"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
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

          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-2 mb-8">
            Let’s get you started. It only takes a minute.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-600">
              <UserIcon size={18} className="text-gray-500" />
              <input
                name="Username"
                value={form.Username}
                onChange={onChange}
                required
                placeholder="Full name"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-600">
              <Mail size={18} className="text-gray-500" />
              <input
                name="Email"
                type="email"
                value={form.Email}
                onChange={onChange}
                required
                placeholder="Email address"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-600">
              <Lock size={18} className="text-gray-500" />
              <input
                name="Password"
                type={showPwd ? "text" : "password"}
                value={form.Password}
                onChange={onChange}
                required
                placeholder="Password"
                className="w-full bg-transparent outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                {showPwd ? "HIDE" : "SHOW"}
              </button>
            </div>

            <div className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-600 cursor-pointer">
              <select
                name="Role"
                value={form.Role}
                onChange={onChange}
                className="w-full bg-transparent outline-none text-sm cursor-pointer"
              >
                <option value="seeker">I’m a Job Seeker</option>
                <option value="recruiter">I’m a Recruiter</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 cursor-pointer rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md transition"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
