"use client";
import { useRef, useState, useEffect} from "react";
import { FaTimes, FaInfoCircle, FaCheck } from 'react-icons/fa';

export interface userInfo {
    // username: string,
    // validusername: boolean,
    getUserInfo: (username: string, validusername: boolean) => void,
    
}
 
const USER_REGEX = /^[A-z][A-z0-9-_]{5,7}$/;

const UserInput = ({ getUserInfo }: userInfo) : JSX.Element => {

    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);

    const [user, setUser] = useState<string>('');
    const [validName, setValidName] = useState<boolean>(false);
    const [userFocus, setUserFocus] = useState<boolean>(false);

    const [errMsg, setErrMsg] = useState<string>('');
    // const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userRef.current != null){
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        setErrMsg('');
    }, [user]);

    getUserInfo(user, validName);

  return (
    <div className="text-white md:w-1/2">
        <p ref={errRef} className={errMsg ? "bg-pink-300 text-red-700 font-bold p-1 mb-1": "hidden"} aria-live="assertive">{errMsg}</p>
        <form className="flex flex-col justify-evenly  grow-1 pb-1">
            <label htmlFor="username">
                <span className={validName ? "text-secondary ml-1" : "hidden"}>
                    <FaCheck />
                </span>
                <span className={validName || !user ? 'hidden' : "text-red-500 ml-1"}>
                    <FaTimes />
                </span>
            </label>
            <div className="flex flex-col justify-between gap-2 items-center">
                <input 
                    placeholder="USERNAME"
                    className="bg-transparent border rounded-md px-2 outline-none w-full py-1"
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                /> 
                <p id="uidnote" 
                   className={userFocus && user && !validName ? "mr-1 text-[1em] font-light bg-black/50 px-3 py-2 rounded-md"
                   : "hidden"}
                >
                    <FaInfoCircle />
                    6-8 characters. <br />
                    Only Letters, Numbers, Undersocores, Hyphen allwed. 
                </p>
            </div>
        </form>
    </div>
  )
}

export default UserInput