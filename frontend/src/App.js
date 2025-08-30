
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import SkillsPage from './SkillsPage';
import ProjectsPage from './ProjectsPage';
import WorkExperiencePage from './WorkExperiencePage';
import EducationPage from './EducationPage';
import SocialLinksPage from './SocialLinksPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/work-experience" element={<WorkExperiencePage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/social-links" element={<SocialLinksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
