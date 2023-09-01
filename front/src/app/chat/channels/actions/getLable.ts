import { UserTypeEnum, membersType, updatememberEnum } from '@/types/types';
const getLable = (updateType: updatememberEnum, member: membersType) => {
  let result = '';
  switch (updateType) {
    case updatememberEnum.SETADMIN:
      result =
        member.type !== UserTypeEnum.ADMIN ? 'set Admin' : 'remove as admin';
      break;
    case updatememberEnum.ADDMEMBER:
      result = 'Add Member';
      break;
    case updatememberEnum.BANMEMBER:
      result = 'Ban Member';
      break;
    case updatememberEnum.KIKMEMBER:
      result = 'Kik Member';
      break;
    case updatememberEnum.MUTEMEMBER:
      result = member.ismute ? 'Unmute' : 'Mute';
      break;
    case updatememberEnum.PLAYGAME:
      result = 'Play Game';
      break;
    case updatememberEnum.SETOWNER:
      result = 'Set As Owner';
      break;
    case updatememberEnum.ACCESSPASSWORD:
      result = 'Access Password';
      break;
    default:
      result = 'Set As Admin';
      break;
  }
  return result;
};
export default getLable;
