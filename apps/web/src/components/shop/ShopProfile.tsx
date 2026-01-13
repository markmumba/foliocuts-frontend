import { useState } from 'react';
import { Edit2, Save, X, MapPin, Phone, Mail, Users, Building2 } from 'lucide-react';
import { BusinessHours } from './BusinessHours';
import type { Tenant } from '@digital-barbershop/shared-types';

interface ShopProfileProps {
  tenant: Tenant;
}

export function ShopProfile({ tenant }: ShopProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: tenant.businessName || '',
    email: tenant.email || '',
    phoneNumber: tenant.phoneNumber || '',
    subdomain: tenant.subdomain || '',
    mpesaTillNo: tenant.mpesaTillNo || '',
    mpesaBusinessShortCode: tenant.mpesaBusinessShortCode || '',
    numberOfUsers: tenant.numberOfUsers || 0,
  });

  const handleSave = () => {
    // Save logic here - will integrate with API later
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground text-2xl">
                {formData.businessName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{formData.businessName}</h2>
              <p className="text-sm text-muted-foreground mb-2">{formData.subdomain}.foliocuts.com</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{formData.numberOfUsers} Staff Members</span>
                </div>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Shop Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Shop Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ) : (
              <p className="text-foreground">{formData.businessName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ) : (
              <p className="text-foreground">{formData.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ) : (
              <p className="text-foreground">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Subdomain
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ) : (
              <p className="text-foreground">{formData.subdomain}.foliocuts.com</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">M-Pesa Till Number</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.mpesaTillNo}
                onChange={(e) => setFormData({ ...formData, mpesaTillNo: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ) : (
              <p className="text-foreground">{formData.mpesaTillNo || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">M-Pesa Business Short Code</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.mpesaBusinessShortCode}
                onChange={(e) => setFormData({ ...formData, mpesaBusinessShortCode: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ) : (
              <p className="text-foreground">{formData.mpesaBusinessShortCode || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <BusinessHours isEditing={isEditing} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Staff</p>
              <h3 className="text-2xl font-bold text-foreground">{formData.numberOfUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <h3 className="text-lg font-bold text-foreground">{tenant.status}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subscription</p>
              <h3 className="text-lg font-bold text-foreground">{tenant.subscriptionPlan}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
