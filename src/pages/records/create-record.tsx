import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
    FieldContent,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { useUsers } from "@/hooks/userUser";
import { useServices } from "@/hooks/useService";
import { recordService } from "@/services/recordService";
import { useNotification } from "@/context/NotificationContext";
import type { CreateRecordRequest, CompleteRecordRequest, ServiceItemRequest } from "@/types/record";
import type { ServiceResponse } from "@/types/service";
import { AxiosError } from "axios";
import { ArrowLeft, ArrowRight, Phone, Scissors, Sparkles, CreditCard, Receipt, Wallet } from "lucide-react";
import type { User } from "@/types/user";
import { Textarea } from "@/components/ui/textarea";

type SelectedService = {
    serviceId: string;
    staffId: string;
    serviceName: string;
    staffName: string;
    price: number;
};

type Step = 1 | 2 | 3 | 4 | 5;

export default function CreateRecord() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { success: notifySuccess, error: notifyError } = useNotification();

    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [customerPhone, setCustomerPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [barberSelections, setBarberSelections] = useState<Map<string, string>>(new Map()); // serviceId -> staffId
    const [serviceGirlSelections, setServiceGirlSelections] = useState<Map<string, string>>(new Map()); // serviceId -> staffId
    const [createdRecordId, setCreatedRecordId] = useState<number | null>(null);

    // Payment form state
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "MPESA">("CASH");
    const [mpesaReceiptNumber, setMpesaReceiptNumber] = useState("");
    const [mpesaTransactionId, setMpesaTransactionId] = useState("");
    const [cashReceivedBy, setCashReceivedBy] = useState("");
    const [notes, setNotes] = useState("");

    const { data: staffData, isLoading: staffLoading, error: staffError } = useUsers();
    const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useServices();

    const createRecordMutation = useMutation({
        mutationFn: (request: CreateRecordRequest) => recordService.createRecord(request),
        onSuccess: (response) => {
            notifySuccess(response.message || "Record created successfully");
            queryClient.invalidateQueries({ queryKey: ['records'] });
            if (response.data?.id) {
                setCreatedRecordId(response.data.id);
                setCurrentStep(5); // Move to payment step
            } else {
                navigate("/dashboard/records");
            }
        },
        onError: (error: unknown) => {
            let message = "Failed to create record";
            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined;
                message = apiError?.message || error.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            notifyError(message, "Create record failed");
        },
    });

    const completeRecordMutation = useMutation({
        mutationFn: (request: CompleteRecordRequest) => {
            if (!createdRecordId) throw new Error("Record ID not found");
            return recordService.completeRecord(createdRecordId, request);
        },
        onSuccess: (response) => {
            notifySuccess(response.message || "Payment completed successfully");
            queryClient.invalidateQueries({ queryKey: ['records'] });
            queryClient.invalidateQueries({ queryKey: ['record', createdRecordId] });
            navigate(`/dashboard/records/${createdRecordId}`);
        },
        onError: (error: unknown) => {
            let message = "Failed to complete payment";
            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined;
                message = apiError?.message || error.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            notifyError(message, "Payment failed");
        },
    });

    // Filter staff by role
    const barbers = useMemo(() => {
        if (!staffData?.data) return [];
        return staffData.data.filter((staff: User) => staff.role === "BARBER" && staff.status === "ACTIVE");
    }, [staffData]);

    const serviceGirls = useMemo(() => {
        if (!staffData?.data) return [];
        return staffData.data.filter((staff: User) => staff.role === "SERVICE_GIRL" && staff.status === "ACTIVE");
    }, [staffData]);

    // Filter services by staff role
    const barberServices = useMemo(() => {
        if (!servicesData?.data) return [];
        return servicesData.data.filter((service: ServiceResponse) =>
            service.serviceTypeStaffRole === "BARBER" && service.isActive
        );
    }, [servicesData]);

    const serviceGirlServices = useMemo(() => {
        if (!servicesData?.data) return [];
        return servicesData.data.filter((service: ServiceResponse) =>
            service.serviceTypeStaffRole === "SERVICE_GIRL" && service.isActive
        );
    }, [servicesData]);

    const handlePhoneSubmit = () => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!customerPhone.trim()) {
            setPhoneError("Phone number is required");
            return;
        }
        if (!phoneRegex.test(customerPhone.trim())) {
            setPhoneError("Please enter a valid phone number");
            return;
        }
        setPhoneError("");
        setCurrentStep(2);
    };

    const handleBarberServiceChange = (serviceId: string, staffId: string, checked: boolean) => {
        const newSelections = new Map(barberSelections);
        if (checked) {
            newSelections.set(serviceId, staffId);
        } else {
            newSelections.delete(serviceId);
        }
        setBarberSelections(newSelections);
    };

    const handleServiceGirlServiceChange = (serviceId: string, staffId: string, checked: boolean) => {
        const newSelections = new Map(serviceGirlSelections);
        if (checked) {
            newSelections.set(serviceId, staffId);
        } else {
            newSelections.delete(serviceId);
        }
        setServiceGirlSelections(newSelections);
    };

    const handleNext = () => {
        if (currentStep === 2) {
            setCurrentStep(3);
        } else if (currentStep === 3) {
            setCurrentStep(4);
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        } else if (currentStep === 3) {
            setCurrentStep(2);
        } else if (currentStep === 4) {
            setCurrentStep(3);
        } else if (currentStep === 5) {
            // Can't go back from payment, but can skip payment and go to records
            navigate("/dashboard/records");
        }
    };

    const handlePay = () => {
        const serviceItems: ServiceItemRequest[] = [];

        // Add barber services
        barberSelections.forEach((staffId, serviceId) => {
            serviceItems.push({ serviceId, staffId });
        });

        // Add service girl services
        serviceGirlSelections.forEach((staffId, serviceId) => {
            serviceItems.push({ serviceId, staffId });
        });

        if (serviceItems.length === 0) {
            notifyError("Please select at least one service", "No services selected");
            return;
        }

        const request: CreateRecordRequest = {
            customerPhoneNumber: customerPhone.trim(),
            serviceItems,
        };
        console.log("request", request);

        createRecordMutation.mutate(request);
    };

    // Calculate totals for review
    const selectedServices = useMemo(() => {
        const services: SelectedService[] = [];

        barberSelections.forEach((staffId, serviceId) => {
            const service = barberServices.find((s: ServiceResponse) => s.id === serviceId);
            const staff = barbers.find((s: User) => s.id.toString() === staffId);
            if (service && staff) {
                services.push({
                    serviceId,
                    staffId,
                    serviceName: service.name,
                    staffName: staff.fullName,
                    price: service.price,
                });
            }
        });

        serviceGirlSelections.forEach((staffId, serviceId) => {
            const service = serviceGirlServices.find((s: ServiceResponse) => s.id === serviceId);
            const staff = serviceGirls.find((s: User) => s.id.toString() === staffId);
            if (service && staff) {
                services.push({
                    serviceId,
                    staffId,
                    serviceName: service.name,
                    staffName: staff.fullName,
                    price: service.price,
                });
            }
        });

        return services;
    }, [barberSelections, serviceGirlSelections, barberServices, serviceGirlServices, barbers, serviceGirls]);

    const totalAmount = useMemo(() => {
        return selectedServices.reduce((sum, service) => sum + service.price, 0);
    }, [selectedServices]);

    if (staffLoading || servicesLoading) {
        return <Spinner />;
    }

    if (staffError || servicesError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {staffError?.message || servicesError?.message || "Failed to load data"}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container mx-auto py-6 max-w-4xl">
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
                            <Link to="/dashboard/records">Records</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create Record</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Create Record</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`flex items-center gap-1 ${currentStep >= 1 ? 'text-primary' : ''}`}>
                        <Phone className="w-4 h-4" />
                        <span>Customer</span>
                    </div>
                    <span>→</span>
                    <div className={`flex items-center gap-1 ${currentStep >= 2 ? 'text-primary' : ''}`}>
                        <Scissors className="w-4 h-4" />
                        <span>Barbers</span>
                    </div>
                    <span>→</span>
                    <div className={`flex items-center gap-1 ${currentStep >= 3 ? 'text-primary' : ''}`}>
                        <Sparkles className="w-4 h-4" />
                        <span>Service Girls</span>
                    </div>
                    <span>→</span>
                    <div className={`flex items-center gap-1 ${currentStep >= 4 ? 'text-primary' : ''}`}>
                        <Receipt className="w-4 h-4" />
                        <span>Review</span>
                    </div>
                    <span>→</span>
                    <div className={`flex items-center gap-1 ${currentStep >= 5 ? 'text-primary' : ''}`}>
                        <CreditCard className="w-4 h-4" />
                        <span>Payment</span>
                    </div>
                </div>
            </div>

            <div className=" p-6 ">
                {/* Step 1: Customer Phone Number */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Customer Information</h2>
                            <p className="text-muted-foreground">Enter the customer's phone number to continue</p>
                        </div>

                        <Field>
                            <FieldLabel>Phone Number</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={customerPhone}
                                    onChange={(e) => {
                                        setCustomerPhone(e.target.value);
                                        setPhoneError("");
                                    }}
                                    aria-invalid={!!phoneError}
                                />
                                {phoneError && <FieldError>{phoneError}</FieldError>}
                            </FieldContent>
                        </Field>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => navigate("/dashboard/records")}>
                                Cancel
                            </Button>
                            <Button onClick={handlePhoneSubmit}>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Barbers and Services */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Barber Services</h2>
                            <p className="text-muted-foreground">Select barbers and their services</p>
                        </div>

                        {barberServices.length === 0 ? (
                            <Alert>
                                <AlertTitle>No Services Available</AlertTitle>
                                <AlertDescription>
                                    No barber services are currently available. Please add services first.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="space-y-6">
                                {barberServices.map((service: ServiceResponse) => (
                                    <div key={service.id} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{service.name}</h3>
                                                <p className="text-sm text-muted-foreground">{service.description}</p>
                                                <p className="text-sm font-medium mt-1">KES {service.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Select Barber:</Label>
                                            {barbers.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No barbers available</p>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {barbers.map((barber: User) => {
                                                        const isSelected = barberSelections.get(service.id) === barber.id.toString();
                                                        return (
                                                            <div
                                                                key={barber.id}
                                                                className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent cursor-pointer"
                                                                onClick={() => handleBarberServiceChange(service.id, barber.id.toString(), !isSelected)}
                                                            >
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={(checked) =>
                                                                        handleBarberServiceChange(service.id, barber.id.toString(), checked as boolean)
                                                                    }
                                                                />
                                                                <Label className="cursor-pointer flex-1">
                                                                    {barber.fullName}
                                                                </Label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button onClick={handleNext}>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Service Girls and Services */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Service Girl Services</h2>
                            <p className="text-muted-foreground">Select service girls and their services</p>
                        </div>

                        {serviceGirlServices.length === 0 ? (
                            <Alert>
                                <AlertTitle>No Services Available</AlertTitle>
                                <AlertDescription>
                                    No service girl services are currently available. You can skip this step.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="space-y-6">
                                {serviceGirlServices.map((service: ServiceResponse) => (
                                    <div key={service.id} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{service.name}</h3>
                                                <p className="text-sm text-muted-foreground">{service.description}</p>
                                                <p className="text-sm font-medium mt-1">KES {service.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Select Service Girl:</Label>
                                            {serviceGirls.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No service girls available</p>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {serviceGirls.map((serviceGirl: User) => {
                                                        const isSelected = serviceGirlSelections.get(service.id) === serviceGirl.id.toString();
                                                        return (
                                                            <div
                                                                key={serviceGirl.id}
                                                                className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent cursor-pointer"
                                                                onClick={() => handleServiceGirlServiceChange(service.id, serviceGirl.id.toString(), !isSelected)}
                                                            >
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={(checked) =>
                                                                        handleServiceGirlServiceChange(service.id, serviceGirl.id.toString(), checked as boolean)
                                                                    }
                                                                />
                                                                <Label className="cursor-pointer flex-1">
                                                                    {serviceGirl.fullName}
                                                                </Label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button onClick={handleNext}>
                                Review & Pay
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Review and Pay - Thermal Receipt Style */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        {selectedServices.length === 0 ? (
                            <Alert>
                                <AlertTitle>No Services Selected</AlertTitle>
                                <AlertDescription>
                                    Please go back and select at least one service.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="mx-auto">
                                {/* Receipt Container */}
                                <div className="bg-white border-2 border-dashed border-muted-foreground/30 p-8  text-xl">
                                    {/* Header */}
                                    <div className="text-center space-y-1 mb-6">
                                        <div className="flex justify-center mb-2">
                                            <Receipt className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-xl font-bold tracking-wider">FOLIOCUTS</h2>
                                        <p className="text-xs">BARBERSHOP</p>
                                        <p className="text-xs text-muted-foreground">Professional Services</p>
                                    </div>

                                    {/* Dotted Divider */}
                                    <div className="border-t border-dashed border-muted-foreground/40 my-4"></div>

                                    {/* Date & Time */}
                                    <div className="text-center text-xs space-y-0.5 mb-4">
                                        <p>{new Date().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}</p>
                                        <p>{new Date().toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}</p>
                                    </div>

                                    {/* Dotted Divider */}
                                    <div className="border-t border-dashed border-muted-foreground/40 my-4"></div>

                                    {/* Customer Info */}
                                    <div className="text-xs mb-4">
                                        <p className="font-semibold mb-1">CUSTOMER:</p>
                                        <p className="text-muted-foreground">{customerPhone}</p>
                                    </div>

                                    {/* Dotted Divider */}
                                    <div className="border-t border-dashed border-muted-foreground/40 my-4"></div>

                                    {/* Items */}
                                    <div className="space-y-3 mb-4">
                                        {selectedServices.map((service, index) => (
                                            <div key={index} className="space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-semibold uppercase text-xs">
                                                            {service.serviceName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Staff: {service.staffName}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold ml-4">
                                                        {service.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dotted Divider */}
                                    <div className="border-t border-dashed border-muted-foreground/40 my-4"></div>

                                    {/* Totals */}
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span>SUBTOTAL:</span>
                                            <span>KES {totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>TAX (0%):</span>
                                            <span>KES 0.00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>DISCOUNT:</span>
                                            <span>KES 0.00</span>
                                        </div>
                                    </div>

                                    {/* Dotted Divider */}
                                    <div className="border-t-2 border-double border-muted-foreground/60 my-4"></div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                                        <span>TOTAL:</span>
                                        <span>KES {totalAmount.toFixed(2)}</span>
                                    </div>

                                    {/* Dotted Divider */}
                                    <div className="border-t-2 border-double border-muted-foreground/60 my-4"></div>

                                    {/* Amount Due */}
                                    <div className="text-center mb-4">
                                        <p className="text-xs text-muted-foreground mb-1">AMOUNT DUE</p>
                                        <p className="text-xl font-bold">KES {totalAmount.toFixed(2)}</p>
                                    </div>

                                    {/* Dotted Divider */}
                                    <div className="border-t border-dashed border-muted-foreground/40 my-4"></div>

                                    {/* Footer */}
                                    <div className="text-center space-y-2 text-xs">
                                        <p className="text-muted-foreground">
                                            THANK YOU FOR YOUR BUSINESS!
                                        </p>
                                        <p className="text-muted-foreground">
                                            Payment due upon service completion
                                        </p>
                                    </div>

                                    {/* Barcode-style decoration */}
                                    <div className="mt-6 flex justify-center gap-0.5">
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-foreground"
                                                style={{ height: `${Math.random() * 20 + 10}px` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between gap-3 pt-6 border-t ">
                            <Button variant="outline" onClick={handleBack} size="lg">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={handlePay}
                                disabled={createRecordMutation.isPending || selectedServices.length === 0}
                                className="min-w-[160px]"
                                size="lg"
                            >
                                {createRecordMutation.isPending ? (
                                    <>
                                        <Spinner className="w-4 h-4 mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        Create Record
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 5: Payment */}
                {currentStep === 5 && createdRecordId && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Payment</h2>
                            <p className="text-muted-foreground">Select payment method and complete the transaction</p>
                        </div>

                        <div className="space-y-6">
                            {/* Payment Method Selection */}
                            <Field>
                                <FieldLabel>Payment Method</FieldLabel>
                                <FieldContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("CASH")}
                                            className={`p-4 border-2 rounded-lg hover:bg-accent transition-colors text-left ${paymentMethod === "CASH"
                                                ? "border-primary bg-primary/5"
                                                : "border-border"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${paymentMethod === "CASH" ? "bg-primary text-primary-foreground" : "bg-muted"
                                                    }`}>
                                                    <Wallet className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">Cash</div>
                                                    <div className="text-sm text-muted-foreground">Pay with cash</div>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("MPESA")}
                                            className={`p-4 border-2 rounded-lg hover:bg-accent transition-colors text-left ${paymentMethod === "MPESA"
                                                ? "border-primary bg-primary/5"
                                                : "border-border"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${paymentMethod === "MPESA" ? "bg-primary text-primary-foreground" : "bg-muted"
                                                    }`}>
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">M-Pesa</div>
                                                    <div className="text-sm text-muted-foreground">Mobile money payment</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </FieldContent>
                            </Field>

                            {/* Cash Fields */}
                            {paymentMethod === "CASH" && (
                                <Field>
                                    <FieldLabel>Received By</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="Enter staff name who received payment"
                                            value={cashReceivedBy}
                                            onChange={(e) => setCashReceivedBy(e.target.value)}
                                        />
                                    </FieldContent>
                                </Field>
                            )}

                            {/* M-Pesa Fields */}
                            {paymentMethod === "MPESA" && (
                                <>
                                    <Field>
                                        <FieldLabel>M-Pesa Receipt Number</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                placeholder="Enter M-Pesa receipt number"
                                                value={mpesaReceiptNumber}
                                                onChange={(e) => setMpesaReceiptNumber(e.target.value)}
                                            />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>M-Pesa Transaction ID</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                placeholder="Enter M-Pesa transaction ID"
                                                value={mpesaTransactionId}
                                                onChange={(e) => setMpesaTransactionId(e.target.value)}
                                            />
                                        </FieldContent>
                                    </Field>
                                </>
                            )}

                            {/* Notes */}
                            <Field>
                                <FieldLabel>Notes (Optional)</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        placeholder="Add any additional notes..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                    />
                                </FieldContent>
                            </Field>

                            {/* Payment Summary */}
                            <div className="rounded-lg border bg-muted/30 p-6">
                                <h3 className="font-semibold mb-4">Payment Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Amount:</span>
                                        <span className="font-medium">KES {totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-semibold">Amount Due:</span>
                                        <span className="text-lg font-bold text-primary">KES {totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between gap-3 pt-6 border-t">
                            <Button variant="outline" onClick={handleBack} size="lg">
                                Skip Payment
                            </Button>
                            <Button
                                onClick={() => {
                                    if (paymentMethod === "CASH" && !cashReceivedBy.trim()) {
                                        notifyError("Please enter who received the cash payment", "Validation Error");
                                        return;
                                    }
                                    if (paymentMethod === "MPESA") {
                                        if (!mpesaReceiptNumber.trim()) {
                                            notifyError("Please enter M-Pesa receipt number", "Validation Error");
                                            return;
                                        }
                                        if (!mpesaTransactionId.trim()) {
                                            notifyError("Please enter M-Pesa transaction ID", "Validation Error");
                                            return;
                                        }
                                    }

                                    const request: CompleteRecordRequest = {
                                        paymentMethod,
                                        mpesaReceiptNumber: mpesaReceiptNumber.trim() || "",
                                        mpesaTransactionId: mpesaTransactionId.trim() || "",
                                        cashReceivedBy: cashReceivedBy.trim() || "",
                                        notes: notes.trim() || "",
                                    };

                                    completeRecordMutation.mutate(request);
                                }}
                                disabled={completeRecordMutation.isPending}
                                className="min-w-[160px]"
                                size="lg"
                            >
                                {completeRecordMutation.isPending ? (
                                    <>
                                        <Spinner className="w-4 h-4 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Complete Payment
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
