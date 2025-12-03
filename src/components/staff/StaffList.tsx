import { TrendingUp, DollarSign, Scissors, ChevronRight } from 'lucide-react';
import type { User } from '@/types/user';

interface StaffListProps {
  staff: User[];
  onSelectStaff: (staff: User) => void;
}

// TODO: API NEEDED - GET /api/staff/performance-summary
// This should return aggregated stats for today's services, revenue, and commissions
// For now, we'll use mock data

export function StaffList({ staff, onSelectStaff }: StaffListProps) {
  const activeStaff = staff.filter(s => s.status?.toUpperCase() === 'ACTIVE');
  const inactiveStaff = staff.filter(s => s.status?.toUpperCase() === 'INACTIVE');

  // TODO: Replace with actual API data
  const todayTotals = {
    services: 42,
    revenue: 20800,
    commission: 6240,
  };

  // Helper to get initials from name
  const getInitials = (fullName: string | null | undefined) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  // TODO: Replace with actual API call to get staff performance
  const getStaffPerformance = (_userId: number) => {
    // Mock data - this should come from API
    return {
      todayServices: Math.floor(Math.random() * 15),
      todayRevenue: Math.floor(Math.random() * 8000),
      todayCommission: Math.floor(Math.random() * 2400),
      performance: Math.floor(Math.random() * 30) + 70,
      services: ['Haircut', 'Beard Trim', 'Hair Coloring'].slice(0, Math.floor(Math.random() * 3) + 1),
    };
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
            {activeStaff.map((member) => {
              const performance = getStaffPerformance(member.id);
              const initials = getInitials(member.fullName);

              return (
                <div
                  key={member.id}
                  onClick={() => onSelectStaff(member)}
                  className="bg-card rounded-xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold">{initials}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                          {member.fullName || 'Unknown'}
                        </h4>
                        <p className="text-sm text-muted-foreground">{member.role || 'Staff'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Today</p>
                      <p className="text-sm font-semibold text-foreground">{performance.todayServices} services</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-sm font-semibold text-foreground">KES {performance.todayRevenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Commission</p>
                      <p className="text-sm font-semibold text-accent">KES {performance.todayCommission.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="text-accent font-semibold">{performance.performance}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent rounded-full h-2 transition-all"
                        style={{ width: `${performance.performance}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {performance.services.slice(0, 3).map((service, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full text-foreground">
                          {service}
                        </span>
                      ))}
                      {performance.services.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-muted rounded-full text-foreground">
                          +{performance.services.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inactive Staff */}
      {inactiveStaff.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Inactive Staff ({inactiveStaff.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveStaff.map((member) => {
              const initials = getInitials(member.fullName);

              return (
                <div
                  key={member.id}
                  onClick={() => onSelectStaff(member)}
                  className="bg-card rounded-xl p-6 border border-border opacity-60 hover:opacity-100 hover:border-muted-foreground transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-muted-foreground font-semibold">{initials}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{member.fullName || 'Unknown'}</h4>
                      <p className="text-sm text-muted-foreground">{member.role || 'Staff'}</p>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        Inactive
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
