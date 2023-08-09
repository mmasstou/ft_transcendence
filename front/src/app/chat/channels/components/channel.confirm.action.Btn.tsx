interface ChanneLConfirmActionBtnProps {onClick : ()=>void }
export default function ChanneLConfirmActionBtn(
    {onClick}: ChanneLConfirmActionBtnProps
) {
    return <button
        onClick={onClick}
        className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-full">
        confirm
    </button>
}