import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useCustomer } from "@/hooks/useCustomer";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    ArrowLeft,
    Calendar,
    Phone,
    Scissors,
    Star,
    Wallet,
} from "lucide-react";
import type {
    CustomerLoyaltyTracker,
    CustomerRecord,
} from "@/types/customer";

function SingleCustomer() {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const id = Number(customerId);

    const { data, isLoading, error } = useCustomer(id);
    const customer = data?.data;

    const totalSaved = useMemo(() => {
        if (!customer?.records?.length) return 0;
        return customer.records.reduce((sum, record) => {
            const discount = Number(record.discountAmount ?? 0);
            return sum + (Number.isNaN(discount) ? 0 : discount);
        }, 0);
    }, [customer?.records]);

    const totalFinalAmount = useMemo(() => {
        if (!customer?.records?.length) return 0;
        return customer.records.reduce((sum, record) => {
            const finalAmount = Number(record.finalAmount ?? 0);
            return sum + (Number.isNaN(finalAmount) ? 0 : finalAmount);
        }, 0);
    }, [customer?.records]);

    const activeTrackers = useMemo(
        () => customer?.loyaltyTrackers ?? [],
        [customer?.loyaltyTrackers]
    );

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: string | number) => {
        const parsed = Number(amount ?? 0);
        if (Number.isNaN(parsed)) return "KES 0.00";
        return `KES ${parsed.toFixed(2)}`;
    };

    if (!customerId || Number.isNaN(id)) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Invalid customer id.</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (error || !customer) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error?.message ?? "Unable to load customer"}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
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
                            <Link to="/dashboard/customers">Customers</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{customer.customerCode}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Button
                variant="ghost"
                className="mb-4 gap-2"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to customers
            </Button>

            {/* Header / hero */}
            <div className="overflow-hidden rounded-2xl border bg-linear-to-r from-primary to-primary/70 text-primary-foreground shadow-xl">
                <div className="p-6 sm:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
                                <Star className="h-8 w-8" />
                            </div>
                            <div>
                                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                                    <Badge variant="secondary">Loyal Customer</Badge>
                                    <Badge variant="outline">{customer.phoneNumber}</Badge>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {customer.customerCode}
                                </h1>
                                <p className="text-sm text-primary-foreground/80">
                                    Joined {formatDateTime(customer.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                            <StatPill
                                label="Total Visits"
                                value={customer.totalVisits}
                                icon={<Scissors className="h-4 w-4" />}
                            />
                            <StatPill
                                label="Total Spent"
                                value={formatCurrency(customer.totalSpent)}
                                icon={<Wallet className="h-4 w-4" />}
                            />
                            <StatPill
                                label="Total Saved"
                                value={formatCurrency(totalSaved)}
                                icon={<Star className="h-4 w-4" />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Visit history */}
                    <section className="rounded-xl border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Visit History</h2>
                            <Badge variant="secondary">
                                {customer.records?.length ?? 0} visits
                            </Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Record Code</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Discount</TableHead>
                                        <TableHead className="text-right">Final</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customer.records?.length ? (
                                        customer.records.map((record: CustomerRecord) => (
                                            <TableRow key={record.id}>
                                                <TableCell>{record.recordCode}</TableCell>
                                                <TableCell>{formatDateTime(record.createdAt)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{record.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(record.totalAmount)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(record.discountAmount)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(record.finalAmount)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-20 text-center text-muted-foreground"
                                            >
                                                No visits recorded for this customer yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {customer.records?.length ? (
                            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                <span>
                                    Total final amount:{" "}
                                    <strong>{formatCurrency(totalFinalAmount)}</strong>
                                </span>
                            </div>
                        ) : null}
                    </section>

                    {/* Loyalty progress */}
                    <section className="rounded-xl border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Loyalty Progress</h2>
                            <Badge variant="secondary">
                                {activeTrackers.length} active programs
                            </Badge>
                        </div>
                        {activeTrackers.length ? (
                            <div className="space-y-4">
                                {activeTrackers.map((tracker: CustomerLoyaltyTracker) => {
                                    const current = Number(tracker.currentCount ?? 0);
                                    const required = Number(tracker.visitsRequired ?? 0);
                                    const progress =
                                        required > 0
                                            ? Math.min(100, Math.round((current / required) * 100))
                                            : 0;

                                    return (
                                        <div
                                            key={tracker.id}
                                            className="rounded-lg border bg-muted/40 p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Scissors className="h-4 w-4 text-primary" />
                                                    <h3 className="font-semibold">
                                                        {tracker.serviceName}
                                                    </h3>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {current} / {required} visits
                                                </span>
                                            </div>
                                            <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Total earned:{" "}
                                                <span className="font-medium">
                                                    {formatCurrency(tracker.totalEarned)}
                                                </span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                This customer is not enrolled in any loyalty programs yet.
                            </p>
                        )}
                    </section>
                </div>

                {/* Right column: contact & quick actions */}
                <div className="space-y-6">
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Customer Details</h2>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <InfoRow
                                icon={<Phone className="h-4 w-4" />}
                                label="Phone Number"
                                value={customer.phoneNumber}
                            />
                            <InfoRow
                                icon={<Calendar className="h-4 w-4" />}
                                label="First Visit"
                                value={formatDateTime(customer.createdAt)}
                            />
                            <InfoRow
                                icon={<Calendar className="h-4 w-4" />}
                                label="Last Updated"
                                value={formatDateTime(customer.updatedAt)}
                            />
                        </div>
                    </section>

                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button className="w-full" variant="outline">
                                Export History
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

export default SingleCustomer;