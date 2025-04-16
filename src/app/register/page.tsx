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
import { AnimatePresence } from "framer-motion";
import { ModernLoader } from "@/components/ModernLoader";

interface RegisterFormProps {
  isLoading: (state: boolean) => void;
}

function RegisterForm({ isLoading }: RegisterFormProps) {
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
    isLoading(true);
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
            firstName: formData.firstName,
            lastName: formData.lastName,
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
    } finally {
      isLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
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
    </>
  );
}

export default function Register() {

  const [isLoading, setIsLoading] = useState(false);

  const [posterUrl] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-poster-00001.jpg"
  );
  const [videoMp4Url] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.mp4"
  );
  const [videoWebmUrl] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.webm"
  );

  return (
    <main className="min-h-screen w-full relative overflow-hidden">

      <AnimatePresence>
        {isLoading && <ModernLoader />}
      </AnimatePresence>

      {/* Full-screen video background */}
      <div className="absolute inset-0 w-full h-full before:absolute before:inset-0 before:z-10 before:bg-gradient-to-b before:from-[#e900264d] before:to-[#0e1826]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ backgroundImage: `url(${posterUrl})` }}
          poster={posterUrl}
        >
          <source src={videoMp4Url} type="video/mp4" />
          <source src={videoWebmUrl} type="video/webm" />
        </video>
      </div>

      {/* Modal Container */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0e1826]/90 backdrop-blur-lg rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xl w-full mx-4"
        >
          {/* Video section */}
          <div className="h-[300px] relative rounded-t-xl overflow-hidden before:absolute before:inset-0 before:z-10 before:bg-gradient-to-b before:from-[#e900264d] before:to-[#0e1826]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ backgroundImage: `url(${posterUrl})` }}
              poster={posterUrl}
            >
              <source src={videoMp4Url} type="video/mp4" />
              <source src={videoWebmUrl} type="video/webm" />
            </video>
          </div>

          {/* Content section */}
          <div className="p-8">
            <RegisterForm isLoading={setIsLoading} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
