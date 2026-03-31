import { Link, useLocation } from "wouter";
import { LayoutDashboard, LogOut, Package, Tags, Globe, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth"; // We'll need to create this hook or use direct fetch

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth(); // Assuming we'll build this hook

  const navItems = [
    { href: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { href: "/admin/tours", icon: <Package className="w-5 h-5" />, label: "Tours" },
    { href: "/admin/categories", icon: <Tags className="w-5 h-5" />, label: "Categorías" },
  ];

  return (
    <div className="flex min-h-screen bg-sand/30">
      {/* Sidebar */}
      <aside className="w-64 bg-deep-blue text-white flex flex-col sticky top-0 h-screen shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
            <Globe className="w-6 h-6 text-deep-blue" />
          </div>
          <div>
            <span className="font-bold block tracking-tight">Mahana Tours</span>
            <span className="text-xs text-white/50">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                location === item.href ? "bg-gold text-deep-blue font-semibold" : "hover:bg-white/5 text-white/70"
              }`}>
                {item.icon}
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 border border-white/10 rounded-lg bg-white/5">
            <User className="w-5 h-5 text-gold" />
            <div className="overflow-hidden">
              <span className="block text-sm font-medium truncate">{user?.username || "Admin"}</span>
              <span className="block text-[10px] text-white/50 uppercase tracking-widest">Administrator</span>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate()} // mutation defined in hook
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:bg-red-500 hover:text-white transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
