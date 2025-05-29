
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerContent, setFooterContent] = useState({
    copyright: `&copy; ${currentYear} Torneo BJJ Élite. Todos los derechos reservados.`,
    credits: "Diseñado y desarrollado con pasión por el Jiu-Jitsu."
  });

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('element_key, content_value')
          .in('element_key', ['footer_copyright_text', 'footer_credits_text']);

        if (error) throw error;

        const newFooterContent = { ...footerContent };
        data.forEach(item => {
          if (item.element_key === 'footer_copyright_text' && item.content_value && item.content_value.value) {
            newFooterContent.copyright = `&copy; ${currentYear} ${item.content_value.value}`;
          } else if (item.element_key === 'footer_credits_text' && item.content_value && item.content_value.value) {
            newFooterContent.credits = item.content_value.value;
          }
        });
        setFooterContent(newFooterContent);
      } catch (error) {
        console.error("Error fetching footer content:", error);
      }
    };
    fetchFooterContent();
  }, [currentYear]);


  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-12 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Facebook size={24} />
          </a>
          <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Instagram size={24} />
          </a>
          <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Twitter size={24} />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Linkedin size={24} />
          </a>
        </div>
        <p className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: footerContent.copyright }} />
        <p className="text-xs">
          {footerContent.credits}
        </p>
         <p className="text-xs mt-4">
          <a href="/terms" className="hover:text-primary underline">Términos y Condiciones</a> | <a href="/privacy" className="hover:text-primary underline">Política de Privacidad</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;