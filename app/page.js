"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginSIMRS = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      const role = data.user.role;

      console.log(role);
      console.log(data);

      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (role === "DOKTER") {
        router.push("/dashboard/dokter");
      } else if (role === "PENDAFTARAN") {
        router.push("/dashboard/pendaftaran");
      } else {
        alert("Role tidak dikenali");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#F8FAFC] text-[#0b1c30] font-sans relative">
      <main className="w-full max-w-md px-4 md:px-0 flex flex-col items-center m-0">
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-[32px] leading-10 tracking-[-0.02em] font-bold text-[#006194] text-center">
            SIMRS
          </h1>
          <p className="text-sm text-[#3f4850] mt-1 text-center">Portal SIMRS</p>
        </div>

        <div className="w-full rounded-xl p-8 bg-white border border-[#E2E8F0] shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-[#0b1c30]">
                Email <span className="text-[#006194]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@medico.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 bg-white border border-[#D1D5DB] text-base text-[#0b1c30] transition-all duration-200 focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-[#0b1c30]">
                Password <span className="text-[#006194]">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-3 bg-white border border-[#D1D5DB] text-base text-[#0b1c30] transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-[#006194]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006194] transition-colors mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </main>

      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-sm text-[#3f4850]">© 2026 Muhammad Rizki Haikal.</p>
      </footer>
    </div>
  );
};

export default LoginSIMRS;