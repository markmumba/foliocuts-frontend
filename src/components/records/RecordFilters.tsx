import { Calendar, User, CreditCard, CheckCircle } from 'lucide-react';

interface RecordFiltersProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  staffFilter: string;
  setStaffFilter: (value: string) => void;
  paymentFilter: string;
  setPaymentFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  staff?: Array<{ id: number; fullName: string }>;
}

export function RecordFilters({
  dateRange,
  setDateRange,
  staffFilter,
  setStaffFilter,
  paymentFilter,
  setPaymentFilter,
  statusFilter,
  setStatusFilter,
  staff = [],
}: RecordFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Date Range Filter */}
      <div className="relative">
        <label className="block text-sm text-muted-foreground mb-2">Date Range</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background text-foreground"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Staff Filter */}
      <div className="relative">
        <label className="block text-sm text-muted-foreground mb-2">Staff Member</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background text-foreground"
          >
            <option value="all">All Staff</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id.toString()}>
                {member.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payment Method Filter */}
      <div className="relative">
        <label className="block text-sm text-muted-foreground mb-2">Payment Method</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background text-foreground"
          >
            <option value="all">All Methods</option>
            <option value="MPESA">M-Pesa</option>
            <option value="CASH">Cash</option>
            <option value="LOYALTY">Loyalty Redemption</option>
          </select>
        </div>
      </div>

      {/* Status Filter */}
      <div className="relative">
        <label className="block text-sm text-muted-foreground mb-2">Status</label>
        <div className="relative">
          <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
}
