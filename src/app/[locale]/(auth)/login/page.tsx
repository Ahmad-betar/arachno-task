"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const login = useStore((s) => s.login);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    // check hardcoded credentials
    const correctEmail = "admin@admin.com";
    const correctPassword = "12345678";

    if (data.email === correctEmail && data.password === correctPassword) {
      // call your store's login action (adjust signature if needed)
      // if your store expects only boolean or different args adapt accordingly
      login(data.email, data.password);
      router.push("/articles");
      return;
    }

    // show a general form-level error if credentials don't match
    setError("password", {
      type: "manual",
      message: "Email or password is incorrect.",
    });
    // optionally also set email error:
    setError("email", { type: "manual", message: "" }); // keep empty if you only want to show on password
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-fit mx-auto my-48">
      <Card>
        <CardHeader>Login</CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              {...register("email")}
              placeholder="Email"
              type="email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("password")}
              placeholder="Password"
              type="password"
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm text-center">Try: admin@admin.com / 12345678</p>
        </CardContent>
      </Card>
    </form>
  );
}
