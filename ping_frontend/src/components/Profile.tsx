// Import necessary hooks and components
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Profile_Emp } from "./profiles/profile_employee";
import { Profile_Man } from "./profiles/profile_manager";
import { Navbar } from "./navbar/navbar";

import db from '../assets/data.json';

// import {launch_DB} from '../database/database';

// Import the database functions
// import { getEmploye } from '../database/database';

export const Profile = () => {
    const { id } = useParams()
    const [user, setUser] = useState<{ 
        id: number; 
        name: string; 
        password: string; 
        poste: number; 
        runtime: number; 
        code_tidiness: number; 
        total_tache: number; 
        total_warnings: number; 
        test_coverage: number; 
        email: string; github: 
        string; nb_file: 
        number; 
    } | null>(null);

    useEffect(() => {
        const user = db.users.find((user: any) => `${user.id}` === id);
        if (user)
            setUser(user);

        console.log(user);
    }, [id]);

    function empty() { }

    return (
        <>
            <Navbar open_file={empty} open_folder={empty} />
            {user?.poste === 0 && <Profile_Emp user={user} />}
            {user?.poste === 1 && <Profile_Man user={user} />}
        </>
    );
}