import { DollarSign, Users, TrendingUp, Save } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Tenant } from '@/types/tenant';

interface CommissionSettingsProps {
  tenant: Tenant;
}

export function CommissionSettings({ tenant }: CommissionSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Create commission rates from tenant services
  const [commissionRates, setCommissionRates] = useState(
    tenant.services?.map((service) => ({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      rate: 30, // Default rate - this should come from the backend
      category: service.serviceType,
      price: service.servicePrice,
    })) || []
  );

  const averageRate = useMemo(() => {
    if (commissionRates.length === 0) return 0;
    const total = commissionRates.reduce((sum, item) => sum + item.rate, 0);
    return (total / commissionRates.length).toFixed(1);
  }, [commissionRates]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Commission Structure</h2>
          <p className="text-sm text-gray-500">Set commission rates for each service</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            <DollarSign className="w-4 h-4" />
            Edit Rates
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rate</p>
              <h3 className="text-2xl font-bold text-primary">{averageRate}%</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <h3 className="text-2xl font-bold text-primary">KES 0</h3>
              <p className="text-xs text-gray-400">Total commissions paid</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Staff</p>
              <h3 className="text-2xl font-bold text-primary">{tenant.numberOfUsers}</h3>
              <p className="text-xs text-gray-400">Earning commissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Service Commission Rates</h3>

        {commissionRates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Service</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Commission Rate</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Example Earning</th>
                </tr>
              </thead>
              <tbody>
                {commissionRates.map((item, index) => {
                  const commission = (Number(item.price) * item.rate) / 100;

                  return (
                    <tr key={item.serviceId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="text-sm text-primary">{item.serviceName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => {
                                const newRates = [...commissionRates];
                                newRates[index].rate = parseInt(e.target.value) || 0;
                                setCommissionRates(newRates);
                              }}
                              className="w-20 px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm text-gray-600">%</span>
                          </div>
                        ) : (
                          <p className="text-sm text-accent">{item.rate}%</p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-sm text-gray-600">
                          KES {commission.toFixed(0)} / service
                        </p>
                        <p className="text-xs text-gray-400">from KES {item.price}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No services available for commission settings</p>
          </div>
        )}
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Payment Schedule</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1">Commission Payment Frequency</p>
              <p className="text-xs text-gray-500">How often staff receive their commissions</p>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1">Payment Day</p>
              <p className="text-xs text-gray-500">Day of the week for commission payments</p>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option>Friday</option>
              <option>Monday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1">Payment Method</p>
              <p className="text-xs text-gray-500">How commissions are paid to staff</p>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option>M-Pesa</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
