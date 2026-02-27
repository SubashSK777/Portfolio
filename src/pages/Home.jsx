import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Home = () => {
  return (
    <PageTransition imageSrc="/avatar1.png" imageAlt="Subash Kumar Profile" scaleImage={true}>
      <div style={{ paddingRight: '20%' }}>
        <motion.h1
          className="display-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          SUBASH <br /> KUMAR K
        </motion.h1>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          AI/ML Developer
        </motion.h2>

        <motion.p
          className="body-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Based in India at Genplus Innovations Private Limited. Architecting sophisticated, data-driven systems leveraging machine learning and generative AI to solve complex computational challenges.
        </motion.p>

        <motion.div
          style={{ display: 'flex', gap: '2rem', marginTop: '4rem', flexWrap: 'wrap' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a href="https://github.com/SubashSK777" target="_blank" rel="noreferrer" className="minimal-button">
            Github
          </a>
          <a href="https://www.linkedin.com/in/subashsk777/?trk=people-guest_people_search-card&originalSubdomain=in" target="_blank" rel="noreferrer" className="minimal-button">
            LinkedIn
          </a>
          <Link to="/about" className="minimal-button">
            About Me
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Home;
