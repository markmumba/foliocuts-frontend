import { useParams, useNavigate } from "react-router";
import { useServicesByServiceTypeId } from "@/hooks/useService";
import { Button } from "@/components/ui/button";
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
                        <h2 className="text-2xl font-semibold text-card-foreground">
                            Services ({services.data.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.data.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => navigate(`/dashboard/services/${service.id}`)}
                                className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                                        {service.name}
                                    </h3>
                                    {service.isActive && (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                            Active
                                        </span>
                                    )}
                                </div>
                                {service.description && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {service.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-lg font-bold text-card-foreground">
                                            KSh {service.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Percent className="w-3 h-3" />
                                        <span>{service.defaultCommissionRate}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="border border-border rounded-lg p-12 text-center bg-card">
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
