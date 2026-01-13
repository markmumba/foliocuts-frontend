import { TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router';

// TODO: Replace with actual API data
// API NEEDED: GET /api/dashboard/staff-performance?limit=4
// Response should include array of staff members:
// - id: string
// - name: string
// - role: string
// - services: number (count of services performed)
// - revenue: number
// - commission: number
// - performance: number (percentage 0-100)
// - avatar: string (initials or image URL)

const mockStaffMembers = [
  {
    id: '1',
    name: 'John',
    role: 'Barber',
    services: 18,
    revenue: 'KES 8,400',
    commission: 'KES 2,520',
    performance: 95,
    avatar: 'JM'
  },
  {
    id: '2',
    name: 'Peter',
    role: 'Barber',
    services: 14,
    revenue: 'KES 6,200',
    commission: 'KES 1,860',
    performance: 88,
    avatar: 'PM'
  },
  {
    id: '3',
    name: 'Mary',
    role: 'Stylist',
    services: 11,
    revenue: 'KES 5,800',
    commission: 'KES 1,450',
    performance: 82,
    avatar: 'MK'
  },
  {
    id: '4',
    name: 'David',
    role: 'Barber',
    services: 9,
    revenue: 'KES 3,900',
    commission: 'KES 1,170',
    performance: 75,
    avatar: 'DW'
  },
];

export function StaffPerformance() {
  const navigate = useNavigate();

  // TODO: Fetch staff performance data from API
  // const { data: staffMembers, isLoading } = useQuery({
  //   queryKey: ['staff-performance'],
  //   queryFn: () => fetchStaffPerformance(4),
  // });

  const staffMembers = mockStaffMembers;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Staff Performance</h3>
        <button
          onClick={() => navigate('/dashboard/staff')}
          className="text-sm text-accent hover:underline"
        >
          View Details
        </button>
      </div>

      <div className="space-y-4">
        {staffMembers.map((staff, index) => (
          <div key={staff.id} className="p-4 border border-border rounded-lg hover:border-accent transition-colors">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-sm font-semibold">{staff.avatar}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground">{staff.name}</p>
                  {index === 0 && (
                    <Award className="w-4 h-4 text-secondary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{staff.role}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-foreground mb-1">{staff.commission}</p>
                <p className="text-xs text-muted-foreground">{staff.services} services</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Performance</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-accent" />
                  <span className="text-accent font-semibold">{staff.performance}%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent rounded-full h-2 transition-all"
                  style={{ width: `${staff.performance}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-xs font-semibold text-foreground">{staff.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
