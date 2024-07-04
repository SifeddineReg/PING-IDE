// Import necessary hooks and components
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Profile_Emp } from "./profiles/profile_employee";
import { Profile_Man } from "./profiles/profile_manager";
import { Navbar } from "./navbar/navbar";

// import {launch_DB} from '../database/database';

// Import the database functions
// import { getEmploye } from '../database/database';

export const Profile = () => {
    const { id } = useParams()
    const [userRole, setUserRole] = useState(null);

    // useEffect(() => {
    //     const checkUserRole = async () => {
    //         const user = await getEmploye(id);
    //         if (user) {
    //             setUserRole(user.poste);
    //         } else {
    //             console.error('User not found');
    //         }
    //     };

    //     checkUserRole();
    // }, [id]);

    function empty() { }

    return (
        <>
            <Navbar open_file={empty} open_folder={empty} />
            {userRole === 'employee' && <Profile_Emp />}
            {userRole === 'manager' && <Profile_Man />}
        </>
    );
}