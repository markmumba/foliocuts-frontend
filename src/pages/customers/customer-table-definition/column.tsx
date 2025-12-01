import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerList } from "@/types/customer";
import { User } from "lucide-react";

const formatCurrency = (amount: string) => {
    const parsed = Number(amount ?? 0);
    if (Number.isNaN(parsed)) return "KES 0.00";
    return `KES ${parsed.toFixed(2)}`;
};

const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const buildCustomerColumns = (): ColumnDef<CustomerList>[] => [
    {
        header: "Customer",
        accessorKey: "customerCode",
        cell: ({ row }) => {
            const code = row.getValue("customerCode") as string;
            const phone = row.getValue("phoneNumber") as string;
            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{code}</span>
                        <span className="text-xs text-muted-foreground">{phone}</span>
                    </div>
                </div>
            );
        },
    },
    {
        header: "Phone Number",
        accessorKey: "phoneNumber",
        cell: ({ row }) => {
            return (
                <div className="text-muted-foreground">
                    {row.getValue("phoneNumber") as string}
                </div>
            );
        },
    },
    {
        header: "Total Visits",
        accessorKey: "totalVisits",
        cell: ({ row }) => {
            const visits = row.getValue("totalVisits") as string;
            return <div className="text-muted-foreground">{visits ?? "0"}</div>;
        },
    },
    {
        header: "Total Spent",
        accessorKey: "totalSpent",
        cell: ({ row }) => {
            const amount = row.getValue("totalSpent") as string;
            return (
                <div className="text-muted-foreground">{formatCurrency(amount)}</div>
            );
        },
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as string;
            return (
                <div className="text-muted-foreground text-sm">
                    {formatDate(date)}
                </div>
            );
        },
    },
];


