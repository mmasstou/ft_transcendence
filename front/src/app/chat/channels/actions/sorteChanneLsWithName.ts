//

import { RoomsType } from '@/types/types';

const sorteChanneLsWithName = (channeLs : RoomsType[]) => {
  try {
      return channeLs.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

  } catch (err) {
    return [];
  }
};
export default sorteChanneLsWithName;
