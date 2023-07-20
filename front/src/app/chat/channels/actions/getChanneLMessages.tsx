
const getChanneLMessages = async (channelId: string, token : string) => {
    try {
        return await fetch(`http://127.0.0.1/api/rooms/messages/${channelId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
      } catch (err) {
        console.log(err);
      }
};
export default getChanneLMessages;