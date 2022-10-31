import React, {useState} from 'react';
import {auth} from "../App";
import {sendSignInLinkToEmail} from "firebase/auth";
import LoadingIcon from "../assets/LoadingIcon";
import {toast} from 'react-toastify';

const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
};

export default function Authentication() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <>
            <div className={"flex justify-center text-center"}>
                <span className={"font-medium text-2xl mb-[24px]"}>Authentication</span>
            </div>
            <form
                className={"flex flex-col gap-4 m-auto max-w-full w-[22em]"}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (email === "") return toast.error("You did not input an email address!")

                    setLoading(true);
                    sendSignInLinkToEmail(auth, email, actionCodeSettings)
                        .then(() => {
                            window.localStorage.setItem('emailForSignIn', email)
                            toast.info("Check your email for a sign-in link!")
                        })
                        .catch(() => {
                            setLoading(false);
                            toast.error("An error occurred while sending sign-in email.")
                        })
                }}
            >
                <label htmlFor={"email"}>Email</label>
                <input
                    id={"email"}
                    className={"flex p-2 border-2 border-c-gray-300 rounded"}
                    placeholder={"example@email.com"}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type={"email"}
                />
                <button
                    className={"max-h-[45px] rounded px-[16px] py-[8px] bg-blue-500 font-medium w-full text-center text-white"}
                    type={"submit"} disabled={loading}>
                    {loading ? <LoadingIcon fill={"white"}/> : "Login"}
                </button>
            </form>
        </>
    )
}