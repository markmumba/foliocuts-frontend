import type { RecordList } from "@digital-barbershop/shared-types";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { PaymentMethod, PaymentStatus } from "@digital-barbershop/shared-types";

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
      header: "Services",
      accessorKey: "servicesAndStaff",
      cell: ({ row }) => {
        const list = (row.original.servicesAndStaff ?? []) as { serviceName: string; staffName: string }[];
        if (!list.length) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 text-[11px] font-medium text-yellow-800 hover:bg-yellow-200/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span>Services</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="min-w-[360px] max-w-lg bg-card text-foreground border border-border shadow-xl py-4 px-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Services & Staff
                  </p>
                  <p className="text-[11px] text-muted-foreground/80">
                    {list.length} item{list.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="space-y-2.5">
                {list.map((item, index) => (
                  <div
                    key={`${item.serviceName}-${item.staffName}-${index}`}
                    className="flex items-start gap-3 rounded-lg bg-muted/60 px-3 py-2"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.serviceName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.staffName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
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
      header: "Payment Method",
      accessorKey: "paymentMethod",
      cell: ({ row }) => {
        const paymentMethod = row.getValue("paymentMethod") as PaymentMethod;
        const paymentMethodColors = {
          CASH: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
          MPESA: "bg-brown-500/10 text-brown-700 dark:text-brown-400 border-brown-500/20",
        };
        return (
          <Badge
            variant="outline"
            className={paymentMethodColors[paymentMethod as keyof typeof paymentMethodColors] || "bg-muted text-muted-foreground"}
          >
            {paymentMethod.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: "Payment Status",
      accessorKey: "paymentStatus",
      cell: ({ row }) => {
        const paymentStatus = row.getValue("paymentStatus") as PaymentStatus;
        const paymentStatusColors = {
          PENDING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
          SUCCESS: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
          FAILED: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        };
        return (
          <Badge
            variant="secondary"
            className={paymentStatusColors[paymentStatus as keyof typeof paymentStatusColors] || "bg-muted text-muted-foreground"}
          >
            {paymentStatus.toUpperCase()}
          </Badge>
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

