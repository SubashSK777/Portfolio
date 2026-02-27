import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const publications = [
  {
    type: 'Book Chapter',
    title: 'Beyond Predictions: Transforming Vocational Teacher Training with Artificial Intelligence',
    featured: 'Case Studies of Deep Learning and Machine Learning',
    year: '2025',
    description: 'This chapter explores how Artificial Intelligence can fundamentally revolutionize the landscape of vocational teacher training, moving beyond conventional predictive models into dynamic and transformative educational systems.',
    authorship: 'Dr. P. Venkadesh, Dr. S. V. Divya, K. Subash Kumar, K. Sathya and S. Ramya',
    link: 'https://www.researchgate.net/publication/392864579_Case_Studies_of_Deep_Learning_and_Machine_Learning',
  },
  {
    type: 'Conference Paper',
    title: 'A Hybrid Convolutional Neural Network Integrated with Federated Learning and Bayesian Optimization (HCNNFLB) Technique for Diabetes Prediction',
    featured: '2025 8th International Conference on Circuit, Power & Computing Technologies',
    year: '2025-08',
    description: 'Integrating deep learning, federated learning, and Bayesian optimization to enhance the privacy, scalability, and performance of diabetes prediction.',
    authorship: 'K Subash Kumar; S.V. Divya; P. Venkadesh; R Deva; S Aadhavan; Js Livish',
    link: 'https://doi.org/10.1109/iccpct65132.2025.11176783',
  },
  {
    type: 'Journal Article',
    title: 'Unlocking AI Creativity: A Multi-Agent Approach with CrewAI',
    featured: 'Journal of Trends in Computer Science and Smart Technology',
    year: '2024-12',
    description: 'Utilizing CrewAI frameworks to form multi-agent systems dedicated to unlocking and orchestrating artificial intelligence creativity.',
    authorship: 'K. Subash Kumar; P. Venkadesh; S. V. Divya',
    link: 'https://doi.org/10.36548/jtcsst.2024.4.002',
  },
  {
    type: 'Conference Paper',
    title: 'A Multi-Layer Encryption and Anomaly Detection Framework for Securing SCTP Data Transmission',
    featured: '2024 International Conference on Computing and Intelligent Reality Technologies',
    year: '2024-12',
    description: 'Securing Stream Control Transmission Protocol (SCTP) by building an advanced multi-layered encryption paired with anomaly detection frameworks.',
    authorship: 'K.Subash Kumar; P. Venkadesh; S.V. Divya; Geetha Ponnaian; T.Saju Raj; S.Ninisha Nels',
    link: 'https://doi.org/10.1109/iccirt59484.2024.10921865',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const Publications = () => {
  return (
    <PageTransition imageSrc={null} imageAlt="">
      <div>
        <motion.h1
          className="display-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          RESEARCH
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {publications.map((pub, idx) => (
              <motion.div key={idx} variants={itemVariants} className="minimal-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                  <span style={{ color: '#fff' }}>{pub.type}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{pub.year}</span>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.4, marginBottom: '0.5rem', color: '#fff' }}>
                  {pub.title}
                </h2>

                <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                  in {pub.featured}
                </p>

                <p className="body-text" style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#888' }}>
                  {pub.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: '#ffffff', letterSpacing: '1px' }}>
                    AUTHORS: {pub.authorship}
                  </span>
                  <a href={pub.link} target="_blank" rel="noreferrer" className="minimal-button" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>
                    view record
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Publications;
