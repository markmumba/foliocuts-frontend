import { subscriptionService } from "@/services/subscription";
import { useQuery } from "@tanstack/react-query";


export function useSubscriptionTemaplatePlans() {
    return useQuery({
        queryKey: ['subscription-plan-templates'],
        queryFn: subscriptionService.getSubscriptionPlanTemplates,
    })
}

