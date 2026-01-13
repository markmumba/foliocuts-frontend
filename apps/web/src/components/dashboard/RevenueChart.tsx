import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

// TODO: Replace with actual API data
// API NEEDED: GET /api/dashboard/revenue-chart?period=week
// Query params: period (week, month, year)
// Response should include array of:
// - day/date: string
// - revenue: number
// - transactions: number

const mockData = [
  { day: 'Mon', revenue: 38000, transactions: 32 },
  { day: 'Tue', revenue: 42000, transactions: 38 },
  { day: 'Wed', revenue: 35000, transactions: 29 },
  { day: 'Thu', revenue: 48000, transactions: 42 },
  { day: 'Fri', revenue: 52000, transactions: 45 },
  { day: 'Sat', revenue: 68000, transactions: 58 },
  { day: 'Sun', revenue: 45000, transactions: 38 },
];

export function RevenueChart() {
  // TODO: Fetch revenue chart data from API
  // const { data, isLoading } = useQuery({
  //   queryKey: ['revenue-chart', 'week'],
  //   queryFn: () => fetchRevenueChart('week'),
  // });

  const data = mockData;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Weekly performance tracking</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-semibold">+18.2% this week</span>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-accent/10 transition-colors">
            <Calendar className="w-4 h-4 text-foreground" />
            <span className="text-sm text-foreground">This Week</span>
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
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
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value, name) => {
              if (name === 'revenue') return [`KES ${value.toLocaleString()}`, 'Revenue'];
              return [value, 'Transactions'];
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--accent))"
            radius={[8, 8, 0, 0]}
            name="Revenue (KES)"
          />
          <Bar
            dataKey="transactions"
            fill="hsl(var(--secondary))"
            radius={[8, 8, 0, 0]}
            name="Transactions"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
