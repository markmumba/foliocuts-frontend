import { useMemo } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSubscriptionTemaplatePlansAdmin } from "@/hooks/useSubscriptionTemaplatePlans";
import type { SubscriptionPlanTemplateResponse } from "@/types/subscriptionPlanTemplate";
import { CheckIcon, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatPrice, parseFeatures } from "@/utils/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscriptionService";

export default function SubscriptionPlanTemplate() {
    const { data, isLoading, error } = useSubscriptionTemaplatePlansAdmin();
    const navigate = useNavigate();
    const location = useLocation();
    const isCreatePage = location.pathname.includes('/new');
    const isUpdatePage = location.pathname.includes('/edit');


    const plans = useMemo<SubscriptionPlanTemplateResponse[]>(() => {
        const payload = data?.data;
        return Array.isArray(payload) ? payload : [];
    }, [data]);

    const activePlans = useMemo(() =>
        plans.filter(plan => plan.isActive).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
        [plans]
    );

    const deactivatedPlans = useMemo(() =>
        plans.filter(plan => !plan.isActive).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
        [plans]
    );







    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    if (isCreatePage) {
        return <Outlet />;
    }

    if (isUpdatePage) {
        return <Outlet />;
    }

    return (
        <div className="p-6 space-y-6">
            {!isCreatePage && !isUpdatePage && (
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Subscription Templates</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            )}
            <Outlet />
            {!isCreatePage && !isUpdatePage && (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Subscription Plan Templates</h1>
                            <p className="text-muted-foreground">
                                Manage the plans tenants can select when subscribing to your platform.
                            </p>
                        </div>
                        <Button className="gap-2" onClick={() => navigate("/dashboard/subscription-templates/new")}>
                            Create New Template
                        </Button>
                    </div>

                    {plans.length === 0 ? (
                        <div className="border border-dashed rounded-xl p-12 text-center space-y-4">
                            <p className="text-muted-foreground">No subscription plan templates found.</p>
                            <Button variant="outline" onClick={() => navigate("/dashboard/subscription-templates/new")}>
                                Create your first template
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Active Plans Section */}
                            {activePlans.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-foreground">Active Plans</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {activePlans.map((plan) => (
                                            <PlanCard
                                                key={plan.id}
                                                plan={plan}
                                                parseFeatures={parseFeatures}
                                                formatPrice={formatPrice}
                                                onEdit={() => navigate(`/dashboard/subscription-templates/${plan.id}/edit`)}
                                                onDelete={() => console.log("delete plan", plan.id)}
                                                isDeactivated={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Deactivated Plans Section */}
                            {deactivatedPlans.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-muted-foreground">Deactivated Plans</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {deactivatedPlans.map((plan) => (
                                            <PlanCard
                                                key={plan.id}
                                                plan={plan}
                                                parseFeatures={parseFeatures}
                                                formatPrice={formatPrice}
                                                onEdit={() => navigate(`/dashboard/subscription-templates/${plan.id}/edit`)}
                                                onDelete={() => console.log("delete plan", plan.id)}
                                                isDeactivated={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

interface PlanCardProps {
    plan: SubscriptionPlanTemplateResponse;
    parseFeatures: (features: string) => string[];
    formatPrice: (price: number) => string;
    onEdit: () => void;
    onDelete: () => void;
    isDeactivated: boolean;
}

function PlanCard({ plan, parseFeatures, formatPrice, onEdit, onDelete, isDeactivated }: PlanCardProps) {
    const features = parseFeatures(plan.features);
    const queryClient = useQueryClient();
    const planColors: Record<string, string> = {
        BASIC: "border-border",
        PREMIUM: "border-secondary/60",
        ENTERPRISE: "border-accent/60",
    };
    const deactivateMutation = useMutation({
        mutationFn: (id: string) => subscriptionService.deactivateSubscriptionPlanTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription-plan-templates"] });
        },
    });
    const activateMutation = useMutation({
        mutationFn: (id: string) => subscriptionService.activateSubscriptionPlanTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription-plan-templates"] });
        },
    });

    const handleDeactivatePlan = (id: string) => {
        deactivateMutation.mutate(id);
    }
    const handleActivatePlan = (id: string) => {
        activateMutation.mutate(id);
    }
    return (
        <div className={`rounded-2xl border-2 bg-card p-6 shadow-sm transition ${isDeactivated
            ? "border-muted"
            : `hover:shadow-lg ${planColors[plan.plan] ?? "border-border"}`
            }`}>
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className={isDeactivated ? "opacity-50 grayscale" : ""}>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{plan.plan}</p>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                {plan.isActive ? (
                    <>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                            <CheckIcon className="w-4 h-4" />
                            Active
                        </span>
                        <Switch checked={plan.isActive} onCheckedChange={() => handleDeactivatePlan(plan.id)} />
                        <Label>Deactivate</Label>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Switch checked={plan.isActive} onCheckedChange={() => handleActivatePlan(plan.id)} />
                        <Label className="text-sm">Activate</Label>
                    </div>
                )}
            </div>

            <div className={isDeactivated ? "opacity-50 grayscale" : ""}>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">{formatPrice(plan.monthlyPrice)}</span>
                        <span className="text-muted-foreground">/month</span>
                    </div>
                    {plan.yearlyPrice ? (
                        <p className="text-sm text-muted-foreground">
                            {formatPrice(plan.yearlyPrice)} /year
                            {plan.yearlySavings ? (
                                <span className="ml-2 text-emerald-600 font-semibold">
                                    Save {formatPrice(plan.yearlySavings)} ({plan.yearlyDiscountPercentage}%)
                                </span>
                            ) : null}
                        </p>
                    ) : null}
                    {plan.trialDays ? (
                        <p className="text-xs text-accent font-semibold">Includes {plan.trialDays}-day free trial</p>
                    ) : null}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <PlanStat label="Max Staff" value={plan.maxStaff} />
                    <PlanStat label="Max Services" value={plan.maxServices || "Unlimited"} />
                    <PlanStat label="Appointments / month" value={plan.maxAppointmentsPerMonth || "Unlimited"} className="col-span-2" />
                </div>

                {features.length > 0 && (
                    <div className="space-y-2 mb-6">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Key features</p>
                        <ul className="space-y-2 text-sm">
                            {features.slice(0, 5).map((feature, index) => (
                                <li key={`${plan.id}-feature-${index}`} className="flex items-start gap-2 text-muted-foreground">
                                    <CheckIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                            {features.length > 5 && (
                                <li className="text-xs text-muted-foreground italic">+{features.length - 5} more</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
                {!isDeactivated && (
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={onEdit}>
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                )}
                <Button variant={isDeactivated ? "default" : "destructive"} size="sm" className="flex-1 gap-1" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
            </div>
        </div>
    );
}

interface PlanStatProps {
    label: string;
    value: string | number;
    className?: string;
}

function PlanStat({ label, value, className }: PlanStatProps) {
    return (
        <div className={className}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-base font-semibold">{value}</p>
        </div>
    );
}