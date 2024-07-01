import './profile_manager.css'

export const Profile_Man = () =>{
  return (
    <>
    <div className="navbar">
        <div className="nav-left">
            <a href="#">IDE</a>
            <a href="#">Leaderboard</a>
            <a href="#">Help</a>
        </div>
        <div className="nav-right">
            <select>
                <option value="sifeddine">Sifeddine</option>
            </select>
        </div>
    </div>

    <div className="profile-card">
        <div className='profile'>
        <div className="profile-image">
            <img src="https://via.placeholder.com/100" alt="Profile Picture"/>
        </div>
        <div className="profile-info">
          <h1>Sifeddine Regragui</h1>
          <p>Email: sifeddine.regragui@epita.fr</p>
          <p>Github: <a href="https://github.com/SifeddineReg">https://github.com/SifeddineReg</a></p>
        </div>
        </div>
    </div>

    <div className="setting">
        <div className="setting-time">
            <p>Set Deadline:</p>
            <input type='datetime-local'></input>
            <br></br>
            <button>Start</button>
            <button>Stop</button>
        </div>
        <div className="setting-theme">
            <p>Set Theme:</p>
            <select>
                <option value=""></option>
            </select>
            <br></br>
            <button>Confirm</button>
        </div>
    </div>

    </>
  )
}
