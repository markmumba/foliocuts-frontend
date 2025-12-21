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
    User,
    Gift,
    TrendingUp,
    Download,
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
        <div className="p-8">
            {/* Header with Back Button */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Customers
                </button>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">Customer Profile</h1>
                        <p className="text-muted-foreground">Complete details for {customer.customerCode}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                            <User className="w-5 h-5" />
                            Customer Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-1">Customer Code</label>
                                    <p className="text-foreground font-medium font-mono text-sm">{customer.customerCode}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-1">Phone Number</label>
                                    <p className="text-foreground font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        {customer.phoneNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-1">First Visit</label>
                                    <p className="text-foreground font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        {formatDateTime(customer.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-1">Last Updated</label>
                                    <p className="text-foreground font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        {formatDateTime(customer.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visit history */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                            <Scissors className="w-5 h-5" />
                            Visit History
                        </h2>
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
                                            <TableRow
                                                key={record.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => navigate(`/dashboard/records/${record.id}`)}
                                            >
                                                <TableCell className="font-medium">{record.recordCode}</TableCell>
                                                <TableCell>{formatDateTime(record.createdAt)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            record.status?.toUpperCase() === 'COMPLETED'
                                                                ? 'default'
                                                                : record.status?.toUpperCase() === 'PENDING'
                                                                    ? 'secondary'
                                                                    : 'destructive'
                                                        }
                                                    >
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(record.totalAmount)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(record.discountAmount)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
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
                    </div>

                    {/* Loyalty progress */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                            <Gift className="w-5 h-5" />
                            Loyalty Progress
                        </h2>
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
                                            className="rounded-lg border border-border bg-muted/40 p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Scissors className="h-4 w-4 text-primary" />
                                                    <h3 className="font-semibold text-foreground">
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
                                                <span className="font-medium text-foreground">
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
                    </div>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    {/* Customer Summary */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5" />
                            Customer Summary
                        </h2>

                        <div className="space-y-4">
                            <div className="pb-4 border-b border-border">
                                <label className="text-sm text-muted-foreground block mb-1">Total Visits</label>
                                <p className="text-2xl font-bold text-foreground">
                                    {customer.totalVisits ?? 0}
                                </p>
                            </div>

                            <div className="pb-4 border-b border-border">
                                <label className="text-sm text-muted-foreground block mb-1">Total Spent</label>
                                <p className="text-xl font-semibold text-foreground">
                                    {formatCurrency(customer.totalSpent)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-muted-foreground block mb-1">Total Saved</label>
                                <p className="text-xl font-bold text-green-600">{formatCurrency(totalSaved)}</p>
                                <p className="text-xs text-muted-foreground mt-1">From discounts</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-linear-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
                        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Total Records</span>
                                <span className="text-sm font-medium">{customer.records?.length ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Total Final Amount</span>
                                <span className="text-sm font-medium">{formatCurrency(totalFinalAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Active Programs</span>
                                <span className="text-sm font-medium">{activeTrackers.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button className="w-full justify-start" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export History
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="default"
                                onClick={() => navigate("/dashboard/records/create")}
                            >
                                <Scissors className="w-4 h-4 mr-2" />
                                Create New Record
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleCustomer;