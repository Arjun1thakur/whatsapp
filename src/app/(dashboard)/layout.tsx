
import { AppSidebar } from "@/components/app-sidebar"
import ProtectedRoute from "@/components/protected-route";

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </ProtectedRoute>
  );
}
