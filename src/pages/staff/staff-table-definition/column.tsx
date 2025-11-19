import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatRole } from "@/utils/utilities";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getStatusBadgeVariant = (status: string) => {
    switch (status?.toUpperCase()) {
        case "ACTIVE":
            return "default";
        case "INACTIVE":
            return "secondary";
        case "PENDING":
            return "outline";
        default:
            return "secondary";
    }
};

const getRoleBadgeVariant = (role: string) => {
    switch (role?.toUpperCase()) {
        case "OWNER":
        case "ADMIN":
            return "default";
        case "BARBER":
            return "secondary";
        case "RECEPTIONIST":
            return "outline";
        default:
            return "outline";
    }
};

export interface StaffColumnOptions {
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}

export const buildStaffColumns = ({ onEdit, onDelete }: StaffColumnOptions = {}): ColumnDef<User>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,

    },
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                </Button>
            )
        },
        accessorKey: "fullName",
        cell: ({ row }) => {
            return (
                <div className="font-medium">{row.getValue("fullName")}</div>
            );
        },
    },
    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
            return (
                <div className="text-muted-foreground">{row.getValue("email")}</div>
            );
        },
    },
    {
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string;
            return <div className="text-muted-foreground">{phone || "—"}</div>;
        },
    },
    {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            return (
                <Badge variant={getRoleBadgeVariant(role)}>
                    {formatRole(role)}
                </Badge>
            );
        },
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={getStatusBadgeVariant(status)}>
                    {status}
                </Badge>
            );
        },
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as string;
            return <div className="text-muted-foreground text-sm">{formatDate(date)}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(user)}>
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(event) => event.preventDefault()}
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete staff member?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will permanently remove {user.fullName} ({user.email}).
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={() => onDelete?.(user)}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];