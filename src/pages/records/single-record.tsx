import { useParams, useNavigate, Link } from "react-router";
import { useRecord } from "@/hooks/useRecord";
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
import { Phone, ArrowLeft, Scissors, Wallet, Calendar, User, Gift } from "lucide-react";
import type { ServiceItem } from "@/types/record";

export default function SingleRecord() {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const id = Number(recordId);

    const invalidId = !recordId || Number.isNaN(id) || id <= 0;

    const { data, isLoading, error } = useRecord(invalidId ? 0 : id);
    const record = data?.data;

    const formatCurrency = (amount?: number | string) => {
        const parsed = Number(amount ?? 0);
        if (Number.isNaN(parsed)) return "KES 0.00";
        return `KES ${parsed.toFixed(2)}`;
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return "—";
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

    if (invalidId) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Invalid record id.</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (error || !record) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error?.message ?? "Unable to load record"}
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
                            <Link to="/dashboard/records">Records</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{record.recordCode}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Button
                variant="ghost"
                className="mb-4 gap-2"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to records
            </Button>

            <div className="overflow-hidden rounded-2xl border bg-linear-to-r from-primary to-primary/70 text-primary-foreground shadow-xl">
                <div className="p-6 sm:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
                                <Scissors className="h-8 w-8" />
                            </div>
                            <div>
                                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                                    <Badge variant="secondary">{record.status}</Badge>
                                    <Badge variant="outline">{record.customerPhoneNumber}</Badge>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {record.recordCode}
                                </h1>
                                <p className="text-sm text-primary-foreground/80">
                                    {record.customerName}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                            <StatPill
                                label="Total Amount"
                                value={formatCurrency(record.totalAmount)}
                                icon={<Wallet className="h-4 w-4" />}
                            />
                            <StatPill
                                label="Discount"
                                value={formatCurrency(record.discountAmount)}
                                icon={<Wallet className="h-4 w-4" />}
                            />
                            <StatPill
                                label="Final Amount"
                                value={formatCurrency(record.finalAmount)}
                                icon={<Wallet className="h-4 w-4" />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Service Items */}
                    <section className="rounded-xl border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Service Items</h2>
                            <Badge variant="secondary">
                                {record.serviceItems?.length ?? 0} services
                            </Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Staff Member</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {record.serviceItems?.length ? (
                                        record.serviceItems.map((item: ServiceItem) => (
                                            <TableRow key={item.serviceItemId}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Scissors className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{item.serviceName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span>{item.staffName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(item.price)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.isFree ? (
                                                        <div className="flex items-center gap-1">
                                                            <Badge variant="secondary" className="gap-1">
                                                                <Gift className="h-3 w-3" />
                                                                Free
                                                            </Badge>
                                                            {item.freeReason && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    ({item.freeReason})
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Badge variant="outline">Paid</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-20 text-center text-muted-foreground"
                                            >
                                                No service items found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </section>

                    {/* Record Details */}
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Record Information</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoRow
                                icon={<Phone className="h-4 w-4" />}
                                label="Customer Phone"
                                value={record.customerPhoneNumber}
                            />
                            <InfoRow
                                icon={<User className="h-4 w-4" />}
                                label="Customer"
                                value={record.customerName}
                            />
                            <InfoRow
                                icon={<Calendar className="h-4 w-4" />}
                                label="Created"
                                value={formatDateTime(record.createdAt)}
                            />
                            <InfoRow
                                icon={<Calendar className="h-4 w-4" />}
                                label="Last Updated"
                                value={formatDateTime(record.updatedAt)}
                            />
                        </div>
                        {record.message && (
                            <div className="mt-4 rounded-lg border bg-muted/40 p-3">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Message:</strong> {record.message}
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    {/* Payment Summary */}
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Payment Summary</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatCurrency(record.totalAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between pb-2">
                                <span className="text-sm text-muted-foreground">Discount</span>
                                <span className="font-medium text-green-600">
                                    -{formatCurrency(record.discountAmount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-3">
                                <span className="text-base font-semibold">Total</span>
                                <span className="text-lg font-bold text-primary">
                                    {formatCurrency(record.finalAmount)}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button
                                className="w-full"
                                variant="default"
                                onClick={() => navigate(`/dashboard/customers?phone=${record.customerPhoneNumber}`)}
                            >
                                View Customer Profile
                            </Button>
                            <Button className="w-full" variant="outline">
                                Export Receipt
                            </Button>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => navigate("/dashboard/records/create")}
                            >
                                Create New Record
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
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-primary-foreground/15 px-4 py-3 text-center text-primary-foreground">
            <div className="mb-1 flex items-center justify-center gap-2 text-xs uppercase tracking-wide">
                {icon}
                {label}
            </div>
            <div className="text-2xl font-semibold">{value}</div>
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
    value: string;
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


