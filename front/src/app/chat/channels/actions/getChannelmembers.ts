const getChannelMembersWithId = async (channeLId: string, token: string) => {
  try {
    const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${channeLId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.ok) {
      return await response.json();
    }
    return null
  } catch (err) {
    console.log(err);
    return null
  }
};
export default getChannelMembersWithId;
