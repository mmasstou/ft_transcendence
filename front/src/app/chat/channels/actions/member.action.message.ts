import { updatememberEnum } from "@/types/types";

const getmessage = (actionType: updatememberEnum) => {
    if (actionType === updatememberEnum.BANMEMBER) return process.env.NEXT_PUBLIC_BAN_MESSAGE;
    if (actionType === updatememberEnum.KIKMEMBER) return process.env.NEXT_PUBLIC_KICK_MESSAGE;
    if (actionType === updatememberEnum.MUTEMEMBER) return process.env.NEXT_PUBLIC_MUTE_MESSAGE;
    if (actionType === updatememberEnum.SETADMIN) return process.env.NEXT_PUBLIC_SETADMIN_MESSAGE;
  };
  export default getmessage;
  