import {auth} from "../App";
import {signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SiteLogo from "../assets/SiteLogo";
import Analytics from "../firebase/Analytics";

export default function NavBar() {
    const navigate = useNavigate();

    return (
        <div className={"bg-cyan-500 w-full h-auto"}>
            <div className={"flex flex-row justify-between items-center px-[24px] py-[15px] "}>
                <SiteLogo color={"white"}/>
                <div
                    className={"flex flex-row items-center box-border border-white border-2 rounded px-[16px] py-[8px]"}>
                    <button className={"items-center text-white text-xl"} type= "button"
                            onClick={() => {
                                Analytics().user_logout();
                                signOut(auth).then(() => navigate('/'))
                            }}>Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
