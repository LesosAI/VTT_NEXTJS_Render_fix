"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [posterUrl] = useState(
        "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-poster-00001.jpg"
    );
    const [videoMp4Url] = useState(
        "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.mp4"
    );
    const [videoWebmUrl] = useState(
        "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.webm"
    );

    const handleSubmit = async () => {
        if (!token) {
            setMessage("Missing or invalid token.");
            return;
        }
        if (password !== confirm) {
            setMessage("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setMessage("Password reset successful!");
            } else {
                setMessage(data.error || "Failed to reset password.");
            }
        } catch {
            setMessage("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0e1826] text-white px-4">
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
            <div className="relative z-20 max-w-md w-full bg-[#0e1826]/60 border border-white/10 rounded-lg p-8 shadow-xl text-center backdrop-blur-sm">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                {success ? (
                    <>
                        <p className="mb-4">{message}</p>
                        <Button className="w-full" onClick={() => router.push("/login")}>
                            Go to Login
                        </Button>
                    </>
                ) : (
                    <div className="space-y-6"> 
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
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
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:border-white focus:ring-1 focus:ring-white"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <Button className={`w-full ${isLoading ? "bg-gray-600 cursor-not-allowed opacity-50" : ""}`} onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                        {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
                    </div>
                )}
            </div>
        </main>
    );
}
