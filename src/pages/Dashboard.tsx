export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
                    <p className="text-foreground-muted">Welcome to FolioCuts</p>
                </div>

                {/* Color Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Primary</h3>
                        <p className="text-sm opacity-90">#1c1e26 - Deep Navy</p>
                    </div>

                    <div className="bg-secondary text-secondary-foreground p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Secondary</h3>
                        <p className="text-sm opacity-90">#f5b700 - Warm Gold</p>
                    </div>

                    <div className="bg-accent text-accent-foreground p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Accent</h3>
                        <p className="text-sm opacity-90">#2eb67d - Emerald Green</p>
                    </div>

                    <div className="bg-neutral border border-border p-6 rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">Neutral</h3>
                        <p className="text-sm text-foreground-muted">#f5f5f5 - Soft Grey</p>
                    </div>
                </div>

                {/* Sample Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">💰</span>
                        </div>
                        <h3 className="font-semibold text-primary mb-2">Commission Tracking</h3>
                        <p className="text-sm text-foreground-muted">Automated commission calculation per staff member</p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">📱</span>
                        </div>
                        <h3 className="font-semibold text-primary mb-2">M-Pesa Integration</h3>
                        <p className="text-sm text-foreground-muted">Seamless mobile money payments with STK Push</p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <h3 className="font-semibold text-primary mb-2">Loyalty System</h3>
                        <p className="text-sm text-foreground-muted">Automatic rewards using phone numbers</p>
                    </div>
                </div>

                {/* Buttons Showcase */}
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary-light transition-colors shadow-lg">
                        Primary Button
                    </button>
                    <button className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent-light transition-colors shadow-lg">
                        Accent Button
                    </button>
                    <button className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                        Outline Button
                    </button>
                </div>
            </div>
        </div>
    )
}