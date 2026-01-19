"use client";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <SignIn
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
