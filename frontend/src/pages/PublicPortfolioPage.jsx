import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioThemeRenderer from '../components/portfolio/PortfolioThemes';
import { sampleResume } from '../utils/sampleData';

export default function PublicPortfolioPage() {
  const { username } = useParams();
  const [portfolioData, setPortfolioData] = useState(sampleResume);

  useEffect(() => {
    // Check local stored resume data or fallback to sample
    const saved = localStorage.getItem('ai_user_resumes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) setPortfolioData(parsed[0]);
      } catch (e) {}
    }
  }, [username]);

  return (
    <div>
      <PortfolioThemeRenderer themeId="developer" data={portfolioData} username={username} />
    </div>
  );
}
