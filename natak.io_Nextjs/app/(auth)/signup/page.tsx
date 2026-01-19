"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-zinc-950 border border-white/10",
                    }
                }}
            />
        </div>
    );
}
