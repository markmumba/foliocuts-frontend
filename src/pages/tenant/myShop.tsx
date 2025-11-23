import { useMemo } from "react";
import { useNavigate, Link } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { useTenant } from "@/hooks/useTenants";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Building2,
    Calendar,
    CreditCard,
    Mail,
    MapPin,
    Phone,
    Scissors,
    Shield,
    Users,
    Edit,
} from "lucide-react";
import type { TenantServices } from "@/types/tenant";

export default function MyShop() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: myShop, isLoading, isError, error } = useTenant(user?.tenantId ?? "");

    console.log("MyShop render - isLoading:", isLoading, "isError:", isError, "myShop:", myShop);
    const tenant = myShop?.data;
    console.log("tenant data:", tenant);

    const groupedServices = useMemo(() => {
        if (!tenant?.services?.length) {
            return [];
        }

        const groups = tenant.services.reduce<Record<string, TenantServices[]>>((acc, service) => {
            if (!acc[service.serviceType]) {
                acc[service.serviceType] = [];
            }
            acc[service.serviceType].push(service);
            return acc;
        }, {});

        return Object.entries(groups).map(([type, services]) => ({ type, services }));
    }, [tenant?.services]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (!user?.tenantId) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You don't have access to a shop. Please contact your administrator.</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error?.message ?? "Unable to load shop details"}</AlertDescription>
            </Alert>
        );
    }

    if (!tenant) {
        return <Spinner />;
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
                        <BreadcrumbPage>My Shop</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {/* Header Section */}
            <div className="overflow-hidden rounded-2xl border bg-linear-to-r from-primary to-primary/70 text-primary-foreground shadow-xl">
                <div className="p-6 sm:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
                                <Building2 className="h-8 w-8" />
                            </div>
                            <div>
                                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                                    <Badge variant="secondary">{tenant.subscriptionPlan}</Badge>
                                    <Badge variant={tenant.status === "ACTIVE" ? "default" : "secondary"}>
                                        {tenant.status}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tenant.businessName}</h1>
                                <p className="text-sm text-primary-foreground/80">{tenant.subdomain}.foliocuts.com</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                            <StatPill label="Staff" value={tenant.numberOfUsers} icon={<Users className="h-4 w-4" />} />
                            <StatPill label="Services" value={tenant.numberOfServices} icon={<Scissors className="h-4 w-4" />} />
                            <StatPill
                                label="Barber"
                                value={tenant.numberOfBarberServices}
                                icon={<Scissors className="h-4 w-4" />}
                            />
                            <StatPill
                                label="Service Girl"
                                value={tenant.numberOfServiceGirlServices}
                                icon={<Scissors className="h-4 w-4" />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Shop Overview */}
                    <section className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Shop Information</h2>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={tenant.email} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={tenant.phoneNumber} />
                            <InfoRow
                                icon={<CreditCard className="h-4 w-4" />}
                                label="M-Pesa Till"
                                value={tenant.mpesaTillNo || "Not set"}
                            />
                            <InfoRow
                                icon={<CreditCard className="h-4 w-4" />}
                                label="Business Short Code"
                                value={tenant.mpesaBusinessShortCode || "Not set"}
                            />
                            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Created" value={formatDate(tenant.createdAt)} />
                            <InfoRow
                                icon={<Calendar className="h-4 w-4" />}
                                label="Last Updated"
                                value={formatDate(tenant.updatedAt)}
                            />
                        </div>
                    </section>

                    {/* Staff List */}
                    <section className="rounded-xl border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Staff Members</h2>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{tenant.users?.length ?? 0} members</Badge>
                                <Button size="sm" onClick={() => navigate("/dashboard/staff")}>
                                    Manage Staff
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tenant.users?.length ? (
                                        tenant.users.map((staffMember) => (
                                            <TableRow key={staffMember.userId}>
                                                <TableCell>{staffMember.email}</TableCell>
                                                <TableCell>{staffMember.phoneNumber || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{staffMember.role}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                                                No staff members yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="rounded-xl border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Services</h2>
                            <Button size="sm" onClick={() => navigate("/dashboard/services")}>
                                Manage Services
                            </Button>
                        </div>
                        {groupedServices.length ? (
                            <div className="space-y-6">
                                {groupedServices.map((group) => (
                                    <div key={group.type} className="rounded-lg border bg-muted/30 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <h3 className="font-semibold text-sm uppercase tracking-wide">{group.type}</h3>
                                            </div>
                                            <Badge variant="outline">{group.services.length} services</Badge>
                                        </div>
                                        <div className="space-y-3">
                                            {group.services.map((service) => (
                                                <div
                                                    key={service.serviceId}
                                                    className="flex items-center justify-between rounded-md border bg-card/80 px-3 py-2"
                                                >
                                                    <div>
                                                        <p className="font-medium">{service.serviceName}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {service.serviceId}</p>
                                                    </div>
                                                    <span className="text-sm font-semibold">KES {service.servicePrice}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-muted-foreground mb-4">No services have been added yet.</p>
                                <Button variant="outline" onClick={() => navigate("/dashboard/services")}>
                                    Add Your First Service
                                </Button>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* About Section */}
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">About Your Shop</h2>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4" />
                                <span>{tenant.subdomain}.foliocuts.com</span>
                            </div>
                            <p>
                                Your shop <strong>{tenant.businessName}</strong> operates on the{" "}
                                <strong>{tenant.subscriptionPlan}</strong> plan and is {tenant.status.toLowerCase()}.
                            </p>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button className="w-full" variant="default" onClick={() => navigate("/dashboard/staff")}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Staff
                            </Button>
                            <Button className="w-full" variant="outline" onClick={() => navigate("/dashboard/services")}>
                                <Scissors className="mr-2 h-4 w-4" />
                                Manage Services
                            </Button>
                            <Button className="w-full" variant="outline" onClick={() => navigate("/dashboard/records")}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                View Records
                            </Button>
                            <Button className="w-full" variant="outline" onClick={() => navigate("/dashboard/service-types")}>
                                <Shield className="mr-2 h-4 w-4" />
                                Service Types
                            </Button>
                        </div>
                    </section>

                    {/* Subscription Info */}
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Subscription</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Current Plan</span>
                                <Badge variant="secondary">{tenant.subscriptionPlan}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={tenant.status === "ACTIVE" ? "default" : "secondary"}>
                                    {tenant.status}
                                </Badge>
                            </div>
                            <Button className="w-full mt-4" variant="outline">
                                Upgrade Plan
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function StatPill({
    label,
    value,
    icon,
}: {
    label: string;
    value: string | number | undefined;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-primary-foreground/15 px-4 py-3 text-center text-primary-foreground">
            <div className="mb-1 flex items-center justify-center gap-2 text-xs uppercase tracking-wide">
                {icon}
                {label}
            </div>
            <div className="text-2xl font-semibold">{value ?? "0"}</div>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {icon}
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-card-foreground">{value || "—"}</p>
            </div>
        </div>
    );
}