
'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calculator, User, Settings, LogOut, Crown, BarChart3, BookOpen, Home } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/types';

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const subscriptionInfo = SUBSCRIPTION_TIERS[(user.subscription || 'free') as keyof typeof SUBSCRIPTION_TIERS];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold gradient-text">HomeMath Academy</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard'}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/growth-plan'}>
              <BookOpen className="w-4 h-4 mr-2" />
              Growth Plan
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/quiz-analytics'}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Quiz Analytics
            </Button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Subscription Badge */}
            <Badge 
              variant={(user.subscription || 'free') === 'trial' ? 'secondary' : 'default'}
              className="hidden sm:flex"
            >
              {((user.subscription || 'free') === 'family' || (user.subscription || 'free') === 'basic') && <Crown className="w-3 h-3 mr-1" />}
              {subscriptionInfo?.name || 'Free'}
            </Badge>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
