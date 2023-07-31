const getChannels = async (token : string) => {
  try {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/user`, {
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
