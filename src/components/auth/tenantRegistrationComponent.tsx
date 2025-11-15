import tenantImage from "@/assets/tenant.png"
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface TenantRegistrationComponentProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any
    isPending?: boolean
    onBack?: () => void
}

export default function TenantRegistrationComponent({ form, isPending = false, onBack }: TenantRegistrationComponentProps) {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src={tenantImage}
                    alt="Tenant Registration"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center border border-secondary/20">
                            <span className="text-primary font-bold text-xl">💈</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary">FolioCuts</h1>
                            <p className="text-xs text-foreground-muted">Digital Barbershop Platform</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-2">Business Information</h2>
                            <p className="text-foreground-muted">
                                Step 2 of 3: Tell us about your barbershop business
                            </p>
                        </div>

                        <form
                            id="tenant-form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                        >
                            <FieldSet>
                                <FieldGroup>
                                    <form.Field
                                        name="businessName"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Business Name</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="text"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder="Elite Cuts Barbershop"
                                                        className="h-11"
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <form.Field
                                        name="businessEmail"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Business Email</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="email"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="email"
                                                        placeholder="info@elitecuts.com"
                                                        className="h-11"
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <form.Field
                                        name="businessPhone"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Business Phone</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="tel"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="tel"
                                                        placeholder="+254 712 345 678"
                                                        className="h-11"
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <form.Field
                                        name="mpesaTillNo"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>M-Pesa Till Number</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="text"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder="4909329"
                                                        className="h-11"
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                    <form.Field
                                        name="mpesaBusinessShortCode"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>M-Pesa Business Short Code</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="text"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder="94090"
                                                        className="h-11"
                                                        aria-invalid={isInvalid}
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                </FieldGroup>

                                <div className="flex flex-col space-y-4">
                                    <div className="flex gap-3">
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
                                            type="submit"
                                            form="tenant-form"
                                            variant="secondary"
                                            size="lg"
                                            className={onBack ? "flex-1" : "w-full"}
                                            disabled={isPending}
                                        >
                                            {isPending ? "Processing..." : "Next"}
                                        </Button>
                                    </div>
                                </div>
                            </FieldSet>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

