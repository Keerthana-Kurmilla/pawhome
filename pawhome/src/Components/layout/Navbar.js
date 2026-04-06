import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Home, PawPrint, Search, MessageCircle, Menu, Plus, User, Star, Shield, IndianRupee } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/browse', label: 'Find a Pet', icon: Search },
  { path: '/rehome', label: 'Rehome', icon: Plus },
  { path: '/donate', label: 'Donate', icon: IndianRupee },
  { path: '/stories', label: 'Stories', icon: Star },
  { path: '/shelters', label: 'Shelters', icon: Shield },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/chats', label: 'Messages', icon: MessageCircle },
  { path: '/my-listings', label: 'My Pets', icon: User },
];

const bottomNavLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/browse', label: 'Find', icon: Search },
  { path: '/rehome', label: 'Rehome', icon: Plus },
  { path: '/donate', label: 'Donate', icon: IndianRupee },
  { path: '/chats', label: 'Chats', icon: MessageCircle },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">PawHome</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.slice(0, 6).map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5 font-body text-xs px-3"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.slice(6).map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5 font-body text-xs px-3"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center gap-2 mb-8 mt-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-xl">PawHome</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link key={path} to={path} onClick={() => setOpen(false)}>
                    <Button
                      variant={location.pathname === path ? "default" : "ghost"}
                      className="w-full justify-start gap-3"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Bottom mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 shadow-lg px-2 py-1">
        <div className="flex items-center justify-around">
          {bottomNavLinks.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} className="flex flex-col items-center py-1.5 px-2 min-w-[48px]">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${location.pathname === path ? 'bg-primary' : 'bg-transparent'}`}>
                <Icon className={`w-4 h-4 ${location.pathname === path ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-[9px] mt-0.5 font-medium ${location.pathname === path ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}