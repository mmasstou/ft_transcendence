import { membersType } from '@/types/types';

export default async function FilterMembers_IsBan_NotLoggedUser(
  channeLId: string,
  token: string,
  UserId : string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/members/${channeLId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
        const membersList : membersType[] =  await response.json()
        let IsBan_NotLoggedUserList = membersList.filter((member : membersType) => {
            return (member.isban !== true && member.userId !== UserId)
        })
      return IsBan_NotLoggedUserList;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
