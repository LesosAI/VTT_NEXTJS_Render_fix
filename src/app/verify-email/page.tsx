"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const videoRef = useRef<HTMLVideoElement>(null);

    const [message, setMessage] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const hasSentRef = useRef(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.error("Error attempting to play video:", error);
            });
            
            // Add error event listener
            const handleError = (e: Event) => {
                console.error("Video error event:", e);
                console.error("Video error details:", videoRef.current?.error);
            };
            
            videoRef.current.addEventListener('error', handleError);
            
            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('error', handleError);
                }
            };
        }
    }, []);


    useEffect(() => {
        if (token) {
            setVerifying(true);
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-email?token=${token}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setVerified(true);
                        setMessage("Email verified successfully!");

                    } else {
                        setMessage(data.error || "Verification failed.");
                    }
                })
                .catch(() => setMessage("Something went wrong."))
                .finally(() => setVerifying(false));
        }
    }, [token]);


    useEffect(() => {
        if (!token && email && !hasSentRef.current) {
            hasSentRef.current = true;
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/send-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setMessage(data.message || "Check your email.");
                })
                .catch(() => setMessage("Failed to send verification email."));
        }
    }, [token, email]);


    const handleResend = async () => {
        setIsResending(true);
        if (!email) {
            setMessage("Missing email.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/send-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setMessage(data.message || "Check your email again.");
        } catch {
            setMessage("Failed to resend email.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0e1826] text-white px-4">
            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://ehsy09fkhluxh2uw.public.blob.vercel-storage.com/fire-and-sparks.mp4"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="relative z-20 max-w-md w-full bg-[#0e1826]/60 border border-white/10 rounded-lg p-8 shadow-xl text-center backdrop-blur-sm">
                {verifying ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin h-6 w-6" />
                        <p>Verifying your email...</p>
                    </div>
                ) : token ? (
                    <>
                        <h1 className="text-xl font-semibold mb-2">{verified ? "Success!" : "Oops!"}</h1>
                        <p className="mb-4">{message}</p>
                        <Button onClick={() => (window.location.href = "/login")} className="w-full">
                            Go to Login
                        </Button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
                        <p className="text-white/70 mb-6">
                            We've sent a verification link to <span className="font-semibold">{email}</span>.
                        </p>
                        <Button onClick={handleResend} className={`w-full ${isResending ? "bg-gray-600 cursor-not-allowed opacity-50" : ""}`} disabled={isResending}>
                            {isResending ? (
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
                                "Resend Email"
                            )}
                        </Button>
                        {message && <p className="mt-4 text-sm">{message}</p>}
                    </>
                )}
            </div>
        </main>
    );
}
