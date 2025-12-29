import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import { AppSidebar } from "@/src/app-sideBar";
import { UserStore } from "@/src/contextApi";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-600 via-emerald-700 to-slate-600"
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="min-h-screen w-full h-screen  p-4 md:p-8">
            <SidebarTrigger />
            <UserStore>{children}</UserStore>

          </main>

        </SidebarProvider>
      </body>
    </html>
  );
}
