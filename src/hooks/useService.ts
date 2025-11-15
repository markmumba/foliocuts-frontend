import { servicesService } from "@/services/servicesService";
import { useQuery } from "@tanstack/react-query";

export function useServiceTypes() {
    return useQuery({
        queryKey: ['service-types'],
        queryFn: servicesService.getServiceTypes,
    })
}

export function useServices() {
    return useQuery({
        queryKey: ['services'],
        queryFn: servicesService.getServices,
    })
}

export function useService(serviceId: string) {
    return useQuery({
        queryKey: ['service', serviceId],
        queryFn: () => servicesService.getService(serviceId),
        enabled: !!serviceId,
    })
}