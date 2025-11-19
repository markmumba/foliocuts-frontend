import { subscriptionService } from "@/services/subscriptionService";
import { useQuery } from "@tanstack/react-query";


export function useSubscriptionTemaplatePlans() {
    return useQuery({
        queryKey: ['subscription-plan-templates'],
        queryFn: subscriptionService.getSubscriptionPlanTemplates,
    })
}

export function useSubscriptionPlanTemplate(id?: string) {
    return useQuery({
        queryKey: ['subscription-plan-template', id],
        queryFn: () => subscriptionService.getSubscriptionPlanTemplate(id!),
        enabled: !!id,
    })
}

