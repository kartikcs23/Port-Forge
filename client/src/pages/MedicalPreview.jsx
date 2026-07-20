import React from 'react';
import { MedicalTheme } from '../components/themes/MedicalTheme';
import { mockProfile, mockRepos } from './mockPortfolioData';

export const MedicalPreview = () => (
  <MedicalTheme rootUser={null} profile={mockProfile} repos={mockRepos} />
);
