"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/context/LoginContext";
import { motion } from "framer-motion";
import Banner from "@/components/Banner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bannerErrorOpen, setBannerErrorOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useLogin();
  const [posterUrl] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-poster-00001.jpg"
  );
  const [videoMp4Url] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.mp4"
  );
  const [videoWebmUrl] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.webm"
  );

  // Clear error when email or password changes
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
      setBannerErrorOpen(false);
    }
  }, [email, password]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(email, data.is_subaccount);
        if (data.has_subscription) {
          router.push("/dashboard");
        } else {
          router.push("/select-plan");
        }
      } else {
        setErrorMessage(data.error || "An error occurred. Please try again.");
        setBannerErrorOpen(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setBannerErrorOpen(true);
    }
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
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

      {/* Logo */}
      <div className="relative z-20 flex items-center h-16 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="block">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <defs>
              <linearGradient
                x1="28.538%"
                y1="20.229%"
                x2="100%"
                y2="108.156%"
                id="logo-a"
              >
                <stop stopColor="#B7ACFF" stopOpacity="0" offset="0%" />
                <stop stopColor="#B7ACFF" offset="100%" />
              </linearGradient>
              <linearGradient
                x1="88.638%"
                y1="29.267%"
                x2="22.42%"
                y2="100%"
                id="logo-b"
              >
                <stop stopColor="#7BC8FF" stopOpacity="0" offset="0%" />
                <stop stopColor="#7BC8FF" offset="100%" />
              </linearGradient>
            </defs>
            <rect fill="#8470FF" width="32" height="32" rx="16" />
            <path
              d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
              fill="#755FF8"
            />
            <path
              d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
              fill="url(#logo-a)"
            />
            <path
              d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
              fill="url(#logo-b)"
            />
          </svg>
        </Link>
      </div>

      {/* Modal Container */}
      <div className="relative z-20 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0e1826]/90 backdrop-blur-lg rounded-xl shadow-2xl max-w-sm w-full mx-4 p-8"
        >
          <h1 className="text-4xl text-white font-bold mb-8">Welcome Back!</h1>
          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label
                  className="block text-sm font-medium mb-2 text-white/80"
                  htmlFor="email"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
                  type="email"
                  placeholder="Enter your email"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
                    type={showPassword ? "text" : "password"}
                    autoComplete="on"
                    placeholder="Enter your password"
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
            <div className="flex items-center justify-between mt-8">
              <div className="mr-1">
                <Link
                  className="text-sm text-white/80 hover:text-white transition-colors duration-150"
                  href="/reset-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                className="btn bg-white hover:bg-white/90 text-[#0e1826] font-semibold px-6 py-2.5 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap ml-3"
              >
                Sign In
              </Button>
            </div>
          </form>
          {errorMessage && bannerErrorOpen && (
            <Banner type="error" onClose={() => setBannerErrorOpen(false)}>
              {errorMessage}
            </Banner>
          )}
          {/* Footer */}
          <div className="pt-6 mt-8 border-t border-white/10">
            <div className="text-sm text-white/80">
              Don&apos;t you have an account?{" "}
              <Link
                className="font-medium text-white hover:text-white/90 transition-colors duration-150"
                href="/register"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
