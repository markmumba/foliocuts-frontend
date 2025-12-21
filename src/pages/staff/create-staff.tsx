import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { AxiosError } from "axios";
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
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNotification } from "@/context/NotificationContext";
import { useRoles } from "@/hooks/userUser";
import { userService } from "@/services/userService";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Role } from "@/types/enums";
import type { CreateStaffRequest, CreateEmployeesResponse } from "@/types/user";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatRole } from "@/utils/utilities";

export default function CreateStaff() {
    const navigate = useNavigate();
    const { data: rolesData, isLoading: isLoadingRoles } = useRoles();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const queryClient = useQueryClient();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [emails, setEmails] = useState("");
    const [creationResult, setCreationResult] = useState<CreateEmployeesResponse | null>(null);
    const [isResultDialogOpen, setResultDialogOpen] = useState(false);

    const createMutation = useMutation({
        mutationFn: userService.createStaff,
        onSuccess: (response) => {
            const payload = response.data ?? response;
            setCreationResult(payload);
            setResultDialogOpen(true);
            notifySuccess(response.message || "Staff members created successfully");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setEmails("");
        },
        onError: (error: unknown) => {
            console.error("Create staff failed:", error);
            let errorMessage = "An unexpected error occurred";

            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined;
                errorMessage = apiError?.message || error.message || "Failed to create staff members.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            notifyError(errorMessage, "Create failed");
        },
    });

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            navigate("/dashboard/staff");
        }
    };

    const parseEmails = (emailString: string): string[] => {
        return emailString
            .split(/[,\n]/)
            .map(email => email.trim())
            .filter(email => email.length > 0);
    };

    const validateEmails = (emailArray: string[]): { valid: boolean; message?: string } => {
        if (emailArray.length === 0) {
            return { valid: false, message: "Please enter at least one email address" };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emailArray.filter(email => !emailRegex.test(email));

        if (invalidEmails.length > 0) {
            return { valid: false, message: `Invalid email addresses: ${invalidEmails.join(", ")}` };
        }

        return { valid: true };
    };

    const handleSubmit = () => {
        const emailArray = parseEmails(emails);
        const validation = validateEmails(emailArray);

        if (!validation.valid) {
            notifyError(validation.message || "Invalid email addresses", "Validation Error");
            return;
        }

        if (!selectedRole) {
            notifyError("Please select a role", "Validation Error");
            return;
        }

        const payload: CreateStaffRequest = {
            emails: emailArray,
            staffRole: selectedRole as Role,
        };

        createMutation.mutate(payload);
    };

    const handleResultClose = () => {
        setResultDialogOpen(false);
        setCreationResult(null);
    };

    const handleResultNavigate = () => {
        handleResultClose();
        navigate("/dashboard/staff");
    };

    const resultDialog = (
        <AlertDialog open={isResultDialogOpen && !!creationResult} onOpenChange={(open) => (!open ? handleResultClose() : setResultDialogOpen(true))}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Staff creation summary</AlertDialogTitle>
                    <AlertDialogDescription>
                        Here&apos;s how the request completed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {creationResult && (
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-4 bg-muted/40 p-3 rounded-md">
                            <div>
                                <p className="text-muted-foreground">Requested</p>
                                <p className="text-lg font-semibold">{creationResult.totalRequested}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Created</p>
                                <p className="text-lg font-semibold">{creationResult.created}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Skipped</p>
                                <p className="text-lg font-semibold">{creationResult.skipped}</p>
                            </div>
                        </div>
                        {creationResult.createdEmails?.length ? (
                            <div>
                                <p className="font-medium mb-1">Created emails:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-0.5 max-h-32 overflow-auto">
                                    {creationResult.createdEmails.map((email) => (
                                        <li key={email}>{email}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        {creationResult.existingEmails?.length ? (
                            <div>
                                <p className="font-medium mb-1">Already existed:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-0.5 max-h-32 overflow-auto">
                                    {creationResult.existingEmails.map((email) => (
                                        <li key={email}>{email}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleResultClose}>Close</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResultNavigate}>
                        View Staff
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    // Step 1: Select Role
    if (step === 1) {
        return (
            <>
                {resultDialog}
                <div className="w-full">
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
                                    <Link to="/dashboard/staff">Staff</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Create Staff</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="mb-4 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Staff
                        </Button>
                        <h2 className="text-2xl font-bold mb-2">Select Role</h2>
                        <p className="text-muted-foreground">
                            Choose a role for the staff members you want to add
                        </p>
                    </div>

                    {isLoadingRoles ? (
                        <div className="text-center py-12">
                            <Spinner />
                        </div>
                    ) : rolesData?.data && rolesData.data.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {rolesData.data.map((role) => {
                                const roleKey = `role-${role}`;
                                const isSelected = selectedRole === role;
                                return (
                                    <Label
                                        key={role}
                                        htmlFor={roleKey}
                                        className={`hover:border-accent/50 flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${isSelected
                                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                                            : "border-border bg-card"
                                            }`}
                                        onClick={() => handleRoleSelect(role as Role)}
                                    >
                                        <Checkbox
                                            id={roleKey}
                                            checked={isSelected}
                                            onCheckedChange={() => handleRoleSelect(role as Role)}
                                            className="mt-0.5 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
                                        />
                                        <div className="grid gap-1.5 font-normal flex-1">
                                            <p className="text-sm leading-none font-medium text-card-foreground">
                                                {formatRole(role)}
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                Add staff members with the {formatRole(role)} role
                                            </p>
                                        </div>
                                    </Label>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="border border-border rounded-lg p-12 text-center bg-card">
                            <p className="text-muted-foreground">No roles available</p>
                        </div>
                    )}
                </div>
            </>
        );
    }

    // Step 2: Enter Emails
    return (
        <>
            {resultDialog}
            <div className="w-full max-w-3xl">
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
                                <Link to="/dashboard/staff">Staff</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create Staff</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="mb-4 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Role Selection
                    </Button>
                    <h2 className="text-2xl font-bold mb-2">Add Staff Members</h2>
                    <p className="text-muted-foreground mb-4">
                        Enter email addresses for staff members with the <span className="font-semibold">{selectedRole ? formatRole(selectedRole) : ""}</span> role
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You can enter multiple emails separated by commas or new lines
                    </p>
                </div>

                <FieldSet>
                    <Field>
                        <FieldLabel>Email Addresses</FieldLabel>
                        <Textarea
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            placeholder="john@example.com
jane@example.com
bob@example.com"
                            rows={12}
                            className="font-mono text-sm"
                        />
                        <FieldError />
                        <p className="text-xs text-muted-foreground mt-2">
                            Enter one email per line or separate with commas
                        </p>
                    </Field>
                </FieldSet>

                <div className="flex items-center justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || !emails.trim()}
                        className="gap-2"
                    >
                        {createMutation.isPending ? (
                            <>
                                <Spinner />
                                Creating...
                            </>
                        ) : (
                            <>
                                Create Staff Members
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}