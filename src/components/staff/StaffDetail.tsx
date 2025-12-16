import { ArrowLeft, Edit2, Trash2, Phone, Mail, Calendar, Scissors, TrendingUp, DollarSign } from 'lucide-react';
import type { User } from '@/types/user';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  useEmployeePerformanceOverview,
  useEmployeeWeeklyPerformance,
  useEmployeeServices,
  useRecentActivities
} from '@/hooks/userUser';

interface StaffDetailProps {
  staff: User;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function StaffDetail({ staff, onBack, onEdit, onDelete }: StaffDetailProps) {
  // Fetch performance data
  const { data: performanceOverview } = useEmployeePerformanceOverview(staff.id);
  const { data: weeklyPerformanceData } = useEmployeeWeeklyPerformance(staff.id);
  const { data: servicesData } = useEmployeeServices(staff.id);
  const { data: recentActivitiesData } = useRecentActivities(staff.id, 5);

  // Transform weekly data for chart
  const weeklyData = weeklyPerformanceData?.data?.data?.map(day => ({
    day: day.day,
    services: day.services,
    revenue: Number(day.revenue) || 0,
    commission: Number(day.commission) || 0,
  })) || [];

  // Stats from performance overview
  const stats = {
    today: {
      services: performanceOverview?.data?.todaysPerformance?.services || 0,
      revenue: Number(performanceOverview?.data?.todaysPerformance?.revenue) || 0,
      commission: Number(performanceOverview?.data?.todaysPerformance?.commission) || 0,
    },
    week: {
      services: performanceOverview?.data?.weeklyPerformance?.services || 0,
      revenue: Number(performanceOverview?.data?.weeklyPerformance?.revenue) || 0,
      commission: Number(performanceOverview?.data?.weeklyPerformance?.commission) || 0,
    },
    month: {
      services: performanceOverview?.data?.monthlyPerformance?.services || 0,
      revenue: Number(performanceOverview?.data?.monthlyPerformance?.revenue) || 0,
      commission: Number(performanceOverview?.data?.monthlyPerformance?.commission) || 0,
    },
  };

  // Services and commission rates from API
  const assignedServices = servicesData?.data?.assignedServices || [];
  const commissionRates = servicesData?.data?.commissionRates || [];

  // Recent activities from API
  const recentActivity = recentActivitiesData?.data?.map(activity => ({
    customer: activity.customerNumber,
    service: activity.serviceName,
    amount: Number(activity.amount) || 0,
    time: new Date(activity.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    commission: Number(activity.commission) || 0,
  })) || [];

  const getInitials = (fullName: string | null | undefined) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{staff.fullName || 'Unknown'}</h1>
            <p className="text-muted-foreground">{staff.role || 'Staff'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent/10 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-3xl font-bold">{getInitials(staff.fullName)}</span>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="font-semibold text-foreground">{staff.fullName || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Role</p>
              <p className="font-semibold text-foreground">{staff.role || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </p>
              <p className="font-semibold text-foreground">{staff.phoneNumber || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </p>
              <p className="font-semibold text-foreground">{staff.email || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                <Calendar className="w-4 h-4 inline mr-2" />
                Join Date
              </p>
              <p className="font-semibold text-foreground">
                {staff.createdAt ? new Date(staff.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${staff.status?.toUpperCase() === 'ACTIVE'
                ? 'bg-accent/10 text-accent'
                : 'bg-muted text-muted-foreground'
                }`}>
                {staff.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Today</h3>
            <Scissors className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Services</p>
              <p className="text-2xl font-bold text-foreground">{stats.today.services}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="font-semibold text-accent">KES {stats.today.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commission</p>
              <p className="font-semibold text-secondary">KES {stats.today.commission.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">This Week</h3>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Services</p>
              <p className="text-2xl font-bold text-foreground">{stats.week.services}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="font-semibold text-accent">KES {stats.week.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commission</p>
              <p className="font-semibold text-secondary">KES {stats.week.commission.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">This Month</h3>
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Services</p>
              <p className="text-2xl font-bold text-foreground">{stats.month.services}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="font-semibold text-accent">KES {stats.month.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commission</p>
              <p className="font-semibold text-secondary">KES {stats.month.commission.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Performance Chart */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-bold text-foreground mb-6">Weekly Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.25)' }} // soft grey highlight
              contentStyle={{
                backgroundColor: '#111827', // dark background similar to reference
                border: '1px solid #111827',
                borderRadius: '8px',
                color: '#e5e7eb', // light text
              }}
              labelStyle={{
                color: '#e5e7eb',
                fontWeight: 600,
                fontSize: 12,
              }}
              itemStyle={{
                color: '#facc15', // yellow text for values
                fontSize: 12,
              }}
              formatter={(value, name) => {
                if (name === 'services') return [value, 'Services'];
                if (name === 'commission') return [`KES ${value}`, 'Commission'];
                return [value, name];
              }}
            />
            {/* Green services bar, yellow commission bar for clear contrast */}
            <Bar
              dataKey="services"
              fill="#22c55e" // green
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="commission"
              fill="#facc15" // yellow
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Services & Commission Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">Assigned Services</h3>
          <div className="space-y-2">
            {assignedServices.length > 0 ? (
              assignedServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-accent" />
                    <p className="text-sm font-semibold text-foreground">{service}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No services assigned yet</p>
            )}
          </div>
        </div>

        {/* Commission Rates */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">Commission Rates</h3>
          <div className="space-y-3">
            {commissionRates.length > 0 ? (
              commissionRates.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <p className="text-sm font-semibold text-foreground">{item.service}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-accent">{Number(item.rate) || 0}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No commission rates configured</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Services</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-1">{activity.service}</p>
                  <p className="text-xs text-muted-foreground">Customer: {activity.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">KES {activity.amount.toLocaleString()}</p>
                  <p className="text-xs text-accent">+KES {activity.commission.toLocaleString()} commission</p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
