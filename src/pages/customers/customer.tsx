import { useState, useMemo } from "react";
import { useLocation, Outlet, useNavigate } from "react-router";
import { useCustomers } from "@/hooks/useCustomer";
import { CustomerDataTable } from "./customer-table-definition/data-table";
import { buildCustomerColumns } from "./customer-table-definition/column";
import type { CustomerList } from "@/types/customer";
import { Alert } from "@/components/ui/alert";
import { AlertDescription } from "@/components/ui/alert";

function Customer() {
    const [page] = useState(1);
    const [size] = useState(10);
    const [search] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const isSingleCustomerPage = /\/dashboard\/customers\/\d+$/.test(location.pathname);

    const { data, isLoading, error } = useCustomers(page, size, search);

    const customers: CustomerList[] = useMemo(
        () => data?.data?.items ?? [],
        [data]
    );

    const columns = useMemo(() => buildCustomerColumns(), []);

    return (
        <div className="p-6 space-y-6">
            <Outlet />

            {!isSingleCustomerPage && (
                <>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
                        <p className="text-sm text-muted-foreground">
                            View and manage your barbershop customers, their visits, and spend.
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Failed to load customers. Please try again.
                            </AlertDescription>
                        </Alert>
                    )}

                    <CustomerDataTable
                        columns={columns}
                        data={customers}
                        isLoading={isLoading}
                        onRowClick={(customer: CustomerList) =>
                            navigate(`/dashboard/customers/${customer.id}`)
                        }
                    />
                </>
            )}
        </div>
    )
}

export default Customer;