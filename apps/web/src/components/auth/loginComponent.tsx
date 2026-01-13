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

interface LoginComponentProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any 
    isPending?: boolean
}

export default function LoginComponent({ form, isPending = false }: LoginComponentProps) {
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
                            <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
                            <p className="text-foreground-muted">
                                Sign in to your account to continue managing your barbershop
                            </p>
                        </div>

                        <form
                            id="login-form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                        >
                            <FieldSet>
                                <FieldGroup>
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
                                                    <div className="flex items-center justify-between mb-2">
                                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                        <a
                                                            href="#"
                                                            className="text-sm text-accent hover:text-accent-light transition-colors"
                                                        >
                                                            Forgot password?
                                                        </a>
                                                    </div>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="password"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        autoComplete="current-password"
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
                                </FieldGroup>

                                <div className="flex flex-col space-y-4">
                                    <Button
                                        type="submit"
                                        form="login-form"
                                        variant="secondary"
                                        size="lg"
                                        className="w-full"
                                        disabled={isPending}
                                    >
                                        {isPending ? "Signing in..." : "Sign In"}
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-border"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-foreground-muted">Or continue with</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                    >
                                        <span className="mr-2">📱</span>
                                        Sign in with Number
                                    </Button>
                                </div>
                            </FieldSet>
                        </form>

                        <div className="text-center text-sm text-foreground-muted">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="text-accent font-semibold hover:text-accent-light transition-colors"
                            >
                                Sign up
                            </a>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <p className="text-xs text-center text-foreground-muted">
                            By signing in, you agree to our{" "}
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