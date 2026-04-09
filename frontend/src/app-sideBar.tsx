'use client'
import { BrainCog, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./authContext"
import { Button } from "./components/ui/button"
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
} from "./components/ui/sidebar"
import { usePathname } from "next/navigation"


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

export function AppSidebar({}) {
  const path = usePathname();
  const  {dispatch } = useAuth();

  const handelUrlPath = (url: string) : string => path === '/dashboard' ? 'dashboard/'+url : url;

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
                    <Link href={handelUrlPath(item.url)} >
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
        <Button  onClick={()=> dispatch({type:'logout'})} >
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
