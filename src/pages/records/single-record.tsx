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
import {
    Phone,
    ArrowLeft,
    Scissors,
    Calendar,
    User,
    Gift,
    Download,
    Printer,
    DollarSign,
    Tag,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import type { ServiceItem } from "@/types/record";
import { formatCurrency, formatDateTime } from "@/utils/utilities";
import { buildRecordReceiptHtml } from "@/utils/recordReceipt";

export default function SingleRecord() {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const id = Number(recordId);

    const invalidId = !recordId || Number.isNaN(id) || id <= 0;

    const { data, isLoading, error } = useRecord(invalidId ? 0 : id);
    const record = data?.data;




    const getStatusColor = (status: string) => {
        const normalizedStatus = status?.toUpperCase();
        switch (normalizedStatus) {
            case 'COMPLETED':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const handlePrint = () => {
        if (!record) return;
        const html = buildRecordReceiptHtml(record);
        if (!html) return;

        const printWindow = window.open("", "_blank", "width=800,height=600");
        if (!printWindow) return;

        printWindow.document.open();
        printWindow.document.write(html.replace(
            "</body>",
            `<script>window.onload = function() { window.print(); }</script></body>`
        ));
        printWindow.document.close();
    };

    const handleDownload = () => {
        if (!record) return;
        const html = buildRecordReceiptHtml(record);
        if (!html) return;

        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `receipt-${record.recordCode}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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

    const dateTime = formatDateTime(record?.createdAt);

    return (
        <div className="p-8">
            {/* Header with Back Button */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Records
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
                                        <Link to="/dashboard/records">Records</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{record.recordCode}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Service Record</h1>
                        <p className="text-muted-foreground">Complete details for record #{record.recordCode}</p>
                    </div>

                    <div className="flex items-center gap-3">
                     
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Banner */}
            <div className={`rounded-xl p-6 mb-8 border ${getStatusColor(record.status)}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {record.status?.toUpperCase() === 'COMPLETED' ? (
                            <CheckCircle className="w-8 h-8" />
                        ) : record.status?.toUpperCase() === 'CANCELLED' ? (
                            <XCircle className="w-8 h-8" />
                        ) : (
                            <Clock className="w-8 h-8" />
                        )}
                        <div>
                            <h3 className="text-lg font-semibold capitalize mb-1">{record.status?.toLowerCase() || 'unknown'}</h3>
                            <p className="text-sm opacity-80">
                                {record.status?.toUpperCase() === 'COMPLETED'
                                    ? 'This service has been completed successfully'
                                    : record.status?.toUpperCase() === 'PENDING'
                                        ? 'Payment confirmation pending'
                                        : 'This service was cancelled'}
                            </p>
                        </div>
                    </div>
                    <Badge className="px-4 py-2 text-sm">{record.status}</Badge>
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
                                    <label className="text-sm text-muted-foreground block mb-1">Customer Name</label>
                                    <p className="text-foreground font-medium">{record.customerName || 'Guest Customer'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-1">Phone Number</label>
                                    <p className="text-foreground font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        {record.customerPhoneNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-1">Record ID</label>
                                    <p className="text-foreground font-medium font-mono text-sm">{record.recordCode}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground block mb-1">Created</label>
                                    <p className="text-foreground font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        {dateTime.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Items */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                            <Scissors className="w-5 h-5" />
                            Service Details
                        </h2>

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
                    </div>

                    {/* Additional Notes */}
                    {record.message && (
                        <div className="bg-card rounded-xl p-6 border border-border">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                                <Tag className="w-5 h-5" />
                                Additional Notes
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">{record.message}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    {/* Financial Summary */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                            <DollarSign className="w-5 h-5" />
                            Financial Summary
                        </h2>

                        <div className="space-y-4">
                            <div className="pb-4 border-b border-border">
                                <label className="text-sm text-muted-foreground block mb-1">Service Price</label>
                                <p className="text-2xl font-bold text-foreground">
                                    {formatCurrency(record.totalAmount)}
                                </p>
                            </div>

                            <div className="pb-4 border-b border-border">
                                <label className="text-sm text-muted-foreground block mb-1">Discount</label>
                                <p className="text-xl font-semibold text-green-600">
                                    -{formatCurrency(record.discountAmount)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-muted-foreground block mb-1">Final Amount</label>
                                <p className="text-xl font-bold text-primary">{formatCurrency(record.finalAmount)}</p>
                                <p className="text-xs text-muted-foreground mt-1">After discount</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-linear-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
                        <h3 className="text-lg font-semibold mb-4">Record Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Status</span>
                                <span className="text-sm font-medium">{record.status}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Services</span>
                                <span className="text-sm font-medium">{record.serviceItems?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Created</span>
                                <span className="text-sm font-medium">{dateTime.date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => navigate(`/dashboard/customers?phone=${record.customerPhoneNumber}`)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                View Customer Profile
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


