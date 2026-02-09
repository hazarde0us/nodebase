import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main className="h-full">{children}</main>
    </>
  );
};

export default Layout;
