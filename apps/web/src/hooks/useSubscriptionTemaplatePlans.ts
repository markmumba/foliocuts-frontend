import { subscriptionService } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


export function useSubscriptionTemaplatePlansAdmin() {
    return useQuery({
        queryKey: ['subscription-plan-templates'],
        queryFn: subscriptionService.getSubscriptionPlanTemplatesAdmin,
    })
}

export function useSubscriptionTemaplatePlansCustomer() {
    return useQuery({
        queryKey: ['subscription-plan-templates-customer'],
        queryFn: subscriptionService.getSubscriptionPlanTemplatesCustomer,
    })
}
export function useSubscriptionPlanTemplate(id?: string) {
    return useQuery({
        queryKey: ['subscription-plan-template', id],
        queryFn: () => subscriptionService.getSubscriptionPlanTemplate(id!),
        enabled: !!id,
    })
}

