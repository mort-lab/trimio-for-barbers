"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AnimatedGradientBackground from "@/components/animated-gradient-background";
import { ModeToggle } from "@/components/ui/ModleToggle";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Eye, EyeOff, Scissors } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement>,
    type: "login" | "signup"
  ) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      let response;
      if (type === "login") {
        response = await api.login(email, password);
      } else {
        if (!validatePassword(password)) {
          throw new Error(
            "Password must include uppercase, lowercase, number, and special character, and be at least 8 characters long"
          );
        }
        const confirmPassword = formData.get("confirmPassword") as string;
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        response = await api.signup(email, password);
      }

      useAuthStore.getState().setAccessToken(response.access_token);
      useAuthStore.getState().setRefreshToken(response.refresh_token);
      useAuthStore.getState().setUser(response.user);

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError(`${type} failed. Please try again.`);
        toast({
          title: "Error",
          description: `${type} failed. Please try again.`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const PasswordInput = ({
    id,
    placeholder,
    autoComplete,
    show,
    setShow,
  }: {
    id: string;
    placeholder: string;
    autoComplete: string;
    show: boolean;
    setShow: (show: boolean) => void;
  }) => (
    <div className="relative">
      <Input
        id={id}
        name={id}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        autoCapitalize="none"
        autoComplete={autoComplete}
        autoCorrect="off"
        disabled={isLoading}
        required
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );

  return (
    <AnimatedGradientBackground>
      <div className="container flex items-center justify-center min-h-screen px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Scissors className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-center">
              Trimio for Barbers
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form
                  onSubmit={(e) => onSubmit(e, "login")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                      id="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      show={showPassword}
                      setShow={setShowPassword}
                    />
                  </div>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form
                  onSubmit={(e) => onSubmit(e, "signup")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                      id="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      show={showPassword}
                      setShow={setShowPassword}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      show={showConfirmPassword}
                      setShow={setShowConfirmPassword}
                    />
                  </div>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex justify-center">
              <ModeToggle />
            </div>
          </CardFooter>
        </Card>
      </div>
    </AnimatedGradientBackground>
  );
}
