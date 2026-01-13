import { Button } from "@/components/ui/button";
import { useSubscriptionTemaplatePlansCustomer } from "@/hooks/useSubscriptionTemaplatePlans";
import type { SubscriptionPlanTemplateResponse } from "@digital-barbershop/shared-types";
import { Loader2Icon, CheckIcon } from "lucide-react";

interface SubscriptionPlanComponentProps {
    selectedPlanId: string | null;
    onPlanSelect: (planId: string) => void;
    onBack?: () => void;
    onComplete?: () => void;
    isPending?: boolean;
}

export default function SubscriptionPlanComponent({
    selectedPlanId,
    onPlanSelect,
    onBack,
    onComplete,
    isPending = false
}: SubscriptionPlanComponentProps) {
    const { data, isLoading, error } = useSubscriptionTemaplatePlansCustomer();

    const plans = data?.data || [];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const parseFeatures = (features: string): string[] => {
        if (!features) return [];
        try {
            const parsed = JSON.parse(features);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            return features.split(/[,;|]/).map(f => f.trim()).filter(Boolean);
        }
        return [];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-foreground-muted">Loading subscription plans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-8">
                <div className="text-center max-w-md">
                    <p className="text-destructive mb-4">Failed to load subscription plans</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-8">
            <div className="w-full max-w-6xl space-y-8">
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-primary mb-2">Choose Your Plan</h2>
                        <p className="text-foreground-muted">
                            Step 3 of 3: Select a subscription plan that fits your barbershop needs
                        </p>
                    </div>

                    {plans.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-foreground-muted">No subscription plans available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans
                                .filter(plan => plan.isActive)
                                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                                .map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        isSelected={selectedPlanId === plan.id}
                                        onSelect={() => onPlanSelect(plan.id)}
                                        formatPrice={formatPrice}
                                        parseFeatures={parseFeatures}
                                    />
                                ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        {onBack && (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                onClick={onBack}
                                disabled={isPending}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            className={onBack ? "flex-1" : "w-full"}
                            disabled={!selectedPlanId || isPending}
                            onClick={onComplete}
                        >
                            {isPending ? "Creating account..." : "Complete Registration"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface PlanCardProps {
    plan: SubscriptionPlanTemplateResponse;
    isSelected: boolean;
    onSelect: () => void;
    formatPrice: (price: number) => string;
    parseFeatures: (features: string) => string[];
}

function PlanCard({ plan, isSelected, onSelect, formatPrice, parseFeatures }: PlanCardProps) {
    const features = parseFeatures(plan.features || "");
    const planColors = {
        BASIC: "border-border hover:border-primary",
        PREMIUM: "border-secondary hover:border-secondary/80",
        ENTERPRISE: "border-accent hover:border-accent/80",
    };

    return (
        <div
            onClick={onSelect}
            className={`
                relative cursor-pointer rounded-lg border-2 p-6 transition-all
                ${isSelected ? "border-primary shadow-lg ring-2 ring-primary ring-offset-2" : planColors[plan.plan] || "border-border"}
                bg-card hover:shadow-md
            `}
        >
            {isSelected && (
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-1.5">
                    <CheckIcon className="w-4 h-4" />
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-primary mb-1">{plan.name}</h3>
                    <p className="text-sm text-foreground-muted">{plan.description}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                            {formatPrice(plan.monthlyPrice)}
                        </span>
                        <span className="text-sm text-foreground-muted">/month</span>
                    </div>
                    {plan.yearlyPrice && plan.yearlyPrice > 0 && (
                        <div className="text-sm text-foreground-muted">
                            <span>{formatPrice(plan.yearlyPrice)}</span>
                            <span className="ml-1">/year</span>
                            {plan.yearlySavings && plan.yearlySavings > 0 && (
                                <span className="ml-2 text-accent font-semibold">
                                    Save {formatPrice(plan.yearlySavings)}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {plan.trialDays > 0 && (
                    <div className="bg-accent/10 text-accent text-sm font-medium px-3 py-1.5 rounded-md inline-block">
                        {plan.trialDays} days free trial
                    </div>
                )}

                <div className="space-y-3 pt-2 border-t border-border">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-foreground-muted">Max Staff:</span>
                            <span className="ml-1 font-semibold">{plan.maxStaff}</span>
                        </div>
                        <div>
                            <span className="text-foreground-muted">Max Services:</span>
                            <span className="ml-1 font-semibold">{plan.maxServices || "Unlimited"}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-foreground-muted">Appointments/month:</span>
                            <span className="ml-1 font-semibold">{plan.maxAppointmentsPerMonth || "Unlimited"}</span>
                        </div>
                    </div>

                    {features.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-foreground-muted uppercase">Features:</p>
                            <ul className="space-y-1">
                                {features.slice(0, 5).map((feature, index) => (
                                    <li key={index} className="text-sm text-foreground-muted flex items-start gap-2">
                                        <CheckIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                                {features.length > 5 && (
                                    <li className="text-xs text-foreground-muted italic">
                                        +{features.length - 5} more features
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

