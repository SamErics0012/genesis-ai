"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Failed to login. Please check your credentials.");
        },
      });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
        <img
          src="https://pub-14dba299436441e08eb347040736b11b.r2.dev/Firefly_Gemini%20Flash_change%20lightings%20to%20puple%20%20183294.png"
          alt="Login visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full lg:w-[30%] items-center justify-center bg-black p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <Play className="h-7 w-7 text-purple-500" />
            <div className="flex items-center gap-2">
              <span className="text-xl text-white">
                GΣПΣƧIƧ ΛI
              </span>
              <span className="rounded border border-purple-500 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-purple-500">
                Beta
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Log in to your account</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600 pr-10"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-zinc-400">
            By clicking the "Log in" button, you are logging into your Genesis AI account and therefore you agree to Genesis AI{" "}
            <Link href="/terms" className="text-purple-400 hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
