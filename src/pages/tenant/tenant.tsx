import { useEffect, useMemo, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { useTenants } from "@/hooks/useTenants"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Building2, Calendar, CreditCard, Mail, MoreVertical, Phone, Search } from "lucide-react"
import type { TenantForList } from "@/types/tenant"

export default function Tenant() {
  const [page, setPage] = useState("1")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const size = "10"

  const isSingleTenantPage = /\/dashboard\/tenants\/[A-Za-z0-9-]+$/.test(location.pathname)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage("1")
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, error } = useTenants(page, size, debouncedSearch)

  const tenants = useMemo<TenantForList[]>(() => data?.data?.items ?? [], [data])
  const metadata = useMemo(() => data?.data?.metadata, [data])

  const quickAccessTenants = useMemo(
    () => tenants.filter((tenant) => tenant.status === "ACTIVE").slice(0, 4),
    [tenants]
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      ACTIVE: { variant: "default", label: "Active" },
      INACTIVE: { variant: "secondary", label: "Inactive" },
      SUSPENDED: { variant: "destructive", label: "Suspended" },
    }

    const config = variants[status] || { variant: "outline" as const, label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPlanBadge = (plan: string) => {
    const planVariants: Record<string, "default" | "secondary" | "outline"> = {
      BASIC: "secondary",
      PREMIUM: "default",
      ENTERPRISE: "outline",
    }

    const variant = planVariants[plan] || "outline"
    return <Badge variant={variant}>{plan}</Badge>
  }

  const handleTenantSelect = (tenantId: string) => {
    navigate(`/dashboard/tenants/${tenantId}`)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className=" bg-background">
      <Outlet />

      {!isSingleTenantPage && (
        <div className="flex h-full flex-col">
          <div className="border-b bg-card px-6 py-4">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Tenants</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage all tenant accounts and subscriptions</p>
              </div>
              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="relative w-full max-w-sm">
                  <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search tenants..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full pl-9"
                  />
                </div>
                <Button variant="default">
                  <Building2 className="mr-2 h-4 w-4" />
                  Add Tenant
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {quickAccessTenants.length > 0 && (
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Quick Access</h2>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {quickAccessTenants.map((tenant) => (
                    <div
                      key={tenant.tenantId}
                      onClick={() => handleTenantSelect(tenant.tenantId)}
                      className="cursor-pointer rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        {getStatusBadge(tenant.status)}
                      </div>
                      <h3 className="mb-1 truncate font-semibold">{tenant.businessName}</h3>
                      <p className="mb-2 text-sm text-muted-foreground">{tenant.subdomain}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        <span>{tenant.subscriptionPlan}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">All Tenants</h2>
                <span className="text-sm text-muted-foreground">{metadata?.totalItems ?? 0} total</span>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No tenants found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tenants.map((tenant) => (
                        <TableRow
                          key={tenant.tenantId}
                          onClick={() => handleTenantSelect(tenant.tenantId)}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{tenant.businessName}</div>
                                <div className="text-xs text-muted-foreground">{tenant.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="rounded bg-muted px-2 py-1 text-xs">{tenant.subdomain}</code>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{tenant.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{tenant.phoneNumber}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getPlanBadge(tenant.subscriptionPlan)}</TableCell>
                          <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(tenant.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {metadata && metadata.totalPages > 1 && (
                <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
                  <span>
                    Page {metadata.currentPage} of {metadata.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(String(Math.max(1, metadata.currentPage - 1)))}
                      disabled={metadata.currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(String(Math.min(metadata.totalPages, metadata.currentPage + 1)))}
                      disabled={metadata.currentPage === metadata.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
