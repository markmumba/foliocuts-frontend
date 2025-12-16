import type { RecordList } from "@/types/record";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const buildRecordColumns = (
  onViewDetails?: (record: RecordList) => void
): ColumnDef<RecordList>[] => [
  {
    header: "Record Code",
    accessorKey: "recordCode",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-foreground">
          {row.getValue("recordCode")}
        </div>
      );
    },
  },
  {
    header: "Customer Name",
    accessorKey: "customerName",
    cell: ({ row }) => {
      return (
        <div className="text-foreground">
          {row.getValue("customerName")}
        </div>
      );
    },
  },
  {
    header: "Phone Number",
    accessorKey: "customerPhoneNumber",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.getValue("customerPhoneNumber")}
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string)?.toUpperCase();
      const statusColors = {
        COMPLETED: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        PENDING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
        CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      };
      return (
        <Badge
          variant="outline"
          className={
            statusColors[status as keyof typeof statusColors] ||
            "bg-muted text-muted-foreground"
          }
        >
          {status || "UNKNOWN"}
        </Badge>
      );
    },
  },
  {
    header: "Total Amount",
    accessorKey: "totalAmount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("totalAmount")) || 0;
      return (
        <div className="text-foreground font-medium">
          KES {amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    header: "Discount",
    accessorKey: "discountAmount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("discountAmount")) || 0;
      return (
        <div className="text-muted-foreground">
          {amount > 0 ? `KES ${amount.toLocaleString()}` : "-"}
        </div>
      );
    },
  },
  {
    header: "Final Amount",
    accessorKey: "finalAmount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("finalAmount")) || 0;
      return (
        <div className="text-foreground font-semibold">
          KES {amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(row.original);
          }}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      );
    },
  },
];

