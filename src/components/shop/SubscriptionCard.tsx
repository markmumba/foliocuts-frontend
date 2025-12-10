import { CreditCard, CheckCircle, Calendar, Smartphone, TrendingUp } from 'lucide-react';
import type { Tenant } from '@/types/tenant';

interface SubscriptionCardProps {
  tenant: Tenant;
}

export function SubscriptionCard({ tenant }: SubscriptionCardProps) {
  const currentPlan = {
    name: tenant.subscriptionPlan || 'Basic Plan',
    price: tenant.subscriptionPlan === 'PRO' ? 4500 : tenant.subscriptionPlan === 'ENTERPRISE' ? 7500 : 2500,
    billing: 'monthly',
    status: tenant.status,
    nextBilling: '2025-01-05',
    staffLimit: tenant.subscriptionPlan === 'PRO' ? '6-15 staff' : tenant.subscriptionPlan === 'ENTERPRISE' ? '16+ staff' : '1-5 staff',
    features: [
      'Unlimited service recording',
      'Commission management',
      'Digital loyalty program',
      'M-Pesa integration',
      'SMS notifications',
      'Advanced analytics',
      'Staff performance tracking',
      'Customer database',
      'Daily/weekly/monthly reports',
      'Priority support',
    ],
  };

  const plans = [
    {
      name: 'Basic',
      price: 2500,
      staffLimit: '1-5 staff',
      popular: tenant.subscriptionPlan === 'BASIC',
    },
    {
      name: 'Pro',
      price: 4500,
      staffLimit: '6-15 staff',
      popular: tenant.subscriptionPlan === 'PRO',
    },
    {
      name: 'Enterprise',
      price: 7500,
      staffLimit: '16+ staff',
      popular: tenant.subscriptionPlan === 'ENTERPRISE',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="bg-gradient-to-br from-accent to-accent/80 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{currentPlan.name}</h2>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {currentPlan.status === 'ACTIVE' ? 'Active' : currentPlan.status}
              </span>
            </div>
            <p className="text-sm opacity-90">{currentPlan.staffLimit}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">Monthly</p>
            <h2 className="text-2xl font-bold text-white">KES {currentPlan.price.toLocaleString()}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              <p className="text-xs opacity-75">Next Billing</p>
            </div>
            <p className="text-sm">January 5, 2025</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4" />
              <p className="text-xs opacity-75">Transaction Fee</p>
            </div>
            <p className="text-sm">0.5% on M-Pesa</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs opacity-75">This Month</p>
            </div>
            <p className="text-sm">KES 0 fees</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-white text-accent rounded-lg hover:bg-white/90 font-medium">
            Update Payment Method
          </button>
          <button className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30">
            View Invoices
          </button>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Your Plan Includes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Change Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                plan.popular
                  ? 'border-accent shadow-lg scale-105'
                  : 'border-gray-200 hover:border-accent'
              }`}
            >
              {plan.popular && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-accent text-white rounded-full text-xs">
                    Current Plan
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.staffLimit}</p>

              <div className="mb-6">
                <p className="text-xs text-gray-500">Starting at</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-2xl font-bold text-primary">KES {plan.price.toLocaleString()}</h2>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
              </div>

              <button
                disabled={plan.popular}
                className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
                  plan.popular
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent/90'
                }`}
              >
                {plan.popular ? 'Current Plan' : 'Switch Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Recent Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Dec 5, 2024', amount: currentPlan.price, status: 'paid', invoice: 'INV-2024-12' },
            { date: 'Nov 5, 2024', amount: currentPlan.price, status: 'paid', invoice: 'INV-2024-11' },
            { date: 'Oct 5, 2024', amount: currentPlan.price, status: 'paid', invoice: 'INV-2024-10' },
          ].map((bill, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-primary font-medium">{bill.invoice}</p>
                  <p className="text-xs text-gray-500">{bill.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-primary font-medium">KES {bill.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-accent" />
                    <p className="text-xs text-accent">Paid</p>
                  </div>
                </div>
                <button className="text-sm text-accent hover:underline">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup & Support */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Additional Services</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1 font-medium">One-time Setup & Training</p>
              <p className="text-xs text-gray-500">Professional onboarding for your team</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary font-medium">KES 10,000</p>
              <button className="text-xs text-accent hover:underline">Request</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1 font-medium">Priority Support Upgrade</p>
              <p className="text-xs text-gray-500">24/7 dedicated support line</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary font-medium">+KES 1,500/mo</p>
              <button className="text-xs text-accent hover:underline">Add-on</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
