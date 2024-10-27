"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import useAuthStore from "@/store/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PasswordInput = ({
  id,
  placeholder,
  autoComplete,
}: {
  id: string;
  placeholder: string;
  autoComplete: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={id}
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        autoCapitalize="none"
        autoComplete={autoComplete}
        autoCorrect="off"
        required
        className="pr-10 h-11 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const signup = useAuthStore((state) => state.signup);
  const googleSignup = useAuthStore((state) => state.googleSignup);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const phone = formData.get("phone") as string;

    try {
      const message = await signup(email, password, username, phone);

      toast({
        title: "Registration Successful",
        description: message,
        variant: "default",
      });

      setIsRegistered(true);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      window.location.href = `${API_URL}/auth/google`;
    } catch (error) {
      toast({
        title: "Error",
        description: `Google sign up failed. Please try again.${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground shadow-md rounded-lg p-6 sm:p-8 w-[440px]">
      {!isRegistered ? (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-muted-foreground text-sm">Create your account</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 h-11 rounded-lg border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={handleGoogleSignup}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span>Sign up with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                Username*
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                required
                className="h-11 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email*
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="mail@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
                className="h-11 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone*
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Phone number"
                type="tel"
                autoCapitalize="none"
                autoComplete="tel"
                autoCorrect="off"
                required
                className="h-11 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password*
              </Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign In
            </Link>
          </p>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Registration Successful</h2>
          <p className="text-muted-foreground">
            Please check your email to verify your account.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </div>
      )}
    </div>
  );
}
