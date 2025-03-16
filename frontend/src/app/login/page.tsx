"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <form
        className="flex flex-col w-full max-w-md gap-6 p-8 rounded-lg bg-slate-700 shadow-lg"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Login
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-gray-200">
            Username/Email
          </label>
          <input
            type="text"
            className="p-3 rounded text-black"
            value={username}
            id="username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-gray-200">
            Password
          </label>
          <input
            type="password"
            className="p-3 rounded text-black"
            value={password}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-2">
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-3 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="text-center text-sm text-gray-300 mt-2">
          Don't have an account?{" "}
          <a href="/register" className="text-teal-400 hover:underline">
            Register here
          </a>
        </div>
      </form>
    </div>
  );
}
