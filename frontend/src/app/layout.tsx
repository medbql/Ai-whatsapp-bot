'use client'
import "./globals.css";
import Link from "next/link";
import { UserStore } from "@/src/authContext";
import { Button } from "../components/ui/button";
import { 
   NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
 } from "@radix-ui/react-navigation-menu";



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <body className="w-full h-full">
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
           <main>
            
          <UserStore> {children}</UserStore>

          </main>

 
      </body>
    </html>
  );
}
