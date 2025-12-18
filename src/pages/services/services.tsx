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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                <span className="text-xs font-medium text-accent">Services & Pricing</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-1 text-foreground">Services</h1>
                            <p className="text-muted-foreground">
                                Configure your menu, pricing, and default commission rates
                            </p>
                        </div>
                        <Button
                            variant="default"
                            size="lg"
                            className="gap-2 bg-accent text-white hover:bg-accent/90"
                            onClick={() => navigate("/dashboard/services/new")}
                        >
                            + Create New Service
                        </Button>
                    </div>

                    {/* Services list - only show if not on a nested route */}
                    {!isCreatePage && !isSingleServicePage && (
                        services?.data?.length && services?.data?.length > 0 ? (
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
                                            <span className={`px-2 py-1 rounded-full text-[11px] font-medium
                                                ${service.isActive
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-gray-100 text-gray-500"}
                                            `}>
                                                {service.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                                    Price
                                                </p>
                                                <p className="text-xl font-bold text-primary">
                                                    KES {service.price.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                                    Default Commission
                                                </p>
                                                <p className="text-sm font-semibold text-accent">
                                                    {service.defaultCommissionRate}%
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {service.serviceTypeName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card">
                                <p className="text-muted-foreground mb-2">No services found</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Start by adding your first service with pricing and commission
                                </p>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="gap-2"
                                    onClick={() => navigate("/dashboard/services/new")}
                                >
                                    + Create Your First Service
                                </Button>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}