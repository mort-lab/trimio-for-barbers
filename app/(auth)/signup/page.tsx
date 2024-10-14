"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import useAuthStore from "@/store/authStore"; // Importa tu store de Zustand
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

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
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // Nuevo estado para manejar el registro exitoso
  const router = useRouter();
  const { toast } = useToast();

  const signup = useAuthStore((state) => state.signup); // Accedemos a la función de registro de Zustand

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const phone = formData.get("phone") as string;

    try {
      // Llamamos a la función `signup` de Zustand para registrar al usuario
      const message = await signup(email, password, username, phone);

      toast({
        title: "Registration Successful",
        description: message, // Mensaje que indica que el usuario debe verificar su correo
        variant: "default",
      });

      setIsRegistered(true); // Cambiamos el estado a registrado
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-center">
          Register to Trimio
        </CardTitle>
        <CardDescription className="text-center">
          {isRegistered
            ? "Please check your email to verify your account"
            : "Enter your details to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isRegistered ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                required
              />
            </div>
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Phone number"
                type="tel"
                autoCapitalize="none"
                autoComplete="tel"
                autoCorrect="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="new-password"
              />
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-4">
              A verification email has been sent to your email address. Please
              check your inbox and click on the verification link to complete
              the process.
            </p>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="link" asChild>
          <Link href="/login">Already have an account? Log In</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
