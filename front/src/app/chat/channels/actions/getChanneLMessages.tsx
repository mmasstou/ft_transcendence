
const getChanneLMessages = async (channelId: string, token : string) => {
    try {
        const channelMessages =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/messages/${channelId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!channelMessages) return null

        return await channelMessages.json()
      } catch (err) {
        console.log(err);
        return null;
      }
};
export default getChanneLMessages;