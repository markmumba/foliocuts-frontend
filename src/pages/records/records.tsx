import { useState, useMemo, useEffect } from "react";
import { useRecords } from "@/hooks/useRecord";
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
import type { RecordList } from "@/types/record";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { Search, Download, TrendingUp, DollarSign, Calendar, Scissors } from "lucide-react";
import { RecordFilters } from "@/components/records/RecordFilters";
import { DataTable } from "./record-table-definition/data-table";
import { buildRecordColumns } from "./record-table-definition/column";

export default function Records() {
    const navigate = useNavigate();
    const location = useLocation();
    const isCreatePage = location.pathname.includes('/create');
    const isSingleRecordPage = /\/dashboard\/records\/\d+$/.test(location.pathname);
    const [page] = useState(1);
    const pageSize = 50;
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Filter states
    const [dateRange, setDateRange] = useState('all');
    const [staffFilter, setStaffFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const { data, isLoading, error } = useRecords(page, pageSize, debouncedSearch);
    const { data: staffData } = useUsers();

    const allRecords = useMemo<RecordList[]>(() => {
        const payload = data?.data;
        if (Array.isArray(payload)) {
            return payload;
        }
        if (payload && Array.isArray((payload as { items?: RecordList[] }).items)) {
            return (payload as { items: RecordList[] }).items;
        }
        if (payload && Array.isArray((payload as { content?: RecordList[] }).content)) {
            return (payload as { content: RecordList[] }).content;
        }
        return [];
    }, [data]);

    const staff = useMemo(() => {
        const payload = staffData?.data;
        if (Array.isArray(payload)) {
            return payload;
        }
        return [];
    }, [staffData]);

    // Apply client-side filters
    const filteredRecords = useMemo(() => {
        return allRecords.filter(record => {
            const matchesStatus = statusFilter === 'all' || record.status?.toUpperCase() === statusFilter;
            // Note: We don't have staff or payment info in RecordList, so those filters won't work
            // unless we add that data to the backend response
            return matchesStatus;
        });
    }, [allRecords, statusFilter]);

    const stats = useMemo(() => {
        const total = filteredRecords.length;
        const completed = filteredRecords.filter((record) => record.status?.toUpperCase() === "COMPLETED").length;
        const pending = filteredRecords.filter((record) => record.status?.toUpperCase() === "PENDING").length;
        const totalRevenue = filteredRecords
            .filter(r => r.status?.toUpperCase() === "COMPLETED")
            .reduce((sum, record) => sum + (Number(record.finalAmount) || 0), 0);
        const totalDiscount = filteredRecords.reduce((sum, record) => sum + (Number(record.discountAmount) || 0), 0);
        return { total, completed, pending, totalRevenue, totalDiscount };
    }, [filteredRecords]);

    const handleExport = () => {
        console.log('Exporting records...', filteredRecords);
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
                            <h3 className="text-3xl font-bold text-foreground mb-1">{stats.completed}</h3>
                            <p className="text-xs text-muted-foreground">of {stats.total} total records</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">KES {stats.totalRevenue.toLocaleString()}</h3>
                            <p className="text-xs text-muted-foreground">Gross earnings</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total Discounts</p>
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">KES {stats.totalDiscount.toLocaleString()}</h3>
                            <p className="text-xs text-muted-foreground">Applied to services</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <Scissors className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1">{stats.pending}</h3>
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
                    <DataTable
                        columns={buildRecordColumns(handleViewDetails)}
                        data={filteredRecords}
                    />
                </>
            )}
        </div>
    );
}