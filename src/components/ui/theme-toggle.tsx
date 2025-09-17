'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useMemo } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const Icon = useMemo(() => {
    switch (theme) {
      case 'dark':
        return Moon;
      case 'light':
        return Sun;
      default:
        return Laptop;
    }
  }, [theme]);

  const handleQuickToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const CurrentIcon = Icon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label="Toggle theme">
          <CurrentIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleQuickToggle}>
          Quick toggle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
