import { useParams, useNavigate, Link } from "react-router";
import { useServicesByServiceTypeId } from "@/hooks/useService";
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
import { ArrowLeft, Tag, DollarSign, Percent } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ServiceTypeServices() {
    const { serviceTypeId } = useParams();
    const navigate = useNavigate();
    const { data: services, isLoading, error } = useServicesByServiceTypeId(serviceTypeId!);



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

    return (
        <div className="p-6 space-y-6">
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
                            <Link to="/dashboard/service-types">Service Types</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Services</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard/service-types")}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Service Types
                </Button>
            </div>

            {services?.data && services.data.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                <span className="text-xs font-medium text-accent">
                                    Services in this Type
                                </span>
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground">
                                Services ({services.data.length})
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.data.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => navigate(`/dashboard/services/${service.id}`)}
                                className="group rounded-xl p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-border/60 hover:border-accent hover:shadow-lg transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                                            {service.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {service.description}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-[11px] font-medium
                                            ${service.isActive
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-gray-100 text-gray-500"}
                                        `}
                                    >
                                        {service.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                                            Price
                                        </p>
                                        <p className="text-xl font-bold text-primary">
                                            KES {service.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1 justify-end">
                                            <Percent className="w-3 h-3 text-muted-foreground" />
                                            Default Commission
                                        </p>
                                        <p className="text-sm font-semibold text-accent">
                                            {service.defaultCommissionRate}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card">
                    <div className="max-w-md mx-auto">
                        <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">
                            No Services Found
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            There are no services available for this service type yet.
                        </p>
                        <Button
                            variant="default"
                            onClick={() => navigate("/dashboard/services/new")}
                        >
                            Create New Service
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
