import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldLegend,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSubscriptionPlanTemplate } from "@/hooks/useSubscriptionTemaplatePlans";
import { subscriptionService } from "@/services/subscriptionService";
import { useNotification } from "@/context/NotificationContext";
import type { CreateSubscriptionPlanTemplateRequest, SubscriptionPlan } from "@/types/subscriptionPlanTemplate";
import { AxiosError } from "axios";

const planOptions = ["BASIC", "PREMIUM", "ENTERPRISE"] as const;
type PlanOption = typeof planOptions[number];

const templateSchema = z.object({
    plan: z.enum(planOptions),
    name: z.string().min(2, "Name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    monthlyPrice: z.number().nonnegative("Monthly price must be positive"),
    yearlyPrice: z.number().nonnegative("Yearly price must be positive").optional(),
    trialDays: z.number().nonnegative("Trial days must be zero or greater"),
    maxStaff: z.number().min(1, "Max staff must be at least 1"),
    maxServices: z.number().nonnegative("Max services cannot be negative"),
    maxAppointmentsPerMonth: z.number().nonnegative("Max appointments cannot be negative"),
    displayOrder: z.number().nonnegative("Display order must be zero or greater"),
    features: z.string().min(5, "Please list at least one feature"),
    isActive: z.boolean(),
});

type FormState = {
    plan: PlanOption;
    name: string;
    description: string;
    monthlyPrice: string;
    yearlyPrice: string;
    trialDays: string;
    maxStaff: string;
    maxServices: string;
    maxAppointmentsPerMonth: string;
    displayOrder: string;
    features: string;
    isActive: boolean;
};

function parseStoredFeatures(features: string | undefined): string {
    if (!features) return "";
    try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) {
            return parsed.join("\n");
        }
        return features;
    } catch {
        return features;
    }
}

