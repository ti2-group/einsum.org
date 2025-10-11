import React from "react";
import { Link, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Header = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-divider">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <span className="font-bold text-2xl">einsum</span>
          <span className="text-primary text-2xl font-bold">.org</span>
        </Link>
        
        <Button 
          isIconOnly 
          variant="light" 
          className="md:hidden"
          aria-label="Menu"
        >
          <Icon icon="lucide:menu" width={24} />
        </Button>
      </div>
    </header>
  );
};