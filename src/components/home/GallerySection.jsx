import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video } from 'lucide-react';

const fadeIn = (delay = 0, y = 20) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } },
});

const GalleryItem = ({ type, title, icon, imageUrl, videoUrl, altText }) => (
  <motion.div 
    variants={fadeIn(0.1, 15)}
    className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3] glassmorphism"
    whileHover={{ scale: 1.03, zIndex: 10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <img  alt={altText || title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" src={imageUrl} src="https://images.unsplash.com/photo-1612959669877-32bea046cf0d" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
      <div className="flex items-center space-x-2 text-white">
        {React.cloneElement(icon, { className: "h-5 w-5" })}
        <span className="font-semibold">{title}</span>
      </div>
    </div>
    {type === 'video' && videoUrl && (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/50 p-3 rounded-full">
        <Video size={48} className="text-white drop-shadow-lg" />
        </div>
      </a>
    )}
  </motion.div>
);

const GallerySection = ({ content, galleryItems }) => (
  <motion.section id="gallery" variants={fadeIn(0.5)} initial="hidden" animate="visible" className="py-12">
    <h2 className="text-4xl font-semibold text-center mb-12 gradient-text">{content.gallery_title?.value || "Ediciones Anteriores"}</h2>
    {galleryItems.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <GalleryItem 
            key={item.id} 
            type={item.type} 
            title={item.title} 
            altText={item.alt_text || item.title} 
            icon={item.type === 'image' ? <ImageIcon /> : <Video />} 
            imageUrl={item.image_url}
            videoUrl={item.video_url}
          />
        ))}
      </div>
    ) : (
      <p className="text-center text-muted-foreground">Próximamente galería de eventos.</p>
    )}
  </motion.section>
);

export default GallerySection;