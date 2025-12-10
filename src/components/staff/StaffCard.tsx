import { ChevronRight } from 'lucide-react';
import type { User } from '@/types/user';
import { useEmployeePerformanceOverview } from '@/hooks/userUser';

interface StaffCardProps {
  member: User;
  onSelectStaff: (staff: User) => void;
  isActive?: boolean;
}

export function StaffCard({ member, onSelectStaff, isActive = true }: StaffCardProps) {
  const { data: performanceOverview } = useEmployeePerformanceOverview(member.id);
  console.log(performanceOverview);

  // Helper to get initials from name
  const getInitials = (fullName: string | null | undefined) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const initials = getInitials(member.fullName);
  const todaysPerformance = performanceOverview?.data?.todaysPerformance;

  if (!isActive) {
    // Inactive staff card (simplified, no performance data)
    return (
      <div
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
  }

  // Active staff card with performance data
  return (
    <div
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

      {/* Basic Info */}
      <div className="space-y-2">
        {member.email && (
          <p className="text-sm text-muted-foreground">{member.email}</p>
        )}
        {member.phoneNumber && (
          <p className="text-sm text-muted-foreground">{member.phoneNumber}</p>
        )}

        {/* Performance Data */}
        {todaysPerformance && (
          <div className="pt-3 mt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Today's Performance</p>
            <div className="grid grid-cols-3 gap-2">
              {todaysPerformance.services !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Services</p>
                  <p className="text-sm font-semibold text-foreground">{todaysPerformance.services}</p>
                </div>
              )}
              {todaysPerformance.revenue !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-semibold text-foreground">
                    {typeof todaysPerformance.revenue === 'number'
                      ? `${todaysPerformance.revenue.toLocaleString()}`
                      : todaysPerformance.revenue}
                  </p>
                </div>
              )}
              {todaysPerformance.commission !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="text-sm font-semibold text-foreground">
                    {typeof todaysPerformance.commission === 'number'
                      ? `${todaysPerformance.commission.toLocaleString()}`
                      : todaysPerformance.commission}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground pt-2">
          Click to view detailed performance
        </p>
      </div>
    </div>
  );
}
