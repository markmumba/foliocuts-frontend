import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useServices } from "@/hooks/useService";
import { useNavigate, Outlet, useLocation, useParams, Link } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Services() {
    const { data: services, isLoading, error } = useServices();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const isCreatePage = location.pathname.includes('/new');
    const isSingleServicePage = !!params.serviceId;

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
        <div className="p-6 space-y-6">
            {!isCreatePage && !isSingleServicePage && (
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Services</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            )}
            <Outlet />
            {!isCreatePage && !isSingleServicePage && (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Services</h1>
                            <p className="text-muted-foreground">
                                Manage your barbershop services
                            </p>
                        </div>
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => navigate("/dashboard/services/new")}
                        >
                            Create New Service
                        </Button>
                    </div>

                    {/* Services list - only show if not on a nested route */}
                    {!isCreatePage && !isSingleServicePage && (
                        services?.data?.length && services?.data?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {services.data.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => navigate(`/dashboard/services/${service.id}`)}
                                        className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {service.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold">KSh {service.price.toFixed(2)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {service.serviceTypeName}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <div className="border border-border rounded-lg p-12 text-center bg-card">
                                <p className="text-muted-foreground mb-4">No services found</p>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => navigate("/dashboard/services/new")}
                                >
                                    Create Your First Service
                                </Button>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}