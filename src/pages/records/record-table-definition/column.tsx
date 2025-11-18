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
            return <div className="text-muted-foreground">{row.getValue("totalAmount")}</div>;
        },
    },
    {
        header: 'Discount Amount',
        accessorKey: 'discountAmount',
        cell: ({ row }) => {
            return <div className="text-muted-foreground">{row.getValue("discountAmount")}</div>;
        },
    },
    {
        header: 'Final Amount',
        accessorKey: 'finalAmount',
    },

]   

