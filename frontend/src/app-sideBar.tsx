import { BrainCog, Calendar, Home, Inbox, LucideWashingMachine, Search, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Profiles",
    url: "/profiles",
    icon: User,
  },
  {
    title: "ChatBot",
    url: "/chatBot",
    icon: BrainCog,
  },

]

export function AppSidebar() {
  return (
    <Sidebar className="my-5 ml-3 h-[80hv] border overflow-hidden rounded-xl" >
      <SidebarContent className=" bg-gray-400/10 backdrop-blur-lg ">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={'dashboard' + item.url} >
                      <item.icon />
                      <span>{item.title}</span>

                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
