import React from 'react';
import { BrutalistTheme } from '../components/themes/BrutalistTheme';
import { mockProfile, mockRepos } from './mockPortfolioData';

export const BrutalistPreview = () => (
  <BrutalistTheme rootUser={null} profile={mockProfile} repos={mockRepos} />
);
