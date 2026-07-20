import React from 'react';
import { CinematicTheme } from '../components/themes/CinematicTheme';
import { mockProfile, mockRepos } from './mockPortfolioData';

export const CinematicPreview = () => (
  <CinematicTheme rootUser={null} profile={mockProfile} repos={mockRepos} />
);
