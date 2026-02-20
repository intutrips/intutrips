import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    BookOpen,
    MessageSquare,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Shield,
    Globe
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { getVersionDisplay } from '@/lib/version';

export default function AdminLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { label: 'Destinos', icon: Map, path: '/admin/destinations' },
        { label: 'Guias', icon: BookOpen, path: '/admin/guides' },
        { label: 'Depoimentos', icon: MessageSquare, path: '/admin/testimonials' },
        { label: 'Países', icon: Globe, path: '/admin/countries' },
        { label: 'Contatos', icon: Users, path: '/admin/contacts' },
        { label: 'Gerenciar Admins', icon: Shield, path: '/admin/users' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#1A1A1A] text-white sticky top-0 h-screen">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-light tracking-widest uppercase">
                        Intu Trips <span className="text-[#C9A962] italic block text-xs mt-1">Backoffice Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${location.pathname === item.path
                                ? 'bg-[#C9A962] text-white shadow-lg shadow-[#C9A962]/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                <span className="font-light">{item.label}</span>
                            </div>
                            {location.pathname === item.path && <ChevronRight className="h-4 w-4" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 p-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#C9A962]/20 border border-[#C9A962]/30 flex items-center justify-center text-[#C9A962]">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-tighter">Administrador</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 gap-3"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        Sair do Painel
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-50">
                    <span className="font-light tracking-widest text-[#1A1A1A] uppercase text-sm">Intu Trips Admin</span>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {children}
                </main>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-[#1A1A1A] p-6 pt-24 text-white">
                    <nav className="space-y-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 text-xl font-light p-4 rounded-2xl ${location.pathname === item.path ? 'bg-[#C9A962]' : ''
                                    }`}
                            >
                                <item.icon className="h-6 w-6" />
                                {item.label}
                            </Link>
                        ))}
                        <button
                            className="flex items-center gap-4 text-xl font-light p-4 text-red-400"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-6 w-6" />
                            Sair
                        </button>
                    </nav>
                    
                    {/* Version and Footer */}
                    <div className="mt-auto p-4 border-t border-gray-200">
                        <div className="text-center space-y-3">
                            <div className="text-xs text-gray-500">
                                Versão {getVersionDisplay()}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-xs text-gray-400">Powered by</span>
                                <a 
                                    href="https://fiveagenciadigital.com.br" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                >
                                    <img 
                                        src="https://fiveagenciadigital.com.br/wp-content/uploads/2020/02/five-4.png" 
                                        alt="Five Agency" 
                                        className="h-6 w-auto hover:opacity-80 transition-opacity"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
