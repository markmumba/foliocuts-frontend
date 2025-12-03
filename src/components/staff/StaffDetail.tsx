import { ArrowLeft, Edit2, Trash2, Phone, Mail, Calendar, Scissors, TrendingUp, DollarSign } from 'lucide-react';
import type { User } from '@/types/user';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StaffDetailProps {
  staff: User;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// TODO: API NEEDED - GET /api/staff/:id/performance
// Should return detailed performance data for the staff member including:
// - Weekly performance chart data
// - Today/Week/Month statistics
// - Assigned services and commission rates
// - Recent activity/services

export function StaffDetail({ staff, onBack, onEdit, onDelete }: StaffDetailProps) {
  // TODO: Fetch from API
  const weeklyData = [
    { day: 'Mon', services: 8, revenue: 4000, commission: 1200 },
    { day: 'Tue', services: 10, revenue: 5000, commission: 1500 },
    { day: 'Wed', services: 7, revenue: 3500, commission: 1050 },
    { day: 'Thu', services: 11, revenue: 5500, commission: 1650 },
    { day: 'Fri', services: 12, revenue: 6000, commission: 1800 },
    { day: 'Sat', services: 15, revenue: 7500, commission: 2250 },
    { day: 'Sun', services: 9, revenue: 4500, commission: 1350 },
  ];

  // Mock stats - should come from API
  const stats = {
    today: {
      services: 12,
      revenue: 6000,
      commission: 1800,
    },
    week: {
      services: 68,
      revenue: 34000,
      commission: 10200,
    },
    month: {
      services: 285,
      revenue: 142500,
      commission: 42750,
    },
  };

  // Mock services - should come from API
  const assignedServices = ['Regular Haircut', 'Premium Haircut', 'Beard Trim', 'Beard Shaping'];
  const commissionRates = [
    { service: 'Regular Haircut', rate: 30 },
    { service: 'Premium Haircut', rate: 35 },
    { service: 'Beard Trim', rate: 30 },
    { service: 'Beard Shaping', rate: 30 },
  ];

  // Mock recent activity - should come from API
  const recentActivity = [
    { customer: '0722123456', service: 'Regular Haircut', amount: 300, time: '10:30 AM', commission: 90 },
    { customer: '0733987654', service: 'Beard Trim', amount: 200, time: '11:15 AM', commission: 60 },
    { customer: '0711234567', service: 'Premium Haircut', amount: 500, time: '12:00 PM', commission: 175 },
    { customer: '0798765432', service: 'Regular Haircut', amount: 300, time: '01:20 PM', commission: 90 },
    { customer: '0755123456', service: 'Beard Shaping', amount: 250, time: '02:45 PM', commission: 75 },
  ];

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
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value, name) => {
                if (name === 'services') return [value, 'Services'];
                if (name === 'commission') return [`KES ${value}`, 'Commission'];
                return [value, name];
              }}
            />
            <Bar dataKey="services" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="commission" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Services & Commission Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">Assigned Services</h3>
          <div className="space-y-2">
            {assignedServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-accent" />
                  <p className="text-sm font-semibold text-foreground">{service}</p>
                </div>
                <button className="text-xs text-destructive hover:underline">Remove</button>
              </div>
            ))}
            <button className="w-full p-3 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors">
              + Add Service
            </button>
          </div>
        </div>

        {/* Commission Rates */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">Commission Rates</h3>
          <div className="space-y-3">
            {commissionRates.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <p className="text-sm font-semibold text-foreground">{item.service}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-accent">{item.rate}%</span>
                  <button className="p-1 hover:bg-accent/10 rounded transition-colors">
                    <Edit2 className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Services</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent transition-colors">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">{activity.service}</p>
                <p className="text-xs text-muted-foreground">Customer: {activity.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">KES {activity.amount}</p>
                <p className="text-xs text-accent">+KES {activity.commission} commission</p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
