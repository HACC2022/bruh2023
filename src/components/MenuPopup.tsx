import Popup from "reactjs-popup";
import SettingIcon from "../assets/SettingIcon";
import {removeData} from "../firebase/Firestore";

import React, {useState} from "react";
import {toast} from "react-toastify";

export default function MenuPopup({
                                      userid,
                                      element,
                                      setEditing,
                                      setEditIndex,
                                      editing,
                                      index
                                  }: { userid: string | undefined, element: string, setEditing: React.Dispatch<React.SetStateAction<boolean>>, setEditIndex: any, editing: boolean, index: number }) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    if (!isOpen) {
        return <button className="p-4" onClick={() => setIsOpen(true)}><SettingIcon/></button>
    }

    return (
        <div id={"pop" + element}>
            <Popup
                trigger={() => (<button className="p-4"><SettingIcon/></button>)}
                offsetX={-20}
                arrow={false}
                position="left top"
                closeOnDocumentClick
                keepTooltipInside={true}
            >
                <div className={"bg-white rounded p-2 flex flex-col shadow"}>
                    <button
                        onClick={() => {
                            setEditing(true);
                            setEditIndex(index);
                            setIsOpen(false)
                            toast.info("You are editing the short URL!")
                        }}>Edit
                    </button>
                    <hr className={"border-gray-300"}/>
                    <button disabled={editing} onClick={() => {
                        removeData(userid, element)
                        setIsOpen(false)
                        toast.success("Short URL was deleted!")
                    }}>Delete
                    </button>
                </div>
            </Popup>
        </div>

    )
}



