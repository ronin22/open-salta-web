import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Swords, ListChecks, LogIn as LogInIcon, LogOut as LogOutIcon, ChevronDown, User, Shield } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';

    const Navbar = () => {
      const [tournamentName, setTournamentName] = useState("Torneo BJJ");
      const [isAdmin, setIsAdmin] = useState(false);
      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const fetchTournamentName = async () => {
          try {
            const { data, error } = await supabase
              .from('site_content')
              .select('content_value')
              .eq('element_key', 'tournament_name')
              .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data && data.content_value && data.content_value.value) {
              setTournamentName(data.content_value.value);
            } else {
              setTournamentName("OPEN SALTA");
            }
          } catch (error) {
            console.error("Error fetching tournament name:", error);
            setTournamentName("OPEN SALTA");
          }
        };
        fetchTournamentName();

        const checkAdminStatus = () => {
          const adminStatus = localStorage.getItem('isAdmin') === 'true';
          setIsAdmin(adminStatus);
        };

        checkAdminStatus();
        window.addEventListener('storage', checkAdminStatus);

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN') {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
          } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('isAdmin');
            setIsAdmin(false);
            navigate('/');
          }
        });
        
        return () => {
          window.removeEventListener('storage', checkAdminStatus);
          if (authListener && typeof authListener.subscription?.unsubscribe === 'function') {
            authListener.subscription.unsubscribe();
          }
        };
      }, [navigate]);

      const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({
            title: "Error al Cerrar Sesión",
            description: error.message,
            variant: "destructive",
          });
        } else {
          localStorage.removeItem('isAdmin');
          setIsAdmin(false);
          toast({
            title: "Sesión Cerrada",
            description: "Has cerrado sesión correctamente.",
            variant: "default",
          });
          navigate('/');
        }
      };

      const NavLinkItem = ({ to, children, icon, isDropdown = false, dropdownItems = [] }) => {
        if (isDropdown) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/80 hover:text-primary px-2 py-2 md:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors duration-300 relative group flex items-center">
                  {icon}
                  {children}
                  <ChevronDown className="h-4 w-4 ml-1 opacity-70 group-hover:opacity-100" />
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border shadow-xl">
                {dropdownItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
                    <Link to={item.to} className="flex items-center w-full">
                      {item.icon && React.cloneElement(item.icon, { className: "h-4 w-4 mr-2 text-primary/80" })}
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        return (
          <Link
            to={to}
            className="text-foreground/80 hover:text-primary px-2 py-2 md:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors duration-300 relative group flex items-center"
            onClick={(e) => {
              if (to.startsWith('/#')) {
                e.preventDefault();
                const targetId = to.substring(2);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/'); 
                  setTimeout(() => {
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }
            }}
          >
            {icon}
            {children}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>
        );
      };
      
      const registrationDropdownItems = [
        { to: "/affidavit/minors", label: "Inscribir Menores", icon: <User /> },
        { to: "/affidavit/adults", label: "Inscribir Adultos", icon: <Shield /> },
      ];

      return (
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-card/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-border"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center space-x-3 group">
                <Swords className="h-10 w-10 text-primary group-hover:text-primary/80 transition-colors duration-300 transform group-hover:scale-110" />
                <span className="text-2xl font-bold  group-hover:opacity-80 transition-opacity duration-300">
                  {tournamentName}
                </span>
              </Link>
              <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
                <NavLinkItem to="/">Inicio</NavLinkItem>
                <NavLinkItem isDropdown dropdownItems={registrationDropdownItems}>
                  Inscripción
                </NavLinkItem>
                <NavLinkItem to="/#sponsors">Patrocinadores</NavLinkItem>
                <NavLinkItem to="/#gallery">Galería</NavLinkItem>
                {isAdmin ? (
                  <>
                    <NavLinkItem to="/admin/registrations" icon={<ListChecks className="h-4 w-4 mr-1 md:mr-2"/>}>Inscriptos</NavLinkItem>
                    <Button onClick={handleLogout} variant="ghost" size="sm" className="text-foreground/80 hover:text-primary px-2 py-2 md:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors duration-300 relative group flex items-center">
                      <LogOutIcon className="h-4 w-4 mr-1 md:mr-2"/>Cerrar Sesión
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    </Button>
                  </>
                ) : (
                  <NavLinkItem to="/admin/login" icon={<LogInIcon className="h-4 w-4 mr-1 md:mr-2"/>}>Admin</NavLinkItem>
                )}
              </div>
            </div>
          </div>
        </motion.nav>
      );
    };
    export default Navbar;