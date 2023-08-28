const getChannels = async (token: string) : Promise<[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/user`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getChannels;
