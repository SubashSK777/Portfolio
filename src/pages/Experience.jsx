import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Experience = () => {
    return (
        <PageTransition imageSrc={null} imageAlt="">
            <div>
                <motion.h1
                    className="display-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    WORK
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="minimal-card" style={{ borderBottom: 'none' }}>
                        <h2 className="section-title">AI/ML Developer</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>
                            <span style={{ color: '#fff' }}>GENPLUS INNOVATIONS PRIVATE LIMITED</span>
                            <span style={{ color: '#ffffff' }}>&lt; 1 YEAR EXPERIENCE</span>
                        </div>

                        <p className="body-text" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                            Spearheading the research, development, and integration of intelligent AI and machine learning systems.
                            Executing adaptive problem-solving heuristics utilizing advanced Python ecosystems and modern machine learning frameworks.
                        </p>

                        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: '#888', letterSpacing: '2px' }}>ROLE</strong>
                                <span className="body-text" style={{ fontSize: '0.9rem' }}>Research & Development</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: '#888', letterSpacing: '2px' }}>CORE</strong>
                                <span className="body-text" style={{ fontSize: '0.9rem' }}>Machine Learning</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: '#888', letterSpacing: '2px' }}>FOCUS</strong>
                                <span className="body-text" style={{ fontSize: '0.9rem' }}>System Integration</span>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Experience;
