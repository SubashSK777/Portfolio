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

                            <a href="mailto:subashsk11831@gmail.com" className="minimal-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem 0', textDecoration: 'none' }}>
                                <div style={{ padding: '1.2rem', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex' }}>
                                    <Mail size={24} color="#ffffff" />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#888', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>E-MAIL PROTOCOL</strong>
                                    <span className="body-text" style={{ fontSize: '1.2rem', color: '#fff' }}>subashsk11831@gmail.com</span>
                                </div>
                            </a>

                            <a href="https://wa.me/918148826206" target="_blank" rel="noreferrer" className="minimal-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem 0', textDecoration: 'none', borderBottom: 'none' }}>
                                <div style={{ padding: '1.2rem', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex' }}>
                                    <MessageSquare size={24} color="#ffffff" />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#888', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>WHATSAPP // DIRECT LINK</strong>
                                    <span className="body-text" style={{ fontSize: '1.2rem', color: '#fff' }}>(+91) 8148826206</span>
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
