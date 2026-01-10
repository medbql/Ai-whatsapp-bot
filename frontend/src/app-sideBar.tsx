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
  SidebarFooter
} from "@/components/ui/sidebar"
import Link from "next/link"
import { userData } from "./authContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Profiles",
    url: "profiles",
    icon: User,
  },
  {
    title: "ChatBot",
    url: "chatBot",
    icon: BrainCog,
  },

]

export function AppSidebar() {

  const {authenticated, isAuthenticetd} = userData();
  const router  = useRouter();

const logOut = () =>{
  localStorage.removeItem('Token')
  isAuthenticetd('false')
  
}
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
                    <Link href={item.url} >
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
      <SidebarFooter>
        <Button onClick={logOut} >
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
