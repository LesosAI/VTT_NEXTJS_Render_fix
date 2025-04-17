"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const [message, setMessage] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const hasSentRef = useRef(false);

    const [posterUrl] = useState(
        "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-poster-00001.jpg"
    );
    const [videoMp4Url] = useState(
        "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.mp4"
    );
    const [videoWebmUrl] = useState(
        "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.webm"
    );

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
                        <Button onClick={handleResend} className="w-full">
                            Resend Email
                        </Button>
                        {message && <p className="mt-4 text-sm">{message}</p>}
                    </>
                )}
            </div>
        </main>
    );
}
