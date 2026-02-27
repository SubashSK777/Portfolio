import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children, imageSrc, imageAlt, imageObjectFit, scaleImage }) => {
  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
    >
      {imageSrc && (
        <div className="media-section">
          <img src={imageSrc} alt={imageAlt} className={`media-image ${scaleImage ? 'scale-down' : ''}`} style={{ objectFit: imageObjectFit || 'cover' }} />
        </div>
      )}

      <div className={`content-section ${!imageSrc ? 'full-width' : ''}`}>
        <div className="content-top-spacing" />
        <div className="content-inner">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default PageTransition;
