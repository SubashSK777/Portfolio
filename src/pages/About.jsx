import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Coffee } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const About = () => {
    return (
        <PageTransition imageSrc="/avatar2.png" imageAlt="Tron Avatar 2 Side Profile" imageObjectFit="contain" scaleImage={true}>
            <div>
                <motion.h1
                    className="display-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    PROFILE
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="minimal-card">
                        <h2 className="section-title">Background</h2>
                        <p className="body-text">
                            I am a <a href="https://codeforces.com/profile/SubashSK" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--text-main)', textUnderlineOffset: '4px' }}>Competitive Programmer</a> and Machine Learning aficionado.
                            My core drive focuses on understanding algorithms and translating that into scalable pipelines and generative models.
                        </p>
                    </div>

                    <div className="minimal-card">
                        <h2 className="section-title">Education</h2>
                        <p className="body-text">
                            <strong>B.Tech in Artificial Intelligence &amp; Data Science</strong><br />
                            VSB College of Engineering Technical Campus<br />
                            Anna University Affiliate
                        </p>
                    </div>

                    <div className="minimal-card">
                        <h2 className="section-title">Technical Expertise</h2>
                        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                            <div>
                                <strong style={{ color: '#fff', fontSize: '0.9rem', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Languages</strong>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Terminal size={22} color="var(--text-main)" /> <span className="body-text" style={{ fontSize: '1.1rem' }}>Python</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Database size={22} color="var(--text-main)" /> <span className="body-text" style={{ fontSize: '1.1rem' }}>SQL</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Coffee size={22} color="var(--text-main)" /> <span className="body-text" style={{ fontSize: '1.1rem' }}>Java</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <strong style={{ color: '#fff', fontSize: '0.9rem', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Disciplines</strong>
                                <p className="body-text" style={{ fontSize: '1.1rem' }}>Generative AI, Machine Learning Pipelines, Vector Databases</p>
                            </div>
                        </div>
                    </div>

                    <div className="minimal-card" style={{ borderBottom: 'none' }}>
                        <h2 className="section-title">Personal Metrics</h2>
                        <p className="body-text">
                            Beyond engineering, I optimize my personal neural weights by reading psychology literature and maintaining an aggressive physical fitness protocol.
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default About;
