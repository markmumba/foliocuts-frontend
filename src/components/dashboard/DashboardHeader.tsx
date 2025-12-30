import { Search, Bell } from 'lucide-react';

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-card border-b border-border px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome to FolioCuts</p>
          <p className="text-sm text-muted-foreground mt-1">Watch out for the new features coming soon!</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent w-64 bg-background text-foreground"
            />
          </div>

          <button className="relative p-2 hover:bg-accent/10 rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          <div className="text-sm text-muted-foreground border-l border-border pl-4">
            {currentDate}
          </div>
        </div>
      </div>
    </header>
  );
}
