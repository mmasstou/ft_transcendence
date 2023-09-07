const StartGame = async (body: any, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/game/FriendGame`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) return true;
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
export default StartGame;
