import LinkIcon from "./LinkIcon";

export default function SiteLogo({color}: {color: string}) {
    return (
        <div className={"flex flex-row items-center gap-[8px]"}>
            <LinkIcon fill={color}/>
            <span className={`text-2xl font-bold text-${color}`}>URL Shortener</span>
        </div>
    )
}