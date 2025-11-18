import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    getFilteredRowModel,
    getSortedRowModel,
    type RowSelectionState,
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDeleteSelected?: (rows: TData[]) => Promise<void> | void;
    isDeleting?: boolean;
}

export function StaffDataTable<TData, TValue>({ columns, data, onDeleteSelected, isDeleting }: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [rowsPendingDelete, setRowsPendingDelete] = useState<TData[]>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    const pageCount = table.getPageCount();
    const currentPage = pageCount ? table.getState().pagination.pageIndex + 1 : 0;
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedRowCount = selectedRows.length;
    const selectedRowData = useMemo(
        () => selectedRows.map((row) => row.original as TData),
        [selectedRows]
    );
    const totalFilteredRows = table.getFilteredRowModel().rows.length;

    const handleBulkDelete = async (rows: TData[]) => {
        if (!onDeleteSelected || !rows.length) {
            return;
        }
        try {
            await onDeleteSelected(rows);
            table.resetRowSelection();
        } catch (error) {
            console.error("Failed to delete selected rows", error);
        }
    };

    const openConfirm = () => {
        setRowsPendingDelete(selectedRowData);
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setRowsPendingDelete([]);
    };


    return (
        <div className="w-full overflow-hidden p-4">
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <Input
                    placeholder="Filter by emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                    className="w-full max-w-xs"
                />
                {selectedRowCount > 0 && (
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3 sm:text-right">
                        <span>
                            {selectedRowCount} of {totalFilteredRows} row
                            {totalFilteredRows === 1 ? "" : "s"} selected
                        </span>
                        {onDeleteSelected && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={openConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : `Delete ${selectedRowCount}`}
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <Table className="min-w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
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
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <p className="text-muted-foreground">No staff members found.</p>
                                    <p className="text-sm text-muted-foreground">
                                        Add your first staff member to get started.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex flex-col gap-3 border-t border-border bg-card/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                    {pageCount > 0
                        ? `Showing page ${currentPage} of ${pageCount} (${table.getRowModel().rows.length} row${table.getRowModel().rows.length !== 1 ? "s" : ""} on this page)`
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
                        onClick={() => table.setPageIndex(Math.max(pageCount - 1, 0))}
                        disabled={!table.getCanNextPage()}
                    >
                        Last 
                    </Button>
                </div>
            </div>
            {onDeleteSelected && (
                <AlertDialog open={confirmOpen} onOpenChange={(open) => (open ? setConfirmOpen(true) : closeConfirm())}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete selected staff?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will permanently remove {rowsPendingDelete.length} staff record
                                {rowsPendingDelete.length === 1 ? "" : "s"}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={async () => {
                                    await handleBulkDelete(rowsPendingDelete);
                                    closeConfirm();
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}