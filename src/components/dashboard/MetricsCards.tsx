import { TrendingUp, TrendingDown, Users, Wallet, Award, Smartphone } from 'lucide-react';

type MetricTrend = 'up' | 'down' | 'neutral';

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: MetricTrend;
  icon: typeof Users;
  color: 'accent' | 'secondary';
}

// TODO: Replace with actual API data
// API NEEDED: GET /api/dashboard/metrics
// Response should include:
// - todayRevenue: { value: number, change: number, trend: 'up' | 'down' }
// - customersServed: { value: number, change: number, trend: 'up' | 'down' }
// - mpesaPayments: { value: number (percentage), change: number, trend: 'up' | 'down' }
// - loyaltyRewards: { value: number, label: string }

const mockMetrics: Metric[] = [
  {
    label: "Today's Revenue",
    value: 'KES 45,000',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Wallet,
    color: 'accent'
  },
  {
    label: 'Customers Served',
    value: '38',
    change: '+8.3%',
    trend: 'up' as const,
    icon: Users,
    color: 'secondary'
  },
  {
    label: 'M-Pesa Payments',
    value: '85%',
    change: '+5.2%',
    trend: 'up' as const,
    icon: Smartphone,
    color: 'accent'
  },
  {
    label: 'Loyalty Rewards',
    value: '12',
    change: 'Today',
    trend: 'neutral' as const,
    icon: Award,
    color: 'secondary'
  },
];

export function MetricsCards() {
  // TODO: Fetch metrics data from API
  // const { data: metrics, isLoading } = useQuery({
  //   queryKey: ['dashboard-metrics'],
  //   queryFn: () => fetchDashboardMetrics(),
  // });

  const metrics = mockMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const bgColor = metric.color === 'accent' ? 'bg-accent' : 'bg-secondary';

        return (
          <div key={index} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                <h3 className="text-2xl font-bold text-foreground mb-2">{metric.value}</h3>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-accent" />}
                  {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
                  <span className={`text-xs ${metric.trend === 'up' ? 'text-accent' :
                      metric.trend === 'down' ? 'text-destructive' :
                        'text-muted-foreground'
                    }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`${bgColor} rounded-lg p-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
