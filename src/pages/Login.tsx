import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router";
import LoginComponent from "@/components/auth/loginComponent";
import { useNotification } from "@/context/NotificationContext";
import { AxiosError } from "axios";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
})

export default function Login() {
    const navigate = useNavigate()
    const { success: notifySuccess, error: notifyError } = useNotification()

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (response) => {
            console.log("Login successful:", response)
            localStorage.setItem("accessToken", response.data.accessToken)
            localStorage.setItem("refreshToken", response.data.refreshToken)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            notifySuccess(response.message || "Login successful")
            navigate("/")
        },
        onError: (error: unknown) => {
            console.error("Login failed:", error)
            let errorMessage = "An unexpected error occurred"

            if (error instanceof AxiosError) {
                // Try to get error message from API response
                const apiError = error.response?.data as { message?: string } | undefined
                errorMessage = apiError?.message || error.message || "Login failed. Please check your credentials."
            } else if (error instanceof Error) {
                errorMessage = error.message
            }

            notifyError(errorMessage, "Login failed")
        },
    })

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: async ({ value }) => {
            loginMutation.mutate({
                email: value.email,
                password: value.password,
            })
        },
    });


    return (
        <LoginComponent form={form} isPending={loginMutation.isPending} />
    );
}