import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  useEffect(() => {
    let productsTimeoutId: NodeJS.Timeout;
    let resourcesTimeoutId: NodeJS.Timeout;

    if (!isProductsOpen) {
      productsTimeoutId = setTimeout(() => setIsProductsOpen(false), 300);
    }
    if (!isResourcesOpen) {
      resourcesTimeoutId = setTimeout(() => setIsResourcesOpen(false), 300);
    }

    return () => {
      clearTimeout(productsTimeoutId);
      clearTimeout(resourcesTimeoutId);
    };
  }, [isProductsOpen, isResourcesOpen]);

  return (
    <header className='fixed top-4 left-4 right-4 flex items-center justify-between px-6 py-4 bg-white shadow-lg rounded-4xl'>
      {/* Company Name */}
      <a href='/' className='text-xl font-bold text-primary'>
        CompanyName
      </a>

      {/* Navigation Dropdowns */}
      <nav className='flex space-x-4'>
        <DropdownMenu open={isProductsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
              className='rounded-full'
            >
              Products <ChevronDown className='ml-1 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
            className='rounded-lg mt-2'
          >
            <DropdownMenuItem>
              <a href='/products/software' className='w-full'>
                Software
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href='/products/hardware' className='w-full'>
                Hardware
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href='/products/services' className='w-full'>
                Services
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={isResourcesOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
              className='rounded-full'
            >
              Resources <ChevronDown className='ml-1 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={() => setIsResourcesOpen(false)}
            className='rounded-lg mt-2'
          >
            <DropdownMenuItem>
              <a href='/resources/blog' className='w-full'>
                Blog
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href='/resources/documentation' className='w-full'>
                Documentation
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href='/resources/support' className='w-full'>
                Support
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Login/User Button */}
      <Button
        variant='outline'
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        className='rounded-full'
      >
        {isLoggedIn ? (
          <>
            <User className='mr-2 h-4 w-4' /> Profile
          </>
        ) : (
          "Login"
        )}
      </Button>
    </header>
  );
}
