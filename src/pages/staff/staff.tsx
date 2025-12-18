import { useUsers } from "@/hooks/userUser";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildStaffColumns } from "./staff-table-definition/column";
import { StaffDataTable } from "./staff-table-definition/data-table";
import { LayoutGrid, Table2, Search, Plus } from "lucide-react";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
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
import { StaffList } from "@/components/staff/StaffList";
import { StaffDetail } from "@/components/staff/StaffDetail";

export default function Staff() {
    const { data: staffList, isLoading, error } = useUsers();
    const navigate = useNavigate();
    const location = useLocation();
    const isCreatePage = location.pathname.includes('/create');
    const queryClient = useQueryClient();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const [deleteResult, setDeleteResult] = useState<DeleteStaffResponse | null>(null);
    const [isDeleteResultOpen, setDeleteResultOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');

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

    const handleEditStaff = () => {
        if (selectedStaff) {
            navigate(`/dashboard/staff/${selectedStaff.id}`);
        }
    };

    const handleDeleteStaff = async () => {
        if (selectedStaff) {
            await handleDeleteSingle(selectedStaff.id);
            setSelectedStaff(null);
        }
    };

    const filteredStaff = useMemo(() => {
        const staff = staffList?.data || [];
        return staff.filter(member => {
            const matchesSearch = member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.role?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterRole === 'all' ||
                member.role?.toLowerCase().includes(filterRole.toLowerCase());
            return matchesSearch && matchesFilter;
        });
    }, [staffList, searchQuery, filterRole]);

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
    return (
        <div className="p-6 space-y-6">
            {!isCreatePage && (
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Staff</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            )}
            <Outlet />
            {!isCreatePage && !selectedStaff && (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
                            <p className="text-muted-foreground">
                                Manage your barbershop staff members and their roles
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-border rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`p-2 rounded ${viewMode === 'cards'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                        } transition-colors`}
                                    title="Card View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded ${viewMode === 'table'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                        } transition-colors`}
                                    title="Table View"
                                >
                                    <Table2 className="w-4 h-4" />
                                </button>
                            </div>
                            <Button
                                variant="default"
                                size="lg"
                                className="gap-2"
                                onClick={() => navigate('/dashboard/staff/create')}
                            >
                                <Plus className="w-4 h-4" />
                                Add Staff
                            </Button>
                        </div>
                    </div>

                    {/* Search and Filter Bar for Card View */}
                    {viewMode === 'cards' && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search staff by name or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                                />
                            </div>

                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                            >
                                <option value="all">All Roles</option>
                                <option value="barber">Barbers</option>
                                <option value="receptionist">Receptionists</option>
                                <option value="service">Service Staff</option>
                            </select>
                        </div>
                    )}

                    {viewMode === 'cards' ? (
                        <StaffList
                            staff={filteredStaff}
                            onSelectStaff={setSelectedStaff}
                        />
                    ) : (
                        <div className="-mx-6 rounded-xl">
                            <div className="px-6 pt-6">
                                <h2 className="text-xl font-semibold mb-4">All Staff Members</h2>
                            </div>
                            <StaffDataTable
                                columns={staffColumns}
                                data={staff}
                                onDeleteSelected={handleDeleteSelected}
                                isDeleting={deleteStaffMutation.isPending}
                                onRowClick={(row) => setSelectedStaff(row as User)}
                            />
                        </div>
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
                </>
            )}

            {/* Staff Detail View */}
            {!isCreatePage && selectedStaff && (
                <StaffDetail
                    staff={selectedStaff}
                    onBack={() => setSelectedStaff(null)}
                    onEdit={handleEditStaff}
                    onDelete={handleDeleteStaff}
                />
            )}
        </div>
    );
}