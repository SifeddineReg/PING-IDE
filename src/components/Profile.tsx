import { Profile_Emp } from "./profiles/profile_employee";
import { Profile_Man } from "./profiles/profile_manager";

export const Profile = () => {
    // if user role is employee then return Profile_Emp
    // if user role is manager then return Profile_Man
    // data will be fetched with a function later on for now just return the component

    return (
        <>
            <Profile_Emp />
        </>
    )
}
        