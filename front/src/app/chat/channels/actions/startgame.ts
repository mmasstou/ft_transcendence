
const StartGame = async (body: any, token : string) => {
    try {
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/game/FriendGame`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        });
        if (!response) return null

        return await response.json()
      } catch (err) {
        console.log(err);
        return null;
      }
};
export default StartGame;