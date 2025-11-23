import { useState } from "react";
import { useServiceTypes } from "@/hooks/useService";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "@/services/servicesService";
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
import type { ServiceTypeRequest } from "@/types/serviceType";
import { AxiosError } from "axios";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const serviceTypeSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must be at most 100 characters"),
    description: z.string(),
    staffRole: z.enum(["BARBER", "SERVICE_GIRL"]),
});

export default function ServiceType() {
    const navigate = useNavigate();
    const { data: serviceTypes, isLoading, error } = useServiceTypes();
    const { user } = useAuth();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const queryClient = useQueryClient();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const isServiceTypeServicesPage = useLocation().pathname.includes('/services');

    const isAdmin = user?.role === "ADMIN";

    const createMutation = useMutation({
        mutationFn: servicesService.createServiceType,
        onSuccess: () => {
            notifySuccess("Service type created successfully");
            queryClient.invalidateQueries({ queryKey: ['service-types'] });
            form.reset();
            setShowCreateForm(false);
        },
        onError: (error: unknown) => {
            console.error("Create service type failed:", error);
            let errorMessage = "An unexpected error occurred";

            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined;
                errorMessage = apiError?.message || error.message || "Failed to create service type.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            notifyError(errorMessage, "Create failed");
        },
    });

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            staffRole: "BARBER" as ServiceTypeRequest["staffRole"],
        },
        validators: {
            onSubmit: serviceTypeSchema,
        },
        onSubmit: async ({ value }) => {
            createMutation.mutate({
                name: value.name,
                description: value.description,
                staffRole: value.staffRole,
            });
        },
    });

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
        </Alert>;
    }


    return (
        <div className="p-6 space-y-8">
            {!isServiceTypeServicesPage && (
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Service Types</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            )}
            <Outlet />
            {!isServiceTypeServicesPage && (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Service Types</h1>
                            <p className="text-muted-foreground">
                                Manage service types available in your barbershop
                            </p>
                        </div>
                        {isAdmin && (
                            <Button
                                variant="default"
                                size="lg"
                                onClick={() => setShowCreateForm(!showCreateForm)}
                            >
                                {showCreateForm ? "Cancel" : "Create New Service Type"}
                            </Button>
                        )}
                    </div>

                    {serviceTypes?.data && serviceTypes.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {serviceTypes.data.map((serviceType) => (
                                <div
                                    key={serviceType.id}
                                    onClick={() => navigate(`/dashboard/service-types/${serviceType.id}/services`)}
                                    className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"
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
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {serviceType.description}
                                        </p>
                                    )}
                                    <div className="text-xs text-muted-foreground">
                                        Created: {new Date(serviceType.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-border rounded-lg p-12 text-center bg-card">
                            <p className="text-muted-foreground">No service types found</p>
                        </div>
                    )}

                    {isAdmin && showCreateForm && (
                        <>
                            <div className="border-t border-border pt-8">
                                <div className="max-w-2xl">
                                    <h2 className="text-2xl font-bold mb-2">Create New Service Type</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Add a new service type to the system
                                    </p>

                                    <form
                                        id="create-service-type-form"
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
                                                                    Service Type Name
                                                                </FieldLabel>
                                                                <Input
                                                                    id={field.name}
                                                                    name={field.name}
                                                                    type="text"
                                                                    value={field.state.value}
                                                                    onBlur={field.handleBlur}
                                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                                    placeholder="e.g., Haircut, Beard Trim"
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
                                                        return (
                                                            <Field>
                                                                <FieldLabel htmlFor={field.name}>
                                                                    Description (Optional)
                                                                </FieldLabel>
                                                                <textarea
                                                                    id={field.name}
                                                                    name={field.name}
                                                                    value={field.state.value}
                                                                    onBlur={field.handleBlur}
                                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                                    placeholder="Describe the service type..."
                                                                    className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                                    rows={4}
                                                                />
                                                            </Field>
                                                        );
                                                    }}
                                                />

                                                <form.Field
                                                    name="staffRole"
                                                    children={(field) => {
                                                        const isInvalid =
                                                            field.state.meta.isTouched && !field.state.meta.isValid;
                                                        return (
                                                            <Field data-invalid={isInvalid}>
                                                                <FieldLabel htmlFor={field.name}>
                                                                    Staff Role
                                                                </FieldLabel>
                                                                <select
                                                                    id={field.name}
                                                                    name={field.name}
                                                                    value={field.state.value}
                                                                    onBlur={field.handleBlur}
                                                                    onChange={(e) =>
                                                                        field.handleChange(e.target.value as ServiceTypeRequest["staffRole"])
                                                                    }
                                                                    className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                                    aria-invalid={isInvalid}
                                                                >
                                                                    <option value="BARBER">Barber</option>
                                                                    <option value="SERVICE_GIRL">Service Girl</option>
                                                                </select>
                                                                {isInvalid && (
                                                                    <FieldError errors={field.state.meta.errors} />
                                                                )}
                                                            </Field>
                                                        );
                                                    }}
                                                />
                                            </FieldGroup>

                                            <div className="flex justify-end gap-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="lg"
                                                    onClick={() => {
                                                        setShowCreateForm(false);
                                                        form.reset();
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    form="create-service-type-form"
                                                    variant="default"
                                                    size="lg"
                                                    disabled={createMutation.isPending}
                                                >
                                                    {createMutation.isPending ? "Creating..." : "Create Service Type"}
                                                </Button>
                                            </div>
                                        </FieldSet>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
