import { HTMLAttributes as Atts } from 'react'

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
  return (
    <nav className="navbar">
      <div className="left">
        <div className="file">
          <button className="nav_button">File</button>
          <div className="dropdown-content">
            <label htmlFor='file'>Open file</label>
            <input type="file" className='file input' id="file" onChange={open_file}/>
            <label htmlFor='folder'>Open Folder</label>
            <input type="file" className='folder input' id="folder" onChange={open_folder} webkitdirectory="" directory=""/>
            <a id="3" href="#">Save</a>
          </div>
        </div>

        <div className="run">
          <button className="nav_button">Run</button>
          <div className="dropdown-content">
            <a id="1" href="#">Run file</a>
            <a id="2" href="#">Run project</a>
          </div>
        </div>

        <div className="terminal">
          <button className="nav_button">Terminal</button>
          <div className="dropdown-content">
            <a id="1" href="#">New terminal</a>
            <a id="2" href="#">Clear terminal</a>
          </div>
        </div>

        <div className="help">
          <button className="nav_button">Help</button>
          <div className="dropdown-content">
            <a id="1" href="#">Docs</a>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="profile">
            <button className="nav_button">Sifeddine &nbsp; &#9660;</button>
            <div className="dropdown-content">
              <a id="1" href="#">Profile</a>
              <a id="2" href="#">Leaderboard</a>
              <a id="3" href="#">Disconnect</a>
            </div>
        </div>
      </div>
    </nav>
  )
}
