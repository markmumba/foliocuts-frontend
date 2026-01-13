import { useState, useMemo, useEffect } from "react";
import { useRecords, useRecordSummary } from "@/hooks/useRecord";
import { useUsers } from "@/hooks/userUser";
import { Spinner } from "@/components/ui/spinner";
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
import type { RecordList, PaginationMetadata } from "@digital-barbershop/shared-types";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { Search, Download, TrendingUp, DollarSign, Calendar, Scissors } from "lucide-react";
import { RecordFilters } from "@/components/records/RecordFilters";
import { DataTable } from "./record-table-definition/data-table";
import { buildRecordColumns } from "./record-table-definition/column";

const formatDate = (d: Date) => d.toISOString().slice(0, 10); // yyyy-mm-dd

function getDateRange(range: string) {
    const today = new Date();
    const end = formatDate(today);

    const startDate = new Date(today);
    if (range === "today") return { dateFrom: end, dateTo: end };
    if (range === "yesterday") {
        startDate.setDate(startDate.getDate() - 1);
        const d = formatDate(startDate);
        return { dateFrom: d, dateTo: d };
    }
    if (range === "week") {
        startDate.setDate(startDate.getDate() - 6);
        return { dateFrom: formatDate(startDate), dateTo: end };
    }
    if (range === "month") {
        startDate.setDate(startDate.getDate() - 29);
        return { dateFrom: formatDate(startDate), dateTo: end };
    }
    return { dateFrom: undefined, dateTo: undefined };
}

