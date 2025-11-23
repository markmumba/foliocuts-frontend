import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "@/services/servicesService";
import { useServiceTypes } from "@/hooks/useService";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/context/NotificationContext";
import { AxiosError } from "axios";
import { useNavigate, Link } from "react-router";
import type { ServiceTypeResponse } from "@/types/serviceType";
import type { ServiceRequest } from "@/types/service";

const serviceSchema = z.object({
    serviceTypeId: z.string().min(1, "Service type is required"),
    name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    defaultCommissionRate: z.number().min(0).max(100, "Commission rate must be between 0 and 100"),
    loyaltyRuleRequest: z.object({
        visitsRequired: z.number().min(1, "Visits required must be at least 1"),
        isEnabled: z.boolean(),
        description: z.string(),
    }),
});

export default function CreateService() {
    const navigate = useNavigate();
    const { data: serviceTypes, isLoading: isLoadingTypes } = useServiceTypes();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const queryClient = useQueryClient();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceTypeResponse | null>(null);
    const [showLoyaltyRule, setShowLoyaltyRule] = useState(false);

    const createMutation = useMutation({
        mutationFn: servicesService.createService,
        onSuccess: () => {
            notifySuccess("Service created successfully");
            queryClient.invalidateQueries({ queryKey: ['services'] });
            navigate("/dashboard/services");
        },
        onError: (error: unknown) => {
            console.error("Create service failed:", error);
            let errorMessage = "An unexpected error occurred";

            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined;
                errorMessage = apiError?.message || error.message || "Failed to create service.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            notifyError(errorMessage, "Create failed");
        },
    });

    const form = useForm({
        defaultValues: {
            serviceTypeId: "",
            name: "",
            description: "",
            price: 0,
            defaultCommissionRate: 0,
            loyaltyRuleRequest: {
                visitsRequired: 1,
                isEnabled: false,
                description: "",
            },
        },
        validators: {
            onSubmit: serviceSchema,
        },
        onSubmit: async ({ value }) => {
            const payload: ServiceRequest = {
                serviceTypeId: value.serviceTypeId,
                name: value.name,
                description: value.description,
                price: value.price,
                defaultCommissionRate: value.defaultCommissionRate,
            };

            // Only include loyalty rule if it was enabled
            if (showLoyaltyRule && value.loyaltyRuleRequest.isEnabled) {
                payload.loyaltyRuleRequest = {
                    visitsRequired: value.loyaltyRuleRequest.visitsRequired || 1,
                    isEnabled: true,
                    description: value.loyaltyRuleRequest.description || "",
                };
            } else {
                payload.loyaltyRuleRequest = null;
            }

            createMutation.mutate(payload);
        },
    });

    const handleServiceTypeSelect = (serviceType: ServiceTypeResponse) => {
        setSelectedServiceType(serviceType);
        form.setFieldValue("serviceTypeId", serviceType.id.toString());
        setStep(2);
    };

    const handleSkip = () => {
        form.handleSubmit();
    };

    const handleAddLoyaltyRule = () => {
        setShowLoyaltyRule(true);
        form.setFieldValue("loyaltyRuleRequest.isEnabled", true);
    };

    // Step 1: Select Service Type
    if (step === 1) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Select Service Type</h2>
                    <p className="text-muted-foreground">
                        Choose a service type for your new service
                    </p>
                </div>

                {isLoadingTypes ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading service types...</p>
                    </div>
                ) : serviceTypes?.data && serviceTypes.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serviceTypes.data.map((serviceType) => (
                            <button
                                key={serviceType.id}
                                type="button"
                                onClick={() => handleServiceTypeSelect(serviceType)}
                                className={`border-2 rounded-lg p-6 text-left transition-all hover:shadow-md ${selectedServiceType?.id === serviceType.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-card-foreground">
                                        {serviceType.name}
                                    </h3>
                                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
                                        {serviceType.staffRole}
                                    </span>
                                </div>
                                {serviceType.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {serviceType.description}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="border border-border rounded-lg p-12 text-center bg-card">
                        <p className="text-muted-foreground mb-4">No service types available</p>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/dashboard/services")}
                        >
                            Go Back
                        </Button>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => navigate("/dashboard/services")}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    // Step 2: Create Service Form
    return (
        <div className="max-w-3xl mx-auto">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/dashboard/services">Services</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create Service</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setStep(1);
                            setSelectedServiceType(null);
                        }}
                    >
                        ← Back
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">Create New Service</h2>
                        {selectedServiceType && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Service Type: <span className="font-medium">{selectedServiceType.name}</span>
                            </p>
                        )}
                    </div>
                </div>
                <p className="text-muted-foreground">
                    Fill in the details for your new service
                </p>
            </div>

            <form
                id="create-service-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldSet>
                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Service Name
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="e.g., Classic Haircut"
                                            className="h-11"
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        <form.Field
                            name="description"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Description
                                        </FieldLabel>
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Describe the service..."
                                            className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                            rows={4}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <form.Field
                                name="price"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Price (KSh)
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={field.state.value.toString()}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                className="h-11"
                                                aria-invalid={isInvalid}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />

                            <form.Field
                                name="defaultCommissionRate"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Commission Rate (%)
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                                value={field.state.value.toString()}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                                className="h-11"
                                                aria-invalid={isInvalid}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </div>

                        {/* Loyalty Rule Section - Only show if "Add Loyalty Rule" was clicked */}
                        {showLoyaltyRule && (
                            <div className="border-t border-border pt-4 mt-4">
                                <h3 className="text-lg font-semibold mb-4">Loyalty Rule</h3>

                                <form.Field
                                    name="loyaltyRuleRequest.visitsRequired"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>
                                                    Visits Required
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    min="1"
                                                    value={(field.state.value || 1).toString()}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(parseInt(e.target.value) || 1)}
                                                    placeholder="1"
                                                    className="h-11"
                                                    aria-invalid={isInvalid}
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        );
                                    }}
                                />

                                <form.Field
                                    name="loyaltyRuleRequest.description"
                                    children={(field) => {
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>
                                                    Loyalty Rule Description
                                                </FieldLabel>
                                                <textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value || ""}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    placeholder="Describe the loyalty rule..."
                                                    className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    rows={3}
                                                />
                                            </Field>
                                        );
                                    }}
                                />
                            </div>
                        )}
                    </FieldGroup>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => navigate("/dashboard/services")}
                        >
                            Cancel
                        </Button>
                        {!showLoyaltyRule ? (
                            <>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    onClick={handleSkip}
                                    disabled={createMutation.isPending}
                                >
                                    Skip
                                </Button>
                                <Button
                                    type="button"
                                    variant="default"
                                    size="lg"
                                    onClick={handleAddLoyaltyRule}
                                >
                                    Add Loyalty Rule
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="submit"
                                form="create-service-form"
                                variant="default"
                                size="lg"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? "Creating..." : "Create Service"}
                            </Button>
                        )}
                    </div>
                </FieldSet>
            </form>
        </div>
    );
}
