import {QRCode} from "react-qrcode-logo";
import Popup from "reactjs-popup";
import {toast} from "react-toastify";
import React, {useState} from "react";

export default function QrCodePopup({url, id}: {url:string, id:string}){

    const [isOpen, setIsOpen] = useState<boolean>(true);

    if (!isOpen) {
        return <button
            className={"max-w-[98px] w-[70px] border mx-2 rounded border-[2px] border-blue-400 text-blue-500 text-sm font-semibold"}
            onClick={() => setIsOpen(true)}
        >OPEN</button>
    }

    function download(){
        let canvas: HTMLCanvasElement | null = document.querySelector("#i" + id)
        let anchor = document.createElement("a")
        if (canvas == null) return
        console.log("Downloading png")
        anchor.href = canvas.toDataURL("image/png")
        anchor.download = `${id}.png`
        anchor.click()
        toast.success(`Downloaded QR code as ${id}.png`)
        setIsOpen(false)
    }

    async function copy() {
        let canvas: HTMLCanvasElement | null = document.querySelector("#i" + id)
        if (canvas == null) return
        const blob = await imageToBlob(canvas)
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(() =>
            toast.success("QR Code was copied to your clipboard!")
        ).catch(() =>
            toast.error("An error occurred, please try again")
        )
        setIsOpen(false)
    }

    function imageToBlob(canvas:HTMLCanvasElement) {
        return new Promise<Blob>(resolve => {
                canvas.toBlob((blob) => {
                    // here the image is a blob
                    if (blob == null) return;
                    resolve(blob)
                }, "image/png", 0.75);
        })
    }

    return (
        <Popup
            trigger={<button
            className={"max-w-[98px] w-[70px] border mx-2 rounded border-[2px] border-blue-400 text-blue-500 text-sm font-semibold"}
            >OPEN</button>}
            position={['bottom center', 'top center', 'right top']}
            keepTooltipInside
            arrowStyle={{color: "rgb(200,200,200)"}}
            nested={true}
        >
            <div
            className={"border shadow-lg bg-white p-4 rounded"}>
                    <div className={"border border-black border-[5px] rounded-lg"}>
                        <QRCode
                            enableCORS={true}
                            value={url}
                            size={256}
                            ecLevel={"H"}
                            id={"i"+id}
                            logoImage={"data:image/png;base64,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"}
                            logoOpacity={1}
                            logoWidth={50}
                            removeQrCodeBehindLogo={true}
                            qrStyle={"dots"}
                            eyeRadius={5}
                        />
                    </div>
                <div className={"flex-row text-center bg-white text-white font-sans mt-2"}>
                    <button
                        className={"mx-1 bg-blue-500 rounded py-1 px-2 hover:bg-blue-600"}
                        onClick={() => download()}
                    >Download</button>
                    <button
                        className={"mx-1 bg-blue-500 rounded py-1 px-2 hover:bg-blue-600"}
                        onClick={()=> copy()}
                    >Copy</button>

                </div>
            </div>
        </Popup>
    )
}