
const getChanneLMessages = async (channelId: string, token : string) => {
    try {
<<<<<<< HEAD
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/messages/${channelId}`, {
=======
        return await fetch(`http://127.0.0.1/api/rooms/messages/${channelId}`, {
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
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