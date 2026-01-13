import barberImage from "@/assets/barber.png"
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface RegisterComponentProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any
    isPending?: boolean
}

export default function RegisterComponent({ form, isPending = false }: RegisterComponentProps) {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src={barberImage}
                    alt="FolioCuts Barbershop"
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
                            <h2 className="text-3xl font-bold text-primary mb-2">Create Account</h2>
                            <p className="text-foreground-muted">
                                Step 1 of 3: Enter your personal information to get started
                            </p>
                        </div>

                        <form
                            id="register-form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                        >
                            <FieldSet>
                                <FieldGroup>
                                    <form.Field
                                        name="fullName"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="text"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="name"
                                                        placeholder="John Doe"
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
                                        name="phone"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
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
                                        name="address"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="text"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="street-address"
                                                        placeholder="123 Main Street, City"
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
                                        name="email"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="email"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="email"
                                                        placeholder="you@example.com"
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
                                        name="password"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="password"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="new-password"
                                                        placeholder="Enter your password"
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
                                        name="confirmPassword"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        children={(field: any) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="password"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="new-password"
                                                        placeholder="Confirm your password"
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
                                    <Button
                                        type="submit"
                                        form="register-form"
                                        variant="secondary"
                                        size="lg"
                                        className="w-full"
                                        disabled={isPending}
                                    >
                                        {isPending ? "Processing..." : "Next"}
                                    </Button>
                                </div>
                            </FieldSet>
                        </form>

                        <div className="text-center text-sm text-foreground-muted">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-accent font-semibold hover:text-accent-light transition-colors"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <p className="text-xs text-center text-foreground-muted">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="text-accent hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

