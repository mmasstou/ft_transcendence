// ${process.env.NEXT_PUBLIC_API_URL}/rooms/a6602f3c-676d-492e-9292-c4eec04fdf35

const getChannelWithId = async (channeLId: string, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/${channeLId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) return null;
    return await response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getChannelWithId;
