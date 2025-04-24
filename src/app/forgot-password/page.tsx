"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
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

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Check your email for a reset link.");
            }
            else {
                setMessage(data.error || "Failed to send reset email.");
            }
        } catch {
            setMessage("Error sending reset email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0e1826] text-white">
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
                <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 bg-[#0e1826] border-2 border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-2 transition-all duration-150 ease-in-out focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    required
                />
                <Button className={`w-full mt-4 ${isLoading ? "bg-gray-600 cursor-not-allowed opacity-50" : ""}`} onClick={handleSubmit} disabled={isLoading}>
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
                            Sending...
                        </>
                    ) : (
                        "Send Reset Link"
                    )}
                </Button>
                {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
            </div>
        </main>
    );
}
