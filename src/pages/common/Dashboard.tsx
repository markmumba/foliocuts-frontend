import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { StaffPerformance } from '@/components/dashboard/StaffPerformance';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />

            <div className="p-8 space-y-8">
                <MetricsCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RevenueChart />
                    </div>
                    <div>
                        <QuickActions />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentTransactions />
                    <StaffPerformance />
                </div>
            </div>
        </div>
    )
}