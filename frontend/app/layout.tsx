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


const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

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
            
          {children}

          </main>

 
      </body>
    </html>
  );
}
