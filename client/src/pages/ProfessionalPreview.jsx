import React from 'react';
import { ProfessionalTheme } from '../components/themes/ProfessionalTheme';
import { mockProfile, mockRepos } from './mockPortfolioData';

export const ProfessionalPreview = () => (
  <ProfessionalTheme rootUser={null} profile={mockProfile} repos={mockRepos} />
);
