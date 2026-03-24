import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Contact = () => {
    return (
        <PageTransition imageSrc={null} imageAlt="">
            <div>
                <motion.h1
                    className="display-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    CONTACT
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="minimal-card" style={{ borderBottom: 'none' }}>
                        <h2 className="section-title">Communicate</h2>
                        <p className="body-text" style={{ marginBottom: '3rem' }}>
                            Initiate a secure connection to my personal mainframe. I am currently open for collaborative research and developmental roles within the Grid.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <a href="mailto:subashsk11831@gmail.com" className="minimal-card contact-item">
                                <Mail size={28} color="#ffffff" style={{ flexShrink: 0 }} />
                                <div style={{ overflow: 'hidden' }}>
                                    <strong style={{ display: 'block', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '4px', marginBottom: '0.6rem' }}>E-MAIL PROTOCOL</strong>
                                    <span className="body-text" style={{ fontSize: '1.4rem', color: '#fff', wordBreak: 'break-all' }}>subashsk11831@gmail.com</span>
                                </div>
                            </a>

                            <a href="https://wa.me/918148826206" target="_blank" rel="noreferrer" className="minimal-card contact-item" style={{ borderBottom: 'none' }}>
                                <MessageSquare size={28} color="#ffffff" style={{ flexShrink: 0 }} />
                                <div style={{ overflow: 'hidden' }}>
                                    <strong style={{ display: 'block', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '4px', marginBottom: '0.6rem' }}>WHATSAPP</strong>
                                    <span className="body-text" style={{ fontSize: '1.4rem', color: '#fff' }}>(+91) 8148826206</span>
                                </div>
                            </a>

                        </div>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Contact;
