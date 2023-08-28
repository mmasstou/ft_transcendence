import FindOneBySLug from './Channel/findOneBySlug';
import getChanneLOwners from './getChannelOwner';

export default async function LeaveChanneL(
  userId: string,
  slug: string | undefined,
  token: string,
  event: string
) {
  if (event === process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_MEMBER_LEAVE) {
    if (!slug) return false;
    const channeLInfo = await FindOneBySLug(slug, token);
    if (!channeLInfo) return false;
    const ownersList = await getChanneLOwners(channeLInfo.id, token);

    if (!ownersList) return false;
    if (ownersList.length === 1) {
      if (ownersList[0].id === userId)
        // check if the User logeed is the only owner
        return true;
    }
}
return false;
}
