import { useState, useMemo, useEffect } from "react";
import { useRecords } from "@/hooks/useRecord";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "./record-table-definition/data-table";
import { buildRecordColumns } from "./record-table-definition/column";
import type { RecordList } from "@/types/record";
import { Outlet, useNavigate, useLocation, Link } from "react-router";

export default function Records() {
    const navigate = useNavigate();
    const location = useLocation();
    const isCreatePage = location.pathname.includes('/create');
    const isSingleRecordPage = /\/dashboard\/records\/\d+$/.test(location.pathname);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(handler);
    }, [search]);

    const { data, isLoading, error, isFetching } = useRecords(page, pageSize, debouncedSearch);
    const records = useMemo<RecordList[]>(() => {
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
    const columns = useMemo(() => buildRecordColumns(), []);

    const stats = useMemo(() => {
        const total = records.length;
        const completed = records.filter((record) => record.status?.toUpperCase() === "COMPLETED").length;
        const pending = records.filter((record) => record.status?.toUpperCase() === "PENDING").length;
        const totalRevenue = records.reduce((sum, record) => sum + (Number(record.finalAmount) || 0), 0);
        const totalDiscount = records.reduce((sum, record) => sum + (Number(record.discountAmount) || 0), 0);
        return { total, completed, pending, totalRevenue, totalDiscount };
    }, [records]);

    const handlePreviousPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        if (records.length < pageSize) return;
        setPage((prev) => prev + 1);
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
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/dashboard">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Records</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Records</h1>
                            <p className="text-muted-foreground">
                                Monitor customer visits, payments, and record details.
                            </p>
                        </div>
                        <Button
                            className="gap-2"
                            onClick={() => navigate("/dashboard/records/create")}
                        >
                            Create Record
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Records (page)" value={stats.total.toString()} />
                        <StatCard label="Completed" value={stats.completed.toString()} />
                        <StatCard label="Pending" value={stats.pending.toString()} />
                        <StatCard label="Revenue (page)" value={`KES ${stats.totalRevenue.toFixed(2)}`} subtext={`Discounts: KES ${stats.totalDiscount.toFixed(2)}`} />
                    </div>

                    <div className="rounded-xl ">
                        <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <Input
                                value={search}
                                onChange={(event) => {
                                    setPage(1);
                                    setSearch(event.target.value);
                                }}
                                placeholder="Search by record code, customer name, or phone..."
                                className="w-full max-w-md"
                            />
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                                <span>
                                    Page {page}
                                    {isFetching && " (refreshing...)"}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1}>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={records.length < pageSize}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <DataTable<RecordList, unknown>
                                columns={columns}
                                data={records}
                                onRowClick={(record: RecordList) =>
                                    navigate(`/dashboard/records/${record.id}`)
                                }
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string;
    subtext?: string;
}

function StatCard({ label, value, subtext }: StatCardProps) {
    return (
        <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-card-foreground mt-2">{value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
    );
}