export default function Records() {
    const navigate = useNavigate();
    const location = useLocation();
    const isCreatePage = location.pathname.includes('/create');
    const isSingleRecordPage = /\/dashboard\/records\/\d+$/.test(location.pathname);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dateRange, setDateRange] = useState('all');
    const [staffFilter, setStaffFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 3000);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, dateRange, staffFilter, paymentFilter, statusFilter]);

    const { data: staffData } = useUsers();
    const { data: summaryData } = useRecordSummary();

    const staff = useMemo(() => {
        const payload = staffData?.data;
        if (Array.isArray(payload)) {
            return payload;
        }
        return [];
    }, [staffData]);

    const { data, isLoading, isFetching, error } = useRecords(
        useMemo(() => {
            const { dateFrom, dateTo } = getDateRange(dateRange);

            let staffName: string | undefined = undefined;
            if (staffFilter !== 'all') {
                const staffId = parseInt(staffFilter, 10);
                const selectedStaff = staff.find(s => s.id === staffId);
                staffName = selectedStaff?.fullName || undefined;
            }

            return {
                page,
                size: pageSize,
                search: debouncedSearch || undefined,
                staffName,
                paymentMethod: paymentFilter === 'all' ? undefined : paymentFilter,
                status: statusFilter === 'all' ? undefined : statusFilter,
                dateFrom,
                dateTo,
            };
        }, [page, pageSize, debouncedSearch, paymentFilter, statusFilter, dateRange, staffFilter, staff])
    );

    const { allRecords, pagination } = useMemo(() => {
        const payload = data?.data as unknown;

        if (
            payload &&
            typeof payload === "object" &&
            Array.isArray((payload as { items?: RecordList[] }).items)
        ) {
            const p = payload as { items: RecordList[]; metadata?: PaginationMetadata };
            return {
                allRecords: p.items ?? [],
                pagination: p.metadata,
            };
        }

        // Case 2: Simple array
        if (Array.isArray(payload)) {
            return {
                allRecords: payload as RecordList[],
                pagination: undefined as PaginationMetadata | undefined,
            };
        }

        // Case 3: Spring-style { content, ... }
        if (
            payload &&
            typeof payload === "object" &&
            Array.isArray((payload as { content?: RecordList[] }).content)
        ) {
            const p = payload as { content: RecordList[] };
            return {
                allRecords: p.content ?? [],
                pagination: undefined as PaginationMetadata | undefined,
            };
        }

        return { allRecords: [] as RecordList[], pagination: undefined as PaginationMetadata | undefined };
    }, [data]);

    const summary = summaryData?.data;

    const handleExport = () => {
        console.log('Exporting records...', allRecords);
    };

    const handleViewDetails = (record: RecordList) => {
        navigate(`/dashboard/records/${record.id}`);
    };

    return (
        <div className="p-6 space-y-6">
            <Outlet />

            {!isCreatePage && !isSingleRecordPage && (
                <>
                    {isLoading && <Spinner />}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
                                        <BreadcrumbPage>Service Records</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Service Records</h1>
                            <p className="text-muted-foreground">Complete history of all customer services and transactions</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <Button onClick={() => navigate("/dashboard/records/create")}>
                                Create Record
                            </Button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-card rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total Services</p>
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">
                                {summary
                                    ? (Number(summary.numberOfRecords || "0") - Number(summary.pending || "0")).toLocaleString()
                                    : "—"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                of{" "}
                                <span className="font-medium">
                                    {summary ? Number(summary.numberOfRecords || "0").toLocaleString() : "—"}
                                </span>{" "}
                                total records
                            </p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">
                                KES{" "}
                                {summary
                                    ? Number(summary.totalRevenue || "0").toLocaleString()
                                    : "0"}
                            </h3>
                            <p className="text-xs text-muted-foreground">Gross earnings</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total Discounts</p>
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">
                                KES{" "}
                                {summary
                                    ? Number(summary.totalDiscount || "0").toLocaleString()
                                    : "0"}
                            </h3>
                            <p className="text-xs text-muted-foreground">Applied to services</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <Scissors className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">
                                {summary
                                    ? Number(summary.pending || "0").toLocaleString()
                                    : "—"}
                            </h3>
                            <p className="text-xs text-muted-foreground">Awaiting completion</p>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex flex-col gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by phone, name, or record code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                />
                            </div>

                            {/* Filters */}
                            <RecordFilters
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                                staffFilter={staffFilter}
                                setStaffFilter={setStaffFilter}
                                paymentFilter={paymentFilter}
                                setPaymentFilter={setPaymentFilter}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                staff={staff.map(s => ({ id: s.id, fullName: s.fullName || "" }))}
                            />
                        </div>
                    </div>

                    {/* Records Table */}
                    <div className="space-y-4">
                        <div className="relative">
                            <DataTable
                                columns={buildRecordColumns(handleViewDetails)}
                                data={allRecords}
                            />
                            {isFetching && !isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                                    <Spinner />
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                            {/* Page size selector (bottom-left) */}
                            <div className="flex items-center gap-2">
                                <span>Rows per page</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        const newSize = Number(e.target.value) || 10;
                                        setPageSize(newSize);
                                        setPage(1);
                                    }}
                                    className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {[10, 20, 30, 40, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                {pagination && (
                                    <span className="ml-2">
                                        Page{" "}
                                        <span className="font-medium text-foreground">
                                            {pagination.currentPage}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium text-foreground">
                                            {pagination.totalPages}
                                        </span>
                                    </span>
                                )}
                            </div>

                            {/* Page navigation (bottom-right) */}
                            <div className="flex items-center gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={(pagination ? pagination.first : page === 1) || isLoading || isFetching}
                                    onClick={() => {
                                        if (pagination && !pagination.first) {
                                            setPage(1);
                                        } else {
                                            setPage(1);
                                        }
                                    }}
                                >
                                    First
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={(pagination ? pagination.first : page === 1) || isLoading || isFetching}
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        (pagination ? pagination.last : allRecords.length < pageSize) ||
                                        isLoading ||
                                        isFetching
                                    }
                                    onClick={() => {
                                        if (pagination && !pagination.last) {
                                            setPage((prev) => prev + 1);
                                        } else if (!pagination) {
                                            setPage((prev) => prev + 1);
                                        }
                                    }}
                                >
                                    Next
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        (pagination ? pagination.last : allRecords.length < pageSize) ||
                                        isLoading ||
                                        isFetching ||
                                        !pagination
                                    }
                                    onClick={() => {
                                        if (pagination && !pagination.last) {
                                            setPage(pagination.totalPages);
                                        }
                                    }}
                                >
                                    Last
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}