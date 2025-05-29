import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swords, ListChecks, ShieldCheck as UserShield } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const Navbar = () => {
  const [tournamentName, setTournamentName] = useState("Torneo BJJ");
  const [isAdmin, setIsAdmin] = useState(false); // Default to false, hiding admin links

  useEffect(() => {
    const fetchTournamentName = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content_value')
          .eq('element_key', 'tournament_name')
          .single();

        if (error) throw error;
        if (data && data.content_value && data.content_value.value) {
          setTournamentName(data.content_value.value);
        }
      } catch (error) {
        console.error("Error fetching tournament name:", error);
        setTournamentName("OPEN SALTA"); 
      }
    };
    fetchTournamentName();

    // Check for admin status (e.g., from Supabase Auth session or localStorage)
    // This is a placeholder. For a real application, you'd use Supabase Auth.
    // Example:
    // const checkAdminStatus = async () => {
    //   const { data: { session } } = await supabase.auth.getSession();
    //   if (session?.user?.user_metadata?.role === 'admin') {
    //     setIsAdmin(true);
    //   } else {
    //     setIsAdmin(false);
    //   }
    // };
    // checkAdminStatus();

    // For now, isAdmin remains false, so the "Inscriptos" link will be hidden.
    // To test, you can temporarily set it to true:
    // setIsAdmin(true);

  }, []);

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
            <span className="text-2xl font-bold gradient-text group-hover:opacity-80 transition-opacity duration-300">
              {tournamentName}
            </span>
          </Link>
          <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
            <NavLinkItem to="/">Inicio</NavLinkItem>
            <NavLinkItem to="/#inscripcion">Inscripción</NavLinkItem>
            <NavLinkItem to="/#sponsors">Patrocinadores</NavLinkItem>
            <NavLinkItem to="/#gallery">Galería</NavLinkItem>
            {isAdmin && (
              <NavLinkItem to="/admin/registrations" icon={<ListChecks className="h-4 w-4 mr-1 md:mr-2"/>}>Inscriptos</NavLinkItem>
            )}
            {/* If you want a login link for admins (once auth is set up):
            {!isAdmin && (
              <NavLinkItem to="/admin-login" icon={<UserShield className="h-4 w-4 mr-1 md:mr-2"/>}>Admin Login</NavLinkItem>
            )}
            */}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLinkItem = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-foreground/80 hover:text-primary px-2 py-2 md:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors duration-300 relative group flex items-center"
  >
    {icon}
    {children}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
  </Link>
);

export default Navbar;