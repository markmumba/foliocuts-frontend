import { Plus, Receipt, DollarSign, Award, Smartphone, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

const actions = [
  {
    label: 'New Service',
    description: 'Record customer service',
    icon: Plus,
    color: 'primary',
    route: '/dashboard/records/create'
  },
  {
    label: 'M-Pesa Payment',
    description: 'Process payment',
    icon: Smartphone,
    color: 'accent',
    route: '/dashboard/payments/mpesa'
  },
  {
    label: 'Check Loyalty',
    description: 'View customer rewards',
    icon: Award,
    color: 'secondary',
    route: '/dashboard/customers/loyalty'
  },
  {
    label: 'Staff Commission',
    description: 'View earnings',
    icon: DollarSign,
    color: 'accent',
    route: '/dashboard/staff/commissions'
  },
  {
    label: 'Daily Report',
    description: 'Generate summary',
    icon: Receipt,
    color: 'primary',
    route: '/dashboard/reports/daily'
  },
  {
    label: 'Add Customer',
    description: 'New customer entry',
    icon: Users,
    color: 'secondary',
    route: '/dashboard/customers/create'
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const bgColor =
            action.color === 'primary' ? 'bg-primary' :
            action.color === 'accent' ? 'bg-accent' :
            'bg-secondary';

          return (
            <button
              key={index}
              onClick={() => handleActionClick(action.route)}
              className="p-4 border border-border rounded-lg hover:border-accent hover:shadow-md transition-all text-left group"
            >
              <div className={`${bgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
