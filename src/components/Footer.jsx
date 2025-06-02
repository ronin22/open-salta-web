
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerContent, setFooterContent] = useState({
    copyright: `&copy; ${currentYear} OPEN SALTA BJJ. Todos los derechos reservados.`,
    credits: "Diseñado y desarrollado con pasión por el Jiu-Jitsu."
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#'
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('element_key, content_value')
          .in('element_key', [
            'footer_copyright_text', 
            'footer_credits_text',
            'social_facebook_url',
            'social_instagram_url',
            'social_twitter_url',
            'social_linkedin_url'
          ]);

        if (error) throw error;

        const newFooterContent = { ...footerContent };
        const newSocialLinks = { ...socialLinks };

        data.forEach(item => {
          if (item.content_value && item.content_value.value) {
            switch (item.element_key) {
              case 'footer_copyright_text':
                newFooterContent.copyright = `&copy; ${currentYear} ${item.content_value.value}. Todos los derechos reservados.`;
                break;
              case 'footer_credits_text':
                newFooterContent.credits = item.content_value.value;
                break;
              case 'social_facebook_url':
                newSocialLinks.facebook = item.content_value.value;
                break;
              case 'social_instagram_url':
                newSocialLinks.instagram = item.content_value.value;
                break;
              case 'social_twitter_url':
                newSocialLinks.twitter = item.content_value.value;
                break;
              case 'social_linkedin_url':
                newSocialLinks.linkedin = item.content_value.value;
                break;
              default:
                break;
            }
          }
        });
        setFooterContent(newFooterContent);
        setSocialLinks(newSocialLinks);
      } catch (error) {
        console.error("Error fetching footer content:", error);
      }
    };
    fetchFooterData();
  }, [currentYear]);


  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-12 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 mb-6">
          {socialLinks.facebook && socialLinks.facebook !== '#' && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors duration-300">
              <Facebook size={24} />
            </a>
          )}
          {socialLinks.instagram && socialLinks.instagram !== '#' && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors duration-300">
              <Instagram size={24} />
            </a>
          )}
           {socialLinks.twitter && socialLinks.twitter !== '#' && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors duration-300">
              <Twitter size={24} />
            </a>
          )}
          {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors duration-300">
              <Linkedin size={24} />
            </a>
          )}
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
