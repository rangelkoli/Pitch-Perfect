"use client";

import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

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
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would typically come from your auth state

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 items-center'>
        <div className='mr-4 hidden md:flex'>
          <a href='/' className='mr-6 flex items-center space-x-2'>
            <span className='hidden font-bold sm:inline-block'>
              Company Name
            </span>
          </a>
          <nav className='flex items-center space-x-6 text-sm font-medium text-center'>
            <DesktopNav />
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
            >
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='pr-0'>
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            {/* Add search functionality here if needed */}
          </div>
          <nav className='flex items-center'>
            {isLoggedIn ? (
              <Button
                variant='ghost'
                className='h-8 w-8 rounded-full'
                aria-label='User profile'
              >
                <User className='h-5 w-5' />
              </Button>
            ) : (
              <Button variant='default' size='sm'>
                Log In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

const DesktopNav = () => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
            <li className='row-span-3'>
              <NavigationMenuLink asChild>
                <a
                  className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                  href='/'
                >
                  <div className='mb-2 mt-4 text-lg font-medium'>shadcn/ui</div>
                  <p className='text-sm leading-tight text-muted-foreground'>
                    Beautifully designed components built with Radix UI and
                    Tailwind CSS.
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            <ListItem href='/docs' title='Introduction'>
              Re-usable components built using Radix UI and Tailwind CSS.
            </ListItem>
            <ListItem href='/docs/installation' title='Installation'>
              How to install dependencies and structure your app.
            </ListItem>
            <ListItem href='/docs/primitives/typography' title='Typography'>
              Styles for headings, paragraphs, lists...etc
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
            {components.map((component) => (
              <ListItem
                key={component.title}
                title={component.title}
                href={component.href}
              >
                {component.description}
              </ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <a href='/docs'>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </a>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

const MobileNav = () => (
  <div className='flex flex-col space-y-3'>
    <a href='/' className='font-bold'>
      Company Name
    </a>
    <a
      href='/docs'
      className='text-foreground/70 transition-colors hover:text-foreground'
    >
      Documentation
    </a>
    <a
      href='/docs/components'
      className='text-foreground/70 transition-colors hover:text-foreground'
    >
      Components
    </a>
    <a
      href='/themes'
      className='text-foreground/70 transition-colors hover:text-foreground'
    >
      Themes
    </a>
    <a
      href='/examples'
      className='text-foreground/70 transition-colors hover:text-foreground'
    >
      Examples
    </a>
    <a
      href='/github'
      className='text-foreground/70 transition-colors hover:text-foreground'
    >
      GitHub
    </a>
  </div>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
