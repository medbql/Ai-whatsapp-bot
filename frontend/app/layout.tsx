'use client';
import "./globals.css";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserStore } from "@/src/authContext";



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
   const isMobile = useIsMobile();  

  return (
    <html lang="en">
      <body className="w-full h-full">
          <header className="bg-gray-200 border-b w-full p-4 flex items-center justify-between">
            <h3>logo</h3>
          <NavigationMenu viewport={isMobile}>
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
