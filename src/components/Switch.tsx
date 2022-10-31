export default function Switch(
    {label, state, onChange}: { label: string, state: boolean, onChange: () => any }
) {
    return (
        <label className={"flex flex-row justify-center items-center py-[6px] gap-[10px]"}>
            <input type={"checkbox"} onChange={onChange} checked={state} className={"w-4 h-4"}/>
            <span className={"text-c-gray-500 font-bold"}>{label}</span>
        </label>
    )
}