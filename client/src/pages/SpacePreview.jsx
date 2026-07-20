import React from 'react';
import { SpaceTheme } from '../components/themes/SpaceTheme';
import { mockProfile, mockRepos } from './mockPortfolioData';

export const SpacePreview = () => (
  <SpaceTheme rootUser={null} profile={mockProfile} repos={mockRepos} />
);
