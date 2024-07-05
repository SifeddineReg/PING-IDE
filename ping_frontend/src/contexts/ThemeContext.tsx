import React, { createContext, useContext, useEffect } from 'react';
import data from '../assets/data.json';
import Olympic from '../assets/olympics_pictograms.jpg';
import Foot from '../assets/foot.jpg';
import Tennis from '../assets/roland-garros-tournament-profile.jpg';

const ThemeContext = createContext(data.themes.find(theme => theme.name === data.current_theme));

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeName = localStorage.getItem('current_theme') || data.current_theme;
  const currentTheme = data.themes.find(theme => theme.name === themeName);

  useEffect(() => {
    let theme;
    if (currentTheme && currentTheme.name === 'Olympic') {
        theme = Olympic;
    } else if (currentTheme && currentTheme.name === 'Football') {
        theme = Foot;
    } else if (currentTheme && currentTheme.name === 'Tennis') {
        theme = Tennis;
    } else {
        theme = '';
    }

    const styleId = 'dynamic-background-style';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `body::before { 
      content: ''; 
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background-image: url(${theme}); 
      background-size: cover; 
      background-repeat: no-repeat; 
      background-position: center; 
      z-index: -1; 
    }`;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
};