import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto relative">
                    <div className="p-2">
                        <SidebarTrigger className="text-white" />
                    </div>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
