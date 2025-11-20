import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldLegend,
    FieldTitle,
} from "@/components/ui/field";
import {
    User,
    Building2,
    Bell,
    Shield,
    CreditCard,
    Palette,
    Save,
} from "lucide-react";

export default function Settings() {
    // Dummy data state
    const [profileData, setProfileData] = useState({
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+254 712 345 678",
        role: "OWNER",
    });

    const [businessData, setBusinessData] = useState({
        businessName: "FolioCuts Barbershop",
        subdomain: "foliocuts",
        address: "123 Main Street, Nairobi, Kenya",
        city: "Nairobi",
        country: "Kenya",
        postalCode: "00100",
        description: "Premium barbershop offering quality haircuts and grooming services.",
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        appointmentReminders: true,
        paymentNotifications: true,
        marketingEmails: false,
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: "30",
        passwordExpiry: "90",
    });

    const [preferences, setPreferences] = useState({
        language: "en",
        timezone: "Africa/Nairobi",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        theme: "system",
    });

    const [subscriptionData] = useState({
        plan: "PREMIUM",
        status: "ACTIVE",
        billingCycle: "Monthly",
        nextBillingDate: "2024-02-15",
        amount: "KES 15,000",
    });

    const handleInputChange = (section: string, field: string) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const value = e.target.value;
        if (section === "profile") {
            setProfileData((prev) => ({ ...prev, [field]: value }));
        } else if (section === "business") {
            setBusinessData((prev) => ({ ...prev, [field]: value }));
        } else if (section === "security") {
            setSecuritySettings((prev) => ({ ...prev, [field]: value }));
        } else if (section === "preferences") {
            setPreferences((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSwitchChange = (field: string) => (checked: boolean) => {
        setNotificationSettings((prev) => ({ ...prev, [field]: checked }));
    };

    const handleSave = (section: string) => {
        console.log(`Saving ${section} settings...`);
        // Placeholder for save functionality
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Profile Settings */}
                <div className="bg-card border rounded-lg p-6">
                    <FieldSet>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <FieldLegend className="text-lg font-semibold mb-0">Profile Settings</FieldLegend>
                                    <p className="text-sm text-muted-foreground">Update your personal information</p>
                                </div>
                            </div>
                            <Button onClick={() => handleSave("profile")} size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldTitle>Full Name</FieldTitle>
                                <FieldContent>
                                    <Input
                                        value={profileData.fullName}
                                        onChange={handleInputChange("profile", "fullName")}
                                        placeholder="Enter your full name"
                                    />
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Email</FieldTitle>
                                <FieldContent>
                                    <Input
                                        type="email"
                                        value={profileData.email}
                                        onChange={handleInputChange("profile", "email")}
                                        placeholder="Enter your email"
                                    />
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Phone Number</FieldTitle>
                                <FieldContent>
                                    <Input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={handleInputChange("profile", "phone")}
                                        placeholder="Enter your phone number"
                                    />
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Role</FieldTitle>
                                <FieldContent>
                                    <Badge variant="secondary">{profileData.role}</Badge>
                                    <FieldDescription>Your role cannot be changed</FieldDescription>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                {/* Business Information */}
                <div className="bg-card border rounded-lg p-6">
                    <FieldSet>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-secondary-foreground" />
                                </div>
                                <div>
                                    <FieldLegend className="text-lg font-semibold mb-0">Business Information</FieldLegend>
                                    <p className="text-sm text-muted-foreground">Manage your business details</p>
                                </div>
                            </div>
                            <Button onClick={() => handleSave("business")} size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldTitle>Business Name</FieldTitle>
                                <FieldContent>
                                    <Input
                                        value={businessData.businessName}
                                        onChange={handleInputChange("business", "businessName")}
                                        placeholder="Enter business name"
                                    />
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Subdomain</FieldTitle>
                                <FieldContent>
                                    <Input
                                        value={businessData.subdomain}
                                        onChange={handleInputChange("business", "subdomain")}
                                        placeholder="Enter subdomain"
                                    />
                                    <FieldDescription>Your unique subdomain identifier</FieldDescription>
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Address</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        value={businessData.address}
                                        onChange={handleInputChange("business", "address")}
                                        rows={2}
                                        placeholder="Enter business address"
                                    />
                                </FieldContent>
                            </Field>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field>
                                    <FieldLabel>City</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={businessData.city}
                                            onChange={handleInputChange("business", "city")}
                                            placeholder="City"
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Country</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={businessData.country}
                                            onChange={handleInputChange("business", "country")}
                                            placeholder="Country"
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Postal Code</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={businessData.postalCode}
                                            onChange={handleInputChange("business", "postalCode")}
                                            placeholder="Postal code"
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        value={businessData.description}
                                        onChange={handleInputChange("business", "description")}
                                        rows={3}
                                        placeholder="Describe your business"
                                    />
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                {/* Notification Settings */}
                <div className="bg-card border rounded-lg p-6">
                    <FieldSet>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-accent-foreground" />
                                </div>
                                <div>
                                    <FieldLegend className="text-lg font-semibold mb-0">Notification Settings</FieldLegend>
                                    <p className="text-sm text-muted-foreground">Control how you receive notifications</p>
                                </div>
                            </div>
                            <Button onClick={() => handleSave("notifications")} size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldTitle>Email Notifications</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch
                                        checked={notificationSettings.emailNotifications}
                                        onCheckedChange={handleSwitchChange("emailNotifications")}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </span>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>SMS Notifications</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch
                                        checked={notificationSettings.smsNotifications}
                                        onCheckedChange={handleSwitchChange("smsNotifications")}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Receive notifications via SMS
                                    </span>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Push Notifications</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch
                                        checked={notificationSettings.pushNotifications}
                                        onCheckedChange={handleSwitchChange("pushNotifications")}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Receive push notifications
                                    </span>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Appointment Reminders</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch
                                        checked={notificationSettings.appointmentReminders}
                                        onCheckedChange={handleSwitchChange("appointmentReminders")}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Get reminders for upcoming appointments
                                    </span>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Payment Notifications</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch
                                        checked={notificationSettings.paymentNotifications}
                                        onCheckedChange={handleSwitchChange("paymentNotifications")}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Notify me about payment transactions
                                    </span>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Marketing Emails</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch
                                        checked={notificationSettings.marketingEmails}
                                        onCheckedChange={handleSwitchChange("marketingEmails")}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Receive marketing and promotional emails
                                    </span>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                {/* Security Settings */}
                <div className="bg-card border rounded-lg p-6">
                    <FieldSet>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <FieldLegend className="text-lg font-semibold mb-0">Security Settings</FieldLegend>
                                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                                </div>
                            </div>
                            <Button onClick={() => handleSave("security")} size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldTitle>Two-Factor Authentication</FieldTitle>
                                <FieldContent className="flex items-center gap-3">
                                    <Switch
                                        checked={securitySettings.twoFactorAuth}
                                        onCheckedChange={(checked) =>
                                            setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: checked }))
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your account
                                    </span>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Session Timeout (minutes)</FieldTitle>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        value={securitySettings.sessionTimeout}
                                        onChange={handleInputChange("security", "sessionTimeout")}
                                        min="5"
                                        max="120"
                                    />
                                    <FieldDescription>Automatically log out after inactivity</FieldDescription>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Password Expiry (days)</FieldTitle>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        value={securitySettings.passwordExpiry}
                                        onChange={handleInputChange("security", "passwordExpiry")}
                                        min="30"
                                        max="365"
                                    />
                                    <FieldDescription>Days before password expires</FieldDescription>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                {/* Preferences */}
                <div className="bg-card border rounded-lg p-6">
                    <FieldSet>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <FieldLegend className="text-lg font-semibold mb-0">Preferences</FieldLegend>
                                    <p className="text-sm text-muted-foreground">Customize your experience</p>
                                </div>
                            </div>
                            <Button onClick={() => handleSave("preferences")} size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                        <FieldGroup>
                            <Field orientation="responsive">
                                <FieldTitle>Language</FieldTitle>
                                <FieldContent>
                                    <select
                                        value={preferences.language}
                                        onChange={handleInputChange("preferences", "language")}
                                        className="border border-input bg-background rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full"
                                    >
                                        <option value="en">English</option>
                                        <option value="sw">Swahili</option>
                                    </select>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Timezone</FieldTitle>
                                <FieldContent>
                                    <select
                                        value={preferences.timezone}
                                        onChange={handleInputChange("preferences", "timezone")}
                                        className="border border-input bg-background rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full"
                                    >
                                        <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Date Format</FieldTitle>
                                <FieldContent>
                                    <select
                                        value={preferences.dateFormat}
                                        onChange={handleInputChange("preferences", "dateFormat")}
                                        className="border border-input bg-background rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Time Format</FieldTitle>
                                <FieldContent>
                                    <select
                                        value={preferences.timeFormat}
                                        onChange={handleInputChange("preferences", "timeFormat")}
                                        className="border border-input bg-background rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full"
                                    >
                                        <option value="24h">24 Hour</option>
                                        <option value="12h">12 Hour</option>
                                    </select>
                                </FieldContent>
                            </Field>
                            <Field orientation="responsive">
                                <FieldTitle>Theme</FieldTitle>
                                <FieldContent>
                                    <select
                                        value={preferences.theme}
                                        onChange={handleInputChange("preferences", "theme")}
                                        className="border border-input bg-background rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full"
                                    >
                                        <option value="system">System</option>
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>

                {/* Subscription */}
                <div className="bg-card border rounded-lg p-6">
                    <FieldSet>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <FieldLegend className="text-lg font-semibold mb-0">Subscription</FieldLegend>
                                <p className="text-sm text-muted-foreground">Your current subscription plan</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Plan</div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default">{subscriptionData.plan}</Badge>
                                    <Badge variant={subscriptionData.status === "ACTIVE" ? "default" : "secondary"}>
                                        {subscriptionData.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Billing Cycle</div>
                                <div className="font-medium">{subscriptionData.billingCycle}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Amount</div>
                                <div className="font-medium">{subscriptionData.amount}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Next Billing Date</div>
                                <div className="font-medium">{subscriptionData.nextBillingDate}</div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button variant="outline">Manage Subscription</Button>
                        </div>
                    </FieldSet>
                </div>
            </div>
        </div>
    );
}
