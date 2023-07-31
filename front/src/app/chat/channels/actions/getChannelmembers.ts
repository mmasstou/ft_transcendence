const getChannelMembersWithId = async (channeLId: string, token: string) => {
  try {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${channeLId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return null
    });
  } catch (err) {
    console.log(err);
    return null
  }
};
export default getChannelMembersWithId;
