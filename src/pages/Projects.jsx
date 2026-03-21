import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const hardcodedProjects = [
    {
        id: 0,
        name: 'Builder-Suite',
        html_url: 'https://github.com/SubashSK777/Builder-Suite',
        description: 'A comprehensive suite of powerful development and deployment tools designed to streamline the software lifecycle, enhance productivity, and provide advanced architectural integrations.',
        language: 'React / Node.js / Python',
        stargazers_count: '—'
    },
    {
        id: 1,
        name: 'Multi-Agent-AI',
        html_url: 'https://github.com/SubashSK777/Multi-Agent-AI',
        description: 'An advanced Multi-Agent System (MAS) leveraging CrewAI to integrate System 2 thinking. It enables AI to handle complex decision-making through intuitive and analytical processes for scalable, collaborative AI operations.',
        language: 'Python / CrewAI',
        stargazers_count: '—'
    },
    {
        id: 2,
        name: 'SkillMatch-AI_Resume_Analyzer',
        html_url: 'https://github.com/SubashSK777/SkillMatch-AI_Resume_Analyzer',
        description: 'An advanced AI application utilizing LLMs and OpenAI for comprehensive resume analysis. It dynamically extracts LinkedIn data via Selenium, evaluates strengths, identifies weaknesses, and offers personalized job title recommendations.',
        language: 'Python / OpenAI / Selenium',
        stargazers_count: '—'
    },
    {
        id: 3,
        name: 'Med_AI',
        html_url: 'https://github.com/SubashSK777/Med_AI',
        description: 'An AI-driven medical assistance application that utilizes machine learning to cluster symptoms and offer accurate diagnostics based on user input. Integrated with Azure Computer Vision API for handwritten text extraction.',
        language: 'Python / Machine Learning / Azure CV',
        stargazers_count: '—'
    },
    {
        id: 4,
        name: 'Racing-CV',
        html_url: 'https://github.com/SubashSK777/Racing-CV',
        description: 'A dedicated Computer Vision program to play high-speed racing games using hand gestures instead of a mouse or keyboard. It utilizes OpenCV, CVZone, and Pynput for versatile control scheme adaptation.',
        language: 'Python / OpenCV / CVZone / Pynput',
        stargazers_count: '—'
    },
    {
        id: 5,
        name: 'Multi-Agent-Market-Researcher',
        html_url: 'https://github.com/SubashSK777/Multi-Agent-Market-Researcher',
        description: 'A comprehensive financial and market analysis tool that employs multiple specialized AI agents (CrewAI, Langchain, Google Gemini Flash). It autonomously gathers, analyzes, and compiles internet data into cohesive factual reports.',
        language: 'Python / CrewAI / Langchain / Gemini',
        stargazers_count: '—'
    },
    {
        id: 6,
        name: 'House-Price-Prediction',
        html_url: 'https://github.com/SubashSK777/House-Price-Prediction',
        description: 'A machine learning model to predict house prices using various regression techniques.',
        language: 'Python / Jupyter Notebook',
        stargazers_count: '—'
    },
    {
        id: 7,
        name: 'Customer-Churn-Prediction',
        html_url: 'https://github.com/SubashSK777/Customer-Churn-Prediction',
        description: 'An analytical model determining customer churn to provide insights and improve retention strategies.',
        language: 'Python / Machine Learning',
        stargazers_count: '—'
    },
    {
        id: 8,
        name: 'End-to-End-Sales-Dashboard-and-SQL-Analysis',
        html_url: 'https://github.com/SubashSK777/End-to-End-Sales-Dashboard-and-SQL-Analysis',
        description: 'A comprehensive end-to-end sales dashboard providing actionable insights through detailed SQL analysis.',
        language: 'SQL / Data Visualization',
        stargazers_count: '—'
    },
    {
        id: 9,
        name: 'IEEE-Paper-Builder',
        html_url: 'https://github.com/SubashSK777/IEEE-Paper-Builder',
        description: 'A tool to generate and format research papers following IEEE standards. Streamlines the document creation process.',
        language: 'Python',
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
