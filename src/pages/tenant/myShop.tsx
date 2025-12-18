import { useState } from "react";
import { Link } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { useTenant } from "@/hooks/useTenants";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Store,
    Scissors,
    CreditCard,
} from "lucide-react";
import { ShopProfile } from "@/components/shop/ShopProfile";
import { ServicesManagement } from "@/components/shop/ServicesManagement";
import { SubscriptionCard } from "@/components/shop/SubscriptionCard";

export default function MyShop() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const { data: myShop, isLoading, isError, error } = useTenant(user?.tenantId ?? "");

    const tenant = myShop?.data;

    const tabs = [
        { id: 'profile', label: 'Shop Profile', icon: Store },
        { id: 'services', label: 'Services & Pricing', icon: Scissors },
        { id: 'subscription', label: 'Subscription', icon: CreditCard },
    ];

    if (!user?.tenantId) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You don't have access to a shop. Please contact your administrator.</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error?.message ?? "Unable to load shop details"}</AlertDescription>
            </Alert>
        );
    }

    if (!tenant) {
        return <Spinner />;
    }

    return (
        <div className="p-8">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>My Shop</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">My Shop</h1>
                <p className="text-gray-500">Manage your barbershop settings and configurations</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'profile' && tenant && <ShopProfile tenant={tenant} />}
                {activeTab === 'services' && tenant && <ServicesManagement tenant={tenant} />}
                {activeTab === 'subscription' && tenant && <SubscriptionCard tenant={tenant} />}
            </div>
        </div>
    );
}