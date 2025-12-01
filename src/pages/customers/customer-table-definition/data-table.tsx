import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomerList } from "@/types/customer";

interface CustomerDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    onRowClick?: (customer: CustomerList) => void;
}

export function CustomerDataTable<TData extends CustomerList, TValue>({
    columns,
    data,
    isLoading,
    onRowClick,
}: CustomerDataTableProps<TData, TValue>) {
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        if (!search) return data;
        const term = search.toLowerCase();
        return data.filter((item) => {
            const customer = item as unknown as CustomerList;
            return (
                customer.customerCode.toLowerCase().includes(term) ||
                customer.phoneNumber.toLowerCase().includes(term)
            );
        });
    }, [data, search]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const pageCount = table.getPageCount();
    const currentPage = pageCount
        ? table.getState().pagination.pageIndex + 1
        : 0;

    return (
        <div className="w-full overflow-hidden p-4">
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <Input
                    placeholder="Search by customer code or phone..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full max-w-xs"
                />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="h-14">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-semibold">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Loading customers...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={`h-16 ${onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
                                    onClick={() =>
                                        onRowClick?.(row.original as unknown as CustomerList)
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col gap-3 border-t border-border bg-card/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                    {pageCount > 0
                        ? `Showing page ${currentPage} of ${pageCount} (${table.getRowModel().rows.length} row${table.getRowModel().rows.length !== 1 ? "s" : ""
                        } on this page)`
                        : "No results to display"}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        First
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        ← Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next →
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() =>
                            table.setPageIndex(Math.max(pageCount - 1, 0))
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        Last
                    </Button>
                </div>
            </div>
        </div>
    );
}


