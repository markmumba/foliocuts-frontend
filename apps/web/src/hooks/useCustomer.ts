import { useQuery } from "@tanstack/react-query"
import { customerService } from "@/lib/api"


export const useCustomers = (page: number, size: number, search: string) => {
    return useQuery({
        queryKey: ['customers', page, size, search],
        queryFn: () => customerService.getCustomers(page, size, search),
    })
}

export const useCustomer = (customerId: number) => {
    return useQuery({
        queryKey: ['customer', customerId],
        queryFn: () => customerService.getCustomer(customerId),
        enabled: !!customerId,
    })
}
