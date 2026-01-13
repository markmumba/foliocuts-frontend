import { Smartphone, Banknote, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

// TODO: Replace with actual API data
// API NEEDED: GET /api/dashboard/recent-transactions?limit=5
// Response should include array of transactions:
// - id: string
// - customer: string (phone number)
// - service: string
// - staff: string (staff name)
// - amount: number
// - method: 'M-Pesa' | 'Cash' | 'Loyalty'
// - status: 'completed' | 'pending'
// - time: string (formatted time)

const mockTransactions = [
  {
    id: 'C001',
    customer: '0722123456',
    service: 'Haircut + Beard',
    staff: 'John',
    amount: 'KES 500',
    method: 'M-Pesa' as const,
    status: 'completed' as const,
    time: '10:30 AM'
  },
  {
    id: 'C045',
    customer: '0733987654',
    service: 'Haircut',
    staff: 'Peter',
    amount: 'KES 300',
    method: 'Cash' as const,
    status: 'completed' as const,
    time: '11:15 AM'
  },
  {
    id: 'C012',
    customer: '0711234567',
    service: 'Manicure + Pedicure',
    staff: 'Mary',
    amount: 'KES 800',
    method: 'M-Pesa' as const,
    status: 'pending' as const,
    time: '12:00 PM'
  },
  {
    id: 'C078',
    customer: '0798765432',
    service: 'Haircut (FREE)',
    staff: 'John',
    amount: 'KES 0',
    method: 'Loyalty' as const,
    status: 'completed' as const,
    time: '01:20 PM'
  },
  {
    id: 'C089',
    customer: '0755123456',
    service: 'Hair Dye',
    staff: 'Peter',
    amount: 'KES 1,200',
    method: 'M-Pesa' as const,
    status: 'completed' as const,
    time: '02:45 PM'
  },
];

export function RecentTransactions() {
  const navigate = useNavigate();

  // TODO: Fetch recent transactions from API
  // const { data: transactions, isLoading } = useQuery({
  //   queryKey: ['recent-transactions'],
  //   queryFn: () => fetchRecentTransactions(5),
  // });

  const transactions = mockTransactions;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
        <button
          onClick={() => navigate('/dashboard/records')}
          className="text-sm text-accent hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 border border-border rounded-lg hover:border-accent transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground">{transaction.customer}</p>
                  <span className="text-xs text-muted-foreground">#{transaction.id}</span>
                </div>
                <p className="text-xs text-muted-foreground">{transaction.service}</p>
                <p className="text-xs text-muted-foreground">Staff: {transaction.staff}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-foreground mb-1">{transaction.amount}</p>
                <div className="flex items-center gap-1 justify-end">
                  {transaction.method === 'M-Pesa' && <Smartphone className="w-3 h-3 text-accent" />}
                  {transaction.method === 'Cash' && <Banknote className="w-3 h-3 text-secondary" />}
                  {transaction.method === 'Loyalty' && <CheckCircle className="w-3 h-3 text-accent" />}
                  <span className="text-xs text-muted-foreground">{transaction.method}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                {transaction.status === 'completed' ? (
                  <CheckCircle className="w-3 h-3 text-accent" />
                ) : (
                  <Clock className="w-3 h-3 text-secondary" />
                )}
                <span className={`text-xs ${
                  transaction.status === 'completed' ? 'text-accent' : 'text-secondary'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{transaction.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
