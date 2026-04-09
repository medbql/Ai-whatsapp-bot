import Link from "next/link";
import { Button } from "../components/ui/button";
import { 
   NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
 } from "@radix-ui/react-navigation-menu";

export  default function Home() {
  return(
    <>
       <header className="bg-gray-200 border-b w-full p-4 flex items-center justify-between">
            <h3>logo</h3>
          <NavigationMenu >
          <NavigationMenuList>
              <NavigationMenuItem>
                     Item One
              </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button variant='link'>
          <Link href="/auth">Login</Link>
          </Button>
          </header>
    </>
  )
}