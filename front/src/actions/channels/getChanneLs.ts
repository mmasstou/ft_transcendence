const getChannels = async (token : string) => {
  try {
    return await fetch('http://127.0.0.1/api/rooms/user', {
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
export default getChannels;
