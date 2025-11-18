import { useUsers } from "@/hooks/userUser";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { buildStaffColumns } from "./staff-table-definition/column";
import { StaffDataTable } from "./staff-table-definition/data-table";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { useNotification } from "@/context/NotificationContext";
import { AxiosError } from "axios";
import type { DeleteStaffResponse, User } from "@/types/user";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function Staff() {
    const { data: staffList, isLoading, error } = useUsers();
    const navigate = useNavigate();
    const location = useLocation();
    const isCreatePage = location.pathname.includes('/create');
    const queryClient = useQueryClient();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const [deleteResult, setDeleteResult] = useState<DeleteStaffResponse | null>(null);
    const [isDeleteResultOpen, setDeleteResultOpen] = useState(false);

    const deleteStaffMutation = useMutation({
        mutationFn: (staffIds: number[]) => userService.deleteMultipleStaff(staffIds),
        onSuccess: (response) => {
            const payload = response.data ?? response;
            setDeleteResult(payload);
            setDeleteResultOpen(true);
            notifySuccess(response.message || "Selected staff deleted");
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: unknown) => {
            console.error("Delete staff failed:", error);
            let errorMessage = "Failed to delete staff members";

            if (error instanceof AxiosError) {
                const apiError = error.response?.data as { message?: string } | undefined;
                errorMessage = apiError?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            notifyError(errorMessage, "Delete failed");
        },
    });
    const deleteSingleStaffMutation = useMutation({
        mutationFn: (staffId: number) => userService.deleteStaff(staffId),
        onSuccess: (response) => {
            notifySuccess(response.message || "Staff deleted");
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: unknown) => {
            console.error("Delete staff failed:", error);
            const errorMessage = "Failed to delete staff members";
            notifyError(errorMessage, "Delete failed");
        },
    });
    const handleDeleteSelected = useCallback(async (selectedRows: User[]) => {
        if (!selectedRows.length) {
            return;
        }
        await deleteStaffMutation.mutateAsync(selectedRows.map((row) => row.id));
    }, [deleteStaffMutation]);

    const handleDeleteSingle = useCallback(async (staffId: number) => {
        await deleteSingleStaffMutation.mutateAsync(staffId);
    }, [deleteSingleStaffMutation]);

    const handleEdit = useCallback((user: User) => {
        navigate(`/dashboard/staff/${user.id}`);
    }, [navigate]);

    const closeDeleteResult = () => {
        setDeleteResultOpen(false);
        setDeleteResult(null);
    };

    const staffColumns = useMemo(
        () =>
            buildStaffColumns({
                onEdit: handleEdit,
                onDelete: (user) => handleDeleteSingle(user.id),
            }),
        [handleDeleteSingle, handleEdit]
    );

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    const staff = staffList?.data || [];
    const totalStaff = staff.length;
    const activeStaff = staff.filter((s) => s.status?.toUpperCase() === "ACTIVE").length;
    const inactiveStaff = staff.filter((s) => s.status?.toUpperCase() === "INACTIVE").length;
    const pendingStaff = staff.filter((s) => s.status?.toUpperCase() === "PENDING").length;
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
                    <p className="text-muted-foreground">
                        Manage your barbershop staff members and their roles
                    </p>
                </div>
                <Button
                    variant="default"
                    size="lg"
                    className="gap-2"
                    onClick={() => navigate('/dashboard/staff/create')}
                >
                    <UserPlus className="w-4 h-4" />
                    Add Staff Member
                </Button>
            </div>
            <Outlet />

            {!isCreatePage && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Total Staff
                                    </p>
                                    <p className="text-3xl font-bold text-card-foreground">
                                        {totalStaff}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Active Staff
                                    </p>
                                    <p className="text-3xl font-bold text-card-foreground">
                                        {activeStaff}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Inactive Staff
                                    </p>
                                    <p className="text-3xl font-bold text-card-foreground">
                                        {inactiveStaff}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-gray-500/10 flex items-center justify-center">
                                    <UserX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Pending
                                    </p>
                                    <p className="text-3xl font-bold text-card-foreground">
                                        {pendingStaff}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                    <UserX className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="-mx-6 rounded-xl">
                        <div className="px-6 pt-6">
                            <h2 className="text-xl font-semibold mb-4">All Staff Members</h2>
                        </div>
                        <StaffDataTable
                            columns={staffColumns}
                            data={staff}
                            onDeleteSelected={handleDeleteSelected}

                            isDeleting={deleteStaffMutation.isPending}
                        />
                    </div>
                </>
            )}
            <AlertDialog open={isDeleteResultOpen && !!deleteResult} onOpenChange={(open) => (open ? setDeleteResultOpen(true) : closeDeleteResult())}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete summary</AlertDialogTitle>
                        <AlertDialogDescription>
                            Results from the delete request.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {deleteResult && (
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-4 bg-muted/40 p-3 rounded-md">
                                <div>
                                    <p className="text-muted-foreground">Requested</p>
                                    <p className="text-lg font-semibold">{deleteResult.totalRequested}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Deleted</p>
                                    <p className="text-lg font-semibold">{deleteResult.deleted}</p>
                                </div>
                            </div>
                            {deleteResult.restrictedIds?.length ? (
                                <p className="text-muted-foreground">
                                    Restricted: {deleteResult.restrictedIds.join(", ")}
                                </p>
                            ) : null}
                            {deleteResult.notFoundIds?.length ? (
                                <p className="text-muted-foreground">
                                    Not found: {deleteResult.notFoundIds.join(", ")}
                                </p>
                            ) : null}
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hidden" />
                        <AlertDialogAction onClick={closeDeleteResult}>Done</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}