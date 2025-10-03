import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Box, Home, Sparkles } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/camera", icon: Camera, label: "Capture" },
    { path: "/design", icon: Box, label: "Design" },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="bg-gradient-hero p-2 rounded-lg shadow-elegant">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Room Star
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "architectural" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};