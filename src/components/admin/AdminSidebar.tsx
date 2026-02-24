import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Navigation, 
  Layers, 
  Image, 
  Package, 
  Box, 
  FolderKanban, 
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
  Settings,
  Award,
  FileText,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import img_logo from '../../../public/ecotel-logo.png'
interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Navigation", href: "/admin/navigation", icon: Navigation },
  { label: "Dịch vụ", href: "/admin/services", icon: Layers },
  { label: "Hero Sections", href: "/admin/hero-sections", icon: Image },
  { label: "Sản phẩm - Dịch vụ", href: "/admin/product-services", icon: Package },
  { label: "Sản phẩm", href: "/admin/products", icon: Box },
  { label: "Dự án", href: "/admin/projects", icon: FolderKanban },
  { label: "Giải thưởng", href: "/admin/prizes", icon: Award },
  { label: "Blog", href: "/admin/blogs", icon: FileText },
  { label: "Đánh giá", href: "/admin/testimonials", icon: MessageSquareQuote },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <img src={img_logo} alt="ECOTEL Logo" className="h-96 w-80 object-contain" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "admin-sidebar-item",
                isActive && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {!collapsed && user && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            {user.email}
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </Button>
      </div>
    </aside>
  );
};
