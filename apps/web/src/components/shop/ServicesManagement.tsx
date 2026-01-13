import { useMemo } from 'react';
import { Plus, Edit2, Trash2, Scissors } from 'lucide-react';
import type { Tenant } from '@digital-barbershop/shared-types';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

interface ServicesManagementProps {
  tenant: Tenant;
}

export function ServicesManagement({ tenant }: ServicesManagementProps) {
  const navigate = useNavigate();

  const groupedServices = useMemo(() => {
    if (!tenant?.services?.length) {
      return [];
    }

    const groups = tenant.services.reduce<Record<string, typeof tenant.services>>((acc, service) => {
      const category = service.serviceType || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    return Object.entries(groups).map(([type, services]) => ({ type, services }));
  }, [tenant?.services]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Services & Pricing</h2>
          <p className="text-sm text-muted-foreground">Manage services offered at your shop</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/services')}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      {/* Services by Category */}
      {groupedServices.length > 0 ? (
        groupedServices.map((group) => (
          <div key={group.type} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">{group.type} Services</h3>

            <div className="space-y-3">
              {group.services.map((service) => (
                <div
                  key={service.serviceId}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium mb-1">{service.serviceName}</p>
                      <p className="text-sm text-muted-foreground">ID: {service.serviceId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">KES {service.servicePrice.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-accent">Active</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/services`)}
                        className="p-2 hover:bg-muted rounded-lg"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-card rounded-xl p-12 border border-border text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Services Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first service to get started</p>
          <Button
            onClick={() => navigate('/dashboard/services')}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      )}
    </div>
  );
}
