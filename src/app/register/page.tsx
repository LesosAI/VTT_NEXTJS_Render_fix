"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the terms and conditions");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.email,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-sm mx-auto w-full px-4 py-8"
    >
      <h1 className="text-4xl text-white font-bold mb-8">
        Ready to Get Started?
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                className="block text-sm font-medium mb-2 text-white/80"
                htmlFor="firstName"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
                required
              />
            </div>
            <div>
              <Label
                className="block text-sm font-medium mb-2 text-white/80"
                htmlFor="lastName"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
                required
              />
            </div>
          </div>

          <div>
            <Label
              className="block text-sm font-medium mb-2 text-white/80"
              htmlFor="email"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
              required
            />
          </div>

          <div>
            <Label
              className="block text-sm font-medium mb-2 text-white/80"
              htmlFor="password"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="form-input w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-white/20 bg-[#0e1826] text-white focus:ring-white"
            />
            <span className="text-white/80">
              By clicking Sign up, I agree to the{" "}
              <Link href="#" className="text-white hover:text-white/90">
                Terms of Use
              </Link>
            </span>
          </label>
        </div>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full mt-6 btn bg-white hover:bg-white/90 text-[#0e1826] font-semibold px-6 py-2.5 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
          disabled={!agreed}
        >
          Sign up
        </Button>
      </form>

      <div className="pt-6 mt-8 border-t border-white/10">
        <div className="text-sm text-white/80">
          Already have an account?{" "}
          <Link
            className="font-medium text-white hover:text-white/90 transition-colors duration-150"
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Register() {
  return (
    <main className="bg-[#0e1826]">
      <div className="relative flex">
        <div className="w-full md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="block">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    {/* ... existing SVG code ... */}
                  </svg>
                </Link>
              </div>
            </div>
            <RegisterForm />
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 relative" aria-hidden="true">
          <Image
            className="object-cover"
            src="/images/697683_Warrior charging in combat with his shiny armor.png"
            alt="Authentication"
            priority
            fill
            sizes="50vw"
          />
        </div>
      </div>
    </main>
  );
}
