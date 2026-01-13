
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Clock } from "lucide-react";

export default function Reports() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="flex flex-col items-center gap-4">
                <div className="bg-accent/10 p-4 rounded-full mb-2 border border-accent/20 flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-accent" />
                </div>
                <h1 className="text-3xl font-bold text-foreground text-center">Reports & Analytics</h1>
                <Alert className="w-full max-w-md bg-card border border-border/40">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <AlertTitle className="font-semibold text-lg">Coming Soon</AlertTitle>
                    </div>
                    <AlertDescription>
                        We&apos;re working hard to bring you powerful insights and analytics for your business. Soon, you&apos;ll be able to track revenue, staff performance, popular services, and more!
                    </AlertDescription>
                </Alert>
                <p className="text-muted-foreground text-center max-w-xl mt-4">
                    Stay tuned! This section will unlock new ways to grow and understand your barbershop business. If you have suggestions for the types of reports you&apos;d like to see, let us know.
                </p>
            </div>
        </div>
    );
}
