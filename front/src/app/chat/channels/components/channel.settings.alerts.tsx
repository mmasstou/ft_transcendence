import { IconType } from "react-icons"

interface ChanneLSettingsAlertProps {
    message: string
    icon?: IconType
    type?: 'error' | 'success' | 'warning'
}
export default function ChanneLSettingsAlert(
    {
        message,
        icon: Icon,
        type
    }: ChanneLSettingsAlertProps) {
    return <div className="p-6 flex flex-row w-full justify-between items-center">

        <div>{message}</div>
    </div>
}