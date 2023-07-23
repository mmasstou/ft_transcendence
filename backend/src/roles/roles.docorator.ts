import { SetMetadata } from '@nestjs/common';
import { UserStatus } from 'src/enums/role.enum';

export const STATUS_KEY = 'status';
export const Is_Active = (...status: UserStatus[]) =>
  SetMetadata(STATUS_KEY, status);
