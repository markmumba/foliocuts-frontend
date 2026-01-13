import { useParams, useNavigate, Link } from "react-router";
import { useService } from "@/hooks/useService";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Edit, DollarSign, Percent, Calendar, Tag, Info } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function SingleService() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { data: service, isLoading, error } = useService(serviceId!);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!service?.data) {
        return (
            <div className="p-6">
                <Alert>
                    <AlertTitle>Service Not Found</AlertTitle>
                    <AlertDescription>The service you're looking for doesn't exist.</AlertDescription>
                </Alert>
            </div>
        );
    }

    const serviceData = service.data;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
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
                        <BreadcrumbPage>{serviceData.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard/services")}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Services
                </Button>
            </div>

            {/* Service Header Card */}
            <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-card-foreground">
                                {serviceData.name}
                            </h1>
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${serviceData.isActive
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                    : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {serviceData.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            {serviceData.description}
                        </p>
                    </div>
                </div>

                {/* Service Type Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Service Type:</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
                        {serviceData.serviceTypeName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        ({serviceData.serviceTypeStaffRole})
                    </span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price Card */}
                <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                            <p className="text-2xl font-bold text-card-foreground">
                                KSh {serviceData.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Commission Rate Card */}
                <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Percent className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Commission Rate
                            </h3>
                            <p className="text-2xl font-bold text-card-foreground">
                                {serviceData.defaultCommissionRate}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loyalty Rule Card */}
            {serviceData.loyaltyRule && (
                <div className="border border-border rounded-lg p-6 bg-linear-to-br from-accent/5 to-accent/10 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-semibold text-card-foreground">
                            Loyalty Program
                        </h2>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-md ${serviceData.loyaltyRule.isActive
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {serviceData.loyaltyRule.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                Visits Required
                            </p>
                            <p className="text-lg font-semibold text-card-foreground">
                                {serviceData.loyaltyRule.visitsRequired} visit
                                {serviceData.loyaltyRule.visitsRequired !== 1 ? "s" : ""}
                            </p>
                        </div>
                        {serviceData.loyaltyRule.description && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Description
                                </p>
                                <p className="text-sm text-card-foreground">
                                    {serviceData.loyaltyRule.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Created:</span>
                        <span className="font-medium text-card-foreground">
                            {new Date(serviceData.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Last Updated:</span>
                        <span className="font-medium text-card-foreground">
                            {new Date(serviceData.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/dashboard/services")}
                >
                    Cancel
                </Button>
                <Button
                    variant="default"
                    size="lg"
                    onClick={() => navigate(`/dashboard/services/${serviceId}/edit`)}
                    className="gap-2"
                >
                    <Edit className="w-4 h-4" />
                    Update Service
                </Button>
            </div>
        </div>
    );
}
