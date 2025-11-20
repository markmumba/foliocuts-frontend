import { useMemo } from "react"
import { useNavigate, useParams } from "react-router"
import { useTenant } from "@/hooks/useTenants"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Building2, Calendar, CreditCard, Mail, MapPin, Phone, Scissors, Shield, Users } from "lucide-react"
import type { TenantServices } from "@/types/tenant"

export default function SingleTenant() {
    const { tenantId } = useParams()
    const navigate = useNavigate()
    const { data, isLoading, error } = useTenant(tenantId ?? "")
    const tenant = data?.data

    const groupedServices = useMemo(() => {
        if (!tenant?.services?.length) {
            return []
        }

        const groups = tenant.services.reduce<Record<string, TenantServices[]>>((acc, service) => {
            if (!acc[service.serviceType]) {
                acc[service.serviceType] = []
            }
            acc[service.serviceType].push(service)
            return acc
        }, {})

        return Object.entries(groups).map(([type, services]) => ({ type, services }))
    }, [tenant?.services])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (isLoading) {
        return <Spinner />
    }

    if (error || !tenant) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error?.message ?? "Unable to load tenant"}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="min-h-screen bg-background p-6 -ml-[calc(var(--sidebar-width))]">
            <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
                Back to tenants
            </Button>

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
                                    <Badge variant={tenant.status === "ACTIVE" ? "default" : "secondary"}>{tenant.status}</Badge>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tenant.businessName}</h1>
                                <p className="text-sm text-primary-foreground/80">{tenant.subdomain}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                            <StatPill label="Total Staff" value={tenant.numberOfUsers} icon={<Users className="h-4 w-4" />} />
                            <StatPill label="Total Services" value={tenant.numberOfServices} icon={<Scissors className="h-4 w-4" />} />
                            <StatPill label="Barber Services" value={tenant.numberOfBarberServices} icon={<Scissors className="h-4 w-4" />} />
                            <StatPill label="Service Girl Services" value={tenant.numberOfServiceGirlServices} icon={<Scissors className="h-4 w-4" />} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Overview</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={tenant.email} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={tenant.phoneNumber} />
                            <InfoRow icon={<CreditCard className="h-4 w-4" />} label="M-Pesa Till" value={tenant.mpesaTillNo || "—"} />
                            <InfoRow
                                icon={<CreditCard className="h-4 w-4" />}
                                label="Business Short Code"
                                value={tenant.mpesaBusinessShortCode || "—"}
                            />
                            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Created" value={formatDate(tenant.createdAt)} />
                            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Last Updated" value={formatDate(tenant.updatedAt)} />
                        </div>
                    </section>

                    <section className="rounded-xl border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Employees</h2>
                            <Badge variant="secondary">{tenant.users?.length ?? 0} members</Badge>
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
                                        tenant.users.map((user) => (
                                            <TableRow key={user.userId}>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.phoneNumber || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{user.role}</Badge>
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

                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Services</h2>
                        {groupedServices.length ? (
                            <div className="space-y-6">
                                {groupedServices.map((group) => (
                                    <div key={group.type} className="rounded-lg border bg-muted/30 p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <h3 className="font-semibold text-sm uppercase tracking-wide">{group.type}</h3>
                                            </div>
                                            <Badge variant="outline">{group.services.length} services</Badge>
                                        </div>
                                        <div className="space-y-3">
                                            {group.services.map((service) => (
                                                <div key={service.serviceId} className="flex items-center justify-between rounded-md border bg-card/80 px-3 py-2">
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
                            <p className="text-sm text-muted-foreground">No services have been added for this tenant.</p>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">About this Tenant</h2>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4" />
                                <span>{tenant.subdomain}.foliocuts.com</span>
                            </div>
                            <p>
                                FolioCuts tenant environment configured for <strong>{tenant.businessName}</strong>. This tenant currently
                                operates on the <strong>{tenant.subscriptionPlan}</strong> plan and is {tenant.status.toLowerCase()}.
                            </p>
                        </div>
                    </section>

                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Actions</h2>
                        <div className="space-y-3">
                            <Button className="w-full" variant="default">
                                Manage Subscription
                            </Button>
                            <Button className="w-full" variant="outline">
                                Edit Tenant Details
                            </Button>
                            <Button className="w-full" variant="outline">
                                Impersonate Tenant
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function StatPill({
    label,
    value,
    icon,
}: {
    label: string
    value: string | number | undefined
    icon: React.ReactNode
}) {
    return (
        <div className="rounded-2xl bg-primary-foreground/15 px-4 py-3 text-center text-primary-foreground">
            <div className="mb-1 flex items-center justify-center gap-2 text-xs uppercase tracking-wide">
                {icon}
                {label}
            </div>
            <div className="text-2xl font-semibold">{value ?? "0"}</div>
        </div>
    )
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string | undefined
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
    )
}
