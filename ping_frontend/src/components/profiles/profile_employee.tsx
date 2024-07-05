import './profile_employee.css';
import defaultPic from '../../assets/default_pic.png';

interface ProfileProps {
    user: {
        name: string;
        email: string;
        github: string;
        runtime: number;
        code_tidiness: number;
        total_tache: number;
        total_warnings: number;
        test_coverage: number;
    };
}

export const Profile_Emp = ({ user }: ProfileProps) => {
  return (
    <>
      <div className="profile-card">
        <div className="profile">
          <div className="profile-image">
            <img src={defaultPic} alt="Profile Picture" />
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Github: <a href={`https://github.com/${user.github}`}>{`https://github.com/${user.github}`}</a></p>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat stat-blue">
          <h2>{user.runtime} ms</h2>
          <p>Avg Runtime</p>
        </div>
        <div className="stat stat-black">
          <h2>{user.code_tidiness}%</h2>
          <p>Code Tidiness</p>
        </div>
        <div className="stat stat-red">
          <h2>{user.total_tache}</h2>
          <p>Total Taches</p>
        </div>
        <div className="stat stat-yellow">
          <h2>{user.total_warnings}</h2>
          <p>Total Warnings</p>
        </div>
        <div className="stat stat-green">
          <h2>{user.test_coverage}%</h2>
          <p>Avg Test Coverage</p>
        </div>
      </div>
    </>
  );
};