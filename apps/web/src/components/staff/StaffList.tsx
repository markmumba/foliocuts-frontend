import { TrendingUp, DollarSign, Scissors } from 'lucide-react';
import type { User } from '@digital-barbershop/shared-types';
import { useEmployeesPerformanceSummary } from '@/hooks/userUser';
import { StaffCard } from './StaffCard';

interface StaffListProps {
  staff: User[];
  onSelectStaff: (staff: User) => void;
}

export function StaffList({ staff, onSelectStaff }: StaffListProps) {
  const activeStaff = staff.filter(s => s.status?.toUpperCase() === 'ACTIVE');
  const inactiveStaff = staff.filter(s => s.status?.toUpperCase() === 'INACTIVE');

  // Fetch performance summary
  const { data: performanceSummary } = useEmployeesPerformanceSummary();
  

  const todayTotals = {
    services: performanceSummary?.data?.todayTotals?.services || 0,
    revenue: Number(performanceSummary?.data?.todayTotals?.revenue) || 0,
    commission: Number(performanceSummary?.data?.todayTotals?.commission) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Scissors className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <h3 className="text-2xl font-bold text-foreground">{staff.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Services Today</p>
              <h3 className="text-2xl font-bold text-foreground">{todayTotals.services}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today Revenue</p>
              <h3 className="text-2xl font-bold text-foreground">KES {todayTotals.revenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today Commissions</p>
              <h3 className="text-2xl font-bold text-foreground">KES {todayTotals.commission.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Active Staff */}
      {activeStaff.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Active Staff ({activeStaff.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onSelectStaff={onSelectStaff}
                isActive={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Staff */}
      {inactiveStaff.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Inactive Staff ({inactiveStaff.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onSelectStaff={onSelectStaff}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {staff.length === 0 && (
        <div className="bg-card rounded-xl p-12 border border-border text-center">
          <p className="text-muted-foreground">No staff members found</p>
        </div>
      )}
    </div>
  );
}
