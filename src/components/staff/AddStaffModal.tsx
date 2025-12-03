import { X, User, Phone, Mail, Briefcase, Scissors } from 'lucide-react';
import { useState } from 'react';

interface AddStaffModalProps {
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
}

export interface StaffFormData {
  name: string;
  role: string;
  phone: string;
  email: string;
  joinDate: string;
  status: string;
  services: string[];
  commissionRates: { service: string; rate: number }[];
}

export function AddStaffModal({ onClose, onSubmit }: AddStaffModalProps) {
  const [formData, setFormData] = useState<StaffFormData>({
    name: '',
    role: 'BARBER',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    services: [],
    commissionRates: [],
  });

  const availableServices = [
    'Regular Haircut',
    'Premium Haircut',
    'Beard Trim',
    'Beard Shaping',
    'Manicure',
    'Pedicure',
    'Hair Coloring',
    'Massage',
  ];

  const toggleService = (service: string) => {
    if (formData.services.includes(service)) {
      setFormData({
        ...formData,
        services: formData.services.filter(s => s !== service),
        commissionRates: formData.commissionRates.filter(r => r.service !== service),
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, service],
        commissionRates: [...formData.commissionRates, { service, rate: 30 }],
      });
    }
  };

  const updateCommissionRate = (service: string, rate: number) => {
    setFormData({
      ...formData,
      commissionRates: formData.commissionRates.map(r =>
        r.service === service ? { ...r, rate } : r
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">Add New Staff Member</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Mwangi"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                >
                  <option value="BARBER">Barber</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="SERVICE_GIRL">Service Girl</option>
                  <option value="OWNER">Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 722 123 456"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Join Date</label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Assignment */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              <Scissors className="w-5 h-5 inline mr-2" />
              Assign Services
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select which services this staff member can provide
            </p>
            <div className="grid grid-cols-2 gap-3">
              {availableServices.map((service) => (
                <label
                  key={service}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.services.includes(service)
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => toggleService(service)}
                    className="w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                  <span className="text-sm font-semibold text-foreground">{service}</span>
                </label>
              ))}
            </div>
            {formData.services.length > 0 && (
              <p className="text-sm text-accent mt-3 font-semibold">
                {formData.services.length} service{formData.services.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Commission Rates */}
          {formData.services.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Commission Rates</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set commission percentage for each service
              </p>
              <div className="space-y-3">
                {formData.services.map((service) => {
                  const rateObj = formData.commissionRates.find(r => r.service === service);
                  return (
                    <div key={service} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <p className="text-sm font-semibold text-foreground">{service}</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={rateObj?.rate || 30}
                          onChange={(e) => updateCommissionRate(service, parseInt(e.target.value))}
                          min="0"
                          max="100"
                          className="w-20 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Login Credentials */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-foreground mb-2">Login Credentials</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Staff member will receive login credentials via SMS to access their personal dashboard
            </p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendCredentials"
                defaultChecked
                className="w-4 h-4 text-accent rounded focus:ring-accent"
              />
              <label htmlFor="sendCredentials" className="text-sm text-muted-foreground">
                Send login credentials via SMS
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent/10 transition-colors text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
