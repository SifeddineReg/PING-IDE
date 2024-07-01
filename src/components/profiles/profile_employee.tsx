import './profile_employee.css'

export const Profile_Emp = () => {
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

    <div className="stats">
        <div className="stat">
            <h2>148 ms</h2>
            <p>Avg Runtime</p>
        </div>
        <div className="stat">
            <h2>78.6%</h2>
            <p>Code Tidiness</p>
        </div>
        <div className="stat">
            <h2>15</h2>
            <p>Total Taches</p>
        </div>
        <div className="stat">
            <h2>150</h2>
            <p>Total Warnings</p>
        </div>
        <div className="stat">
            <h2>66.5%</h2>
            <p>Avg Test Coverage</p>
        </div>
    </div>

    </>
  )
}
