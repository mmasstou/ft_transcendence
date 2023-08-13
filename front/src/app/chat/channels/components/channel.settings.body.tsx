import { IoChevronBackOutline } from "react-icons/io5";
import Button from "../../components/Button";
import PermissionDenied from "./channel.settings.permissiondenied";

interface channeLSettingsBodyProps {
    children: React.ReactNode;
    title?: string;
    OnBack?: () => void;
    footer?: React.ReactNode;
    HasPermission?: boolean;
}
export default function ChanneLSettingsBody(
    { children, title, OnBack, footer, HasPermission }: channeLSettingsBodyProps
) {
    return <div className="flex flex-col justify-between">
        <div className="flex flex-col justify-start">
            <div className=" flex flex-row items-center justify-start gap-3">
                {OnBack && <Button
                    icon={IoChevronBackOutline}
                    outline
                    size={21}
                    labelsize={8}
                    onClick={OnBack}
                />}
                {title && <h3 className="capitalize text-md text-[#FFFFFF] font-semibold"> {title} </h3>}
            </div>
            <div className="overflow-y-scroll max-h-[38rem] flex flex-col w-full">
                <div className="flex flex-col h-full w-full justify-start gap-6 items-center p-4">
                    {!HasPermission
                        ? children
                        : <PermissionDenied />}
                </div>
            </div>
        </div>
       
        {!HasPermission && footer && footer}
    </div>

}