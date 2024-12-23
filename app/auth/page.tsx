'use client'

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import Cookies from 'js-cookie'; // Import js-cookie

export default function Home() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleLogin = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: username,
                    password: password
                })
            });

            if (response.ok) {
                Cookies.set('token', username, { expires: 7 }); // Expires in 7 days

                toast.success("Logged in successfully.");
            } else {
                toast.error("Incorrect username or password.");
            }
        } catch (error) {
            toast.error("Error logging in. ");
        }
    };

    const handleSignup = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: username,
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                toast.success("Signup successful.");
                setIsLogin(true);
            } else {
                toast.error("User already exists or error occurred.");
            }
        } catch (error) {
            toast.error("Error signing up.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">
                {isLogin ? "Login" : "Signup"}
            </h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-2 w-64"
            />
            {!isLogin && (
                <input
                    type="email"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 mb-2 w-64"
                />
            )}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-2 w-64"
            />

            {isLogin ? (
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Login
                </button>
            ) : (
                <button
                    onClick={handleSignup}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Signup
                </button>
            )}

            <p className="mt-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-500 cursor-pointer ml-2"
                >
                    {isLogin ? "Signup" : "Login"}
                </span>
            </p>
        </div>
    );
}
