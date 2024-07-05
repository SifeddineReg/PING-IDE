import React from 'react';
import { useLocation } from 'react-router-dom';
import { HTMLAttributes as Atts } from 'react';

import './navbar.css'

interface NavbarProps {
  open_file: () => void;
  open_folder: () => void;
}

declare module "react" {
  interface InputHTMLAttributes<T> extends Atts<T> {
      webkitdirectory?: string;
      directory?: string;
  }
}

export const Navbar = ({open_file, open_folder}: NavbarProps) => {
  const location = useLocation();

  const save = () => {
    // mimic ctrl-s
    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <nav>
      <div className="left">
        {location.pathname === '/' && (
          <>
            <div className="file">
              <button className="nav_button">File</button>
              <div className="dropdown-content">
                <label htmlFor='file' onClick={open_file}>Open file</label>          
                <label htmlFor='folder' onClick={open_folder}>Open Folder</label>
                <input type='file' id="folder" className='folder input' webkitdirectory='' directory=''/>
                <a className='save' onClick={save}>Save</a>
              </div>
            </div>

            <div className="run">
              <button className="nav_button">Run</button>
              <div className="dropdown-content">
                <a id="1" href="#">Run file</a>
              </div>
            </div>
            <div className="terminal">
              <button className="nav_button">Terminal</button>
              <div className="dropdown-content">
                <a id="2" href="#">Clear terminal</a>
              </div>
            </div>
            <div className="help">
              <button className="nav_button">Help</button>
              <div className="dropdown-content">
                <a id="1" href="/docs">Docs</a>
              </div>
            </div>
          </>
        )}
        {(location.pathname.startsWith('/profile') 
          || location.pathname === '/leaderboard' 
          || location.pathname === '/tasks') 
        && (
          <>
            <div className="ide">
              <a className="nav_button ide" href='/'>IDE</a>
            </div>
            <div className="help">
              <button className="nav_button">Help</button>
              <div className="dropdown-content">
                <a id="1" href="#">Docs</a>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="right">
        <div className="profile_user">
          <button className="nav_button">Sifeddine &nbsp; &#9660;</button>
          <div className="dropdown-content">
            <a id="2" href="/leaderboard">Leaderboard</a>
            <a id="3" href="#">Disconnect</a>
          </div>
        </div>
      </div>
    </nav>
  );
};