export default function EditSubscriptionTemplate() {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const { data, isLoading, error } = useSubscriptionPlanTemplate(templateId);
    const [formValues, setFormValues] = useState<FormState | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const planData = useMemo(() => data?.data, [data]);

    useEffect(() => {
        if (planData) {
            setFormValues({
                plan: planData.plan as PlanOption,
                name: planData.name ?? "",
                description: planData.description ?? "",
                monthlyPrice: planData.monthlyPrice?.toString() ?? "",
                yearlyPrice: planData.yearlyPrice?.toString() ?? "",
                trialDays: planData.trialDays?.toString() ?? "0",
                maxStaff: planData.maxStaff?.toString() ?? "0",
                maxServices: planData.maxServices?.toString() ?? "0",
                maxAppointmentsPerMonth: planData.maxAppointmentsPerMonth?.toString() ?? "0",
                displayOrder: planData.displayOrder?.toString() ?? "0",
                features: parseStoredFeatures(planData.features),
                isActive: planData.isActive ?? true,
            });
        }
    }, [planData]);

    const updateMutation = useMutation({
        mutationFn: (payload: CreateSubscriptionPlanTemplateRequest) =>
            subscriptionService.updateSubscriptionPlanTemplate(templateId!, payload),
        onSuccess: () => {
            notifySuccess("Subscription plan template updated");
            queryClient.invalidateQueries({ queryKey: ["subscription-plan-templates"] });
            queryClient.invalidateQueries({ queryKey: ["subscription-plan-template", templateId] });
            navigate("/dashboard/subscription-templates");
        },
        onError: (error: unknown) => {
            let message = "Failed to update plan template";
            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined;
                message = apiError?.message || error.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            notifyError(message, "Update template failed");
        },
    });

    if (isLoading || !formValues) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    if (!planData) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Not found</AlertTitle>
                <AlertDescription>Subscription plan template not found.</AlertDescription>
            </Alert>
        );
    }

    const handleInputChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setFormValues((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handlePlanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as PlanOption;
        setFormValues((prev) => (prev ? { ...prev, plan: value } : prev));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formValues) return;

        const parsedValues = {
            plan: formValues.plan,
            name: formValues.name.trim(),
            description: formValues.description.trim(),
            monthlyPrice: Number(formValues.monthlyPrice),
            yearlyPrice: formValues.yearlyPrice ? Number(formValues.yearlyPrice) : undefined,
            trialDays: Number(formValues.trialDays),
            maxStaff: Number(formValues.maxStaff),
            maxServices: Number(formValues.maxServices),
            maxAppointmentsPerMonth: Number(formValues.maxAppointmentsPerMonth),
            displayOrder: Number(formValues.displayOrder),
            features: formValues.features.trim(),
            isActive: formValues.isActive,
        };

        const result = templateSchema.safeParse(parsedValues);
        if (!result.success) {
            const validationErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const key = issue.path[0];
                if (typeof key === "string") {
                    validationErrors[key] = issue.message;
                }
            });
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const featuresArray = result.data.features
            .split(/\r?\n|[,;|]/)
            .map((item) => item.trim())
            .filter(Boolean);

        const payload: CreateSubscriptionPlanTemplateRequest = {
            ...result.data,
            features: JSON.stringify(featuresArray),
            plan: result.data.plan as SubscriptionPlan,
        };
        updateMutation.mutate(payload);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Edit Subscription Plan Template</h1>
                    <p className="text-muted-foreground">
                        Update pricing, limits, and benefits for this plan.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Plan</FieldLabel>
                                <FieldContent>
                                    <select
                                        value={formValues.plan}
                                        onChange={handlePlanChange}
                                        className="border border-input bg-background rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {planOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Name</FieldLabel>
                                <FieldContent>
                                    <Input value={formValues.name} onChange={handleInputChange("name")} placeholder="Premium Plan" />
                                    <FieldError>{errors.name}</FieldError>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        value={formValues.description}
                                        onChange={handleInputChange("description")}
                                        rows={3}
                                        placeholder="Describe what this plan offers."
                                    />
                                    <FieldError>{errors.description}</FieldError>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                    <FieldSet>
                        <FieldLegend className="text-lg font-semibold">Pricing</FieldLegend>
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldTitle>Monthly Price</FieldTitle>
                                <FieldContent>
                                    <Input type="number" min="0" step="1" value={formValues.monthlyPrice} onChange={handleInputChange("monthlyPrice")} />
                                    <FieldError>{errors.monthlyPrice}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Yearly Price (optional)</FieldTitle>
                                <FieldContent>
                                    <Input type="number" min="0" step="1" value={formValues.yearlyPrice} onChange={handleInputChange("yearlyPrice")} />
                                    <FieldError>{errors.yearlyPrice}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Trial Days</FieldTitle>
                                <FieldContent>
                                    <Input type="number" min="0" step="1" value={formValues.trialDays} onChange={handleInputChange("trialDays")} />
                                    <FieldError>{errors.trialDays}</FieldError>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                    <FieldSet>
                        <FieldLegend className="text-lg font-semibold">Limits</FieldLegend>
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldTitle>Max Staff</FieldTitle>
                                <FieldContent>
                                    <Input type="number" min="1" step="1" value={formValues.maxStaff} onChange={handleInputChange("maxStaff")} />
                                    <FieldError>{errors.maxStaff}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Max Services</FieldTitle>
                                <FieldContent>
                                    <Input type="number" min="0" step="1" value={formValues.maxServices} onChange={handleInputChange("maxServices")} />
                                    <FieldDescription>Use 0 for unlimited</FieldDescription>
                                    <FieldError>{errors.maxServices}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Max Appointments / month</FieldTitle>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formValues.maxAppointmentsPerMonth}
                                        onChange={handleInputChange("maxAppointmentsPerMonth")}
                                    />
                                    <FieldDescription>Use 0 for unlimited</FieldDescription>
                                    <FieldError>{errors.maxAppointmentsPerMonth}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Display Order</FieldTitle>
                                <FieldContent>
                                    <Input type="number" min="0" step="1" value={formValues.displayOrder} onChange={handleInputChange("displayOrder")} />
                                    <FieldError>{errors.displayOrder}</FieldError>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                    <FieldSet>
                        <FieldLegend className="text-lg font-semibold">Features & Status</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Features</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        rows={6}
                                        value={formValues.features}
                                        onChange={handleInputChange("features")}
                                        placeholder="Enter one feature per line"
                                    />
                                    <FieldError>{errors.features}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Active</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch checked={formValues.isActive} onCheckedChange={(checked) => setFormValues((prev) => (prev ? { ...prev, isActive: checked } : prev))} />
                                    <span className="text-sm text-muted-foreground">
                                        {formValues.isActive ? "Plan will be available to tenants" : "Plan will be hidden"}
                                    </span>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Saving..." : "Update Template"}
                    </Button>
                </div>
            </form>
        </div>
    );
}