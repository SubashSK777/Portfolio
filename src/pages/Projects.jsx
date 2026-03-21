import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const hardcodedProjects = [
    {
        id: 0,
        name: 'End-to-End-Sales-Dashboard-and-SQL-Analysis',
        html_url: 'https://github.com/SubashSK777/End-to-End-Sales-Dashboard-and-SQL-Analysis',
        description: 'Comprehensive end-to-end sales dashboard providing actionable insights through detailed SQL analysis and interactive visualization metrics.',
        language: 'SQL / Power BI / Data Analysis',
        stargazers_count: '—'
    },
    {
        id: 1,
        name: 'Customer-Churn-Prediction',
        html_url: 'https://github.com/SubashSK777/Customer-Churn-Prediction',
        description: 'Machine learning classification project identifying high-risk churn customers in telecom sectors with strategic insights and retention modelling.',
        language: 'Python / ML / Scikit-Learn',
        stargazers_count: '—'
    },
    {
        id: 2,
        name: 'House-Price-Prediction',
        html_url: 'https://github.com/SubashSK777/House-Price-Prediction',
        description: 'Advanced regression modelling to predict residential real estate prices based on diverse structural and geographical features.',
        language: 'Python / Regression / Pandas',
        stargazers_count: '—'
    },
    {
        id: 3,
        name: 'IEEE-Paper-Builder',
        html_url: 'https://github.com/SubashSK777/IEEE-Paper-Builder',
        description: 'Automated document processing platform engineered to format academic research papers according to strict IEEE standards using React and Google Docs integrations.',
        language: 'React / Node.js / Python',
        stargazers_count: '—'
    },
    {
        id: 4,
        name: 'Multi-Agent-AI',
        html_url: 'https://github.com/SubashSK777/Multi-Agent-AI',
        description: 'Sophisticated Multi-Agent System (MAS) architecture utilizing CrewAI for collaborative task management and advanced problem solving.',
        language: 'Python / CrewAI / LLMs',
        stargazers_count: '—'
    },
    {
        id: 5,
        name: 'SkillMatch-AI_Resume_Analyzer',
        html_url: 'https://github.com/SubashSK777/SkillMatch-AI_Resume_Analyzer',
        description: 'Neural NLP intelligence engine evaluating resume quality, performing LinkedIn scraping, and calculating skill gaps for optimized job matching.',
        language: 'Python / Selenium / OpenAI',
        stargazers_count: '—'
    },
    {
        id: 6,
        name: 'Med_AI',
        html_url: 'https://github.com/SubashSK777/Med_AI',
        description: 'Medical diagnostic intelligence system leveraging Azure CV and clustering algorithms to decode prescriptions and suggest pathological pathways.',
        language: 'Python / Flask / Azure / ML',
        stargazers_count: '—'
    }
];

const Projects = () => {

    return (
        <PageTransition imageSrc={null} imageAlt="">
            <div>
                <motion.h1
                    className="display-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    PROJECTS
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {hardcodedProjects.map((repo, i) => (
                            <div key={repo.id} className="minimal-card" style={{ display: 'block', textDecoration: 'none' }}>
                                <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    <h2 className="section-title" style={{ marginBottom: '1rem', color: '#fff' }}>{repo.name}</h2>
                                </a>
                                <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    {repo.description}
                                </p>
                                <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: '#ffffff', letterSpacing: '2px', alignItems: 'center' }}>
                                    <span>{repo.language}</span>
                                    <a href="#" target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', padding: '0.5rem 1rem', border: '1px solid var(--border-color)', color: '#fff', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}>
                                        VISIT
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Projects;
