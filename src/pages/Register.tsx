import { useState } from "react";
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router";
import RegisterComponent from "@/components/auth/registerComponent";
import TenantRegistrationComponent from "@/components/auth/tenantRegistrationComponent";
import SubscriptionPlanComponent from "@/components/auth/subscriptionPlanComponent";
import { useNotification } from "@/context/NotificationContext";
import { AxiosError } from "axios";
import type { RegisterStep1Request } from "@/types/register";

const registerRequestSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must be less than 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .max(15, "Phone number must be less than 15 characters")
        .regex(/^[+]?[0-9\s\-()]+$/, "Invalid phone number format"),
    address: z
        .string()
        .max(255, "Address must be less than 255 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const tenantRequestSchema = z.object({
    businessName: z
        .string()
        .min(1, "Business name is required"),
    businessEmail: z
        .string()
        .min(1, "Business email is required")
        .email("Please enter a valid email address"),
    businessPhone: z
        .string()
        .min(1, "Business phone is required")
        .min(7, "Phone number must be at least 7 digits")
        .max(15, "Phone number must be less than 15 characters"),
    mpesaTillNo: z
        .string()
        .min(1, "M-Pesa Till Number is required"),
    mpesaBusinessShortCode: z
        .string()
        .min(1, "M-Pesa Business Short Code is required"),
});

export default function Register() {
    const navigate = useNavigate()
    const { success: notifySuccess, error: notifyError } = useNotification()
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
    const [step1Data, setStep1Data] = useState<RegisterStep1Request | null>(null)
    const [step2Data, setStep2Data] = useState<{
        businessName: string;
        businessEmail: string;
        businessPhone: string;
        mpesaTillNo: string;
        mpesaBusinessShortCode: string;
    } | null>(null)
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (response) => {
            console.log("Registration successful:", response)
            notifySuccess(response.message || "Registration successful! Please check your email for verification.")
            // TODO: Navigate to next step (OTP verification)
            navigate("/login")
        },
        onError: (error: unknown) => {
            console.error("Registration failed:", error)
            let errorMessage = "An unexpected error occurred"

            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined
                errorMessage = apiError?.message || error.message || "Registration failed. Please try again."
            } else if (error instanceof Error) {
                errorMessage = error.message
            }

            notifyError(errorMessage, "Registration failed")
        },
    })

    const step1Form = useForm({
        defaultValues: {
            fullName: "",
            phone: "",
            address: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validators: {
            onSubmit: registerRequestSchema,
        },
        onSubmit: async ({ value }) => {
            // Store step 1 data and move to step 2
            setStep1Data(value)
            setCurrentStep(2)
        },
    });

    const step2Form = useForm({
        defaultValues: {
            businessName: "",
            businessEmail: "",
            businessPhone: "",
            mpesaTillNo: "",
            mpesaBusinessShortCode: "",
        },
        validators: {
            onSubmit: tenantRequestSchema,
        },
        onSubmit: async ({ value }) => {
            // Store step 2 data and move to step 3
            setStep2Data(value)
            setCurrentStep(3)
        },
    });

    const handleBackToStep1 = () => {
        setCurrentStep(1)
    }

    const handleBackToStep2 = () => {
        setCurrentStep(2)
    }

    const handlePlanSelect = (planId: number) => {
        setSelectedPlanId(planId)
    }

    const handleCompleteRegistration = () => {
        if (!step1Data || !step2Data) {
            notifyError("Please complete all steps", "Validation Error")
            return
        }

        if (!selectedPlanId) {
            notifyError("Please select a subscription plan", "Validation Error")
            return
        }

        registerMutation.mutate({
            email: step1Data.email,
            password: step1Data.password,
            fullName: step1Data.fullName,
            phone: step1Data.phone,
            address: step1Data.address.trim() || undefined,
            tenant: {
                businessName: step2Data.businessName,
                businessEmail: step2Data.businessEmail,
                businessPhone: step2Data.businessPhone,
                mpesaTillNo: step2Data.mpesaTillNo,
                mpesaBusinessShortCode: step2Data.mpesaBusinessShortCode,
            },
            subscriptionPlanId: selectedPlanId,
        })
    }

    if (currentStep === 1) {
        return (
            <RegisterComponent
                form={step1Form}
                isPending={registerMutation.isPending}
            />
        );
    }

    if (currentStep === 2) {
        return (
            <TenantRegistrationComponent
                form={step2Form}
                isPending={registerMutation.isPending}
                onBack={handleBackToStep1}
            />
        );
    }

    return (
        <SubscriptionPlanComponent
            selectedPlanId={selectedPlanId}
            onPlanSelect={handlePlanSelect}
            onBack={handleBackToStep2}
            onComplete={handleCompleteRegistration}
            isPending={registerMutation.isPending}
        />
    );
}
