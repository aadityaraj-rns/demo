import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogOut, ChevronDown, Loader2, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

interface SearchResult {
  id: string;
  type: string;
  name: string;
  description?: string;
  path: string;
}

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, sidebarCollapsed, toggleSidebar } = useUI();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const getUserInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate('/admin/profile-settings');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        // Use unified search endpoint
        const response: any = await api.get('/search', {
          params: {
            query: searchQuery,
            limit: 10
          }
        });

        const results = response.results || [];
        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className={`h-16 border-b border-border px-6 flex items-center justify-between transition-all duration-300 ${
      sidebarCollapsed 
        ? "bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600" 
        : "bg-card"
    }`}>
      {/* Left side with expand button and search */}
      <div className="flex items-center flex-1 gap-4">
        {/* Expand button - only visible when sidebar is collapsed */}
        {sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/20 w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105"
            title="Expand Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {/* Search */}
        <div className="flex items-center flex-1 max-w-lg" ref={searchRef}>
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              sidebarCollapsed ? "text-white/70" : "text-muted-foreground"
            }`} />
            <Input
              type="text"
              placeholder="Search industries, products, technicians..."
              className={`pl-10 border-none transition-colors ${
                sidebarCollapsed 
                  ? "bg-white/20 text-white placeholder:text-white/70 focus:bg-white/30" 
                  : "bg-muted/50 focus:bg-background"
              }`}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />
            {isSearching && (
              <Loader2 className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin ${
                sidebarCollapsed ? "text-white/70" : "text-muted-foreground"
              }`} />
            )}
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-lg">
                <CardContent className="p-2">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-start gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          <span className="font-medium text-sm">{result.name}</span>
                        </div>
                        {result.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* No Results */}
            {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
              <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
                <CardContent className="p-4 text-center text-sm text-muted-foreground">
                  No results found for "{searchQuery}"
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className={`relative ${
            sidebarCollapsed 
              ? "text-white hover:bg-white/20" 
              : ""
          }`}
        >
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notifications > 9 ? '9+' : notifications}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={`flex items-center space-x-2 ${
                sidebarCollapsed 
                  ? "hover:bg-white/20 text-white" 
                  : "hover:bg-muted"
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={sidebarCollapsed ? "bg-white/20 text-white" : "bg-primary text-primary-foreground"}>
                  {user ? getUserInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {user?.name || 'User'}
                </span>
                <span className={`text-xs ${
                  sidebarCollapsed ? "text-white/70" : "text-muted-foreground"
                }`}>
                  {user?.userType}
                </span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};