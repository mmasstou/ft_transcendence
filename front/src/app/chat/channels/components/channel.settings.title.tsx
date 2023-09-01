import { IoChevronBackOutline } from "react-icons/io5";
import Button from "../../components/Button";

interface channeLSettingsTitleProps {
    title : string
    OnBack: () => void;
}
export default function ChanneLSettingsTitle(
    {title, OnBack}: channeLSettingsTitleProps) {
    return <div className=" flex flex-row items-center justify-start gap-3">
    <Button
        icon={IoChevronBackOutline}
        outline
        size={21}
        labelsize={8}
        onClick={OnBack}
    />
    <h3 className="capitalize text-md text-[#FFFFFF] font-semibold"> {title} </h3>
</div>
}