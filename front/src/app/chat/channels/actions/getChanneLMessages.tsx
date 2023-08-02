
const getChanneLMessages = async (channelId: string, token : string) => {
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/messages/${channelId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
      } catch (err) {
        console.log(err);
        return null;
      }
};
export default getChanneLMessages;