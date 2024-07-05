import React, { useState } from 'react';
import './profile_manager.css';
import defaultPic from '../../assets/default_pic.png';
import Olympic from '../../assets/olympics_pictograms.jpg';
import Foot from '../../assets/foot.jpg';
import Tennis from '../../assets/roland-garros-tournament-profile.jpg';
import data from '../../assets/data.json';

interface ProfileProps {
  user: {
    name: string;
    email: string;
    github: string;
  };
}

export const Profile_Man = ({ user }: ProfileProps) => {
  // State hooks
  const [deadline, setDeadline] = useState('');
  const [tournamentStatus, setTournamentStatus] = useState('stopped');
  const [selectedTheme, setSelectedTheme] = useState('');

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
    data.deadline = event.target.value;
  };

  const startTournament = () => {
    setTournamentStatus('started');
  };

  const stopTournament = () => {
    setTournamentStatus('stopped');
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let themeUrl
    if (event.target.value === 'Olympic') {
        themeUrl = Olympic;
    } else if (event.target.value === 'Football') {
        themeUrl = Foot;
    } else if (event.target.value === 'Tennis') {
        themeUrl = Tennis;
    } else {
        themeUrl = '';
    }

    localStorage.setItem('current_theme', event.target.value);
    
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
        background-image: url('${themeUrl}'); 
        background-size: cover; 
        background-position: center center; 
        z-index: -1; 
    }`;

    setSelectedTheme(event.target.value);

    // Update the theme in the data.json file persistently
    data.current_theme = event.target.value;
  };

  return (
    <>
      <div className="profile-card">
        <div className='profile'>
          <div className="profile-image">
            <img src={defaultPic} alt="Profile Picture"/>
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Github: <a href={`https://github.com/${user.github}`}>{`https://github.com/${user.github}`}</a></p>
          </div>
        </div>
      </div>

      <div className="setting">
        <div className="setting-time">
          <p>Set Deadline:</p>
          <input type='datetime-local' value={deadline} onChange={handleDeadlineChange}></input>
          <br></br>
          <div className="buttons">
            <button onClick={startTournament}>Start</button>
            <button onClick={stopTournament}>Stop</button>
          </div>
          
        </div>
        <div className="setting-theme">
          <p>Set Theme:</p>
          <select value={selectedTheme} onChange={handleThemeChange}>
            {data.themes.map((theme) => (
              <option key={theme.name} value={theme.name}>{theme.name}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}