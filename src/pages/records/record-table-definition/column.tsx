import type { RecordList } from "@/types/record";
import type { ColumnDef } from "@tanstack/react-table";



export const buildRecordColumns = (): ColumnDef<RecordList>[] => [
    {
        header: 'Record Code',
        accessorKey: 'recordCode',
    },
    {
        header: 'Customer Name',
        accessorKey: 'customerName',
    },
    {
        header: 'Customer Phone Number',
        accessorKey: 'customerPhoneNumber',
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
            return <div className="text-muted-foreground">{row.getValue("status")}</div>;
        },
    },
    {
        header: 'Total Amount',
        accessorKey: 'totalAmount',
        cell: ({ row }) => {
            const amount = row.getValue("totalAmount") as number;
            return <div className="text-muted-foreground">KES {amount?.toFixed(2) || '0.00'}</div>;
        },
    },
    {
        header: 'Discount Amount',
        accessorKey: 'discountAmount',
        cell: ({ row }) => {
            const amount = row.getValue("discountAmount") as number;
            return <div className="text-muted-foreground">KES {amount?.toFixed(2) || '0.00'}</div>;
        },
    },
    {
        header: 'Final Amount',
        accessorKey: 'finalAmount',
        cell: ({ row }) => {
            const amount = row.getValue("finalAmount") as number;
            return <div className="text-muted-foreground">KES {amount?.toFixed(2) || '0.00'}</div>;
        },
    },

]

