const getChannelMembersWithId = async (channeLId: string, token: string) => {
  try {
    return await fetch(`http://127.0.0.1/api/members/${channeLId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    });
  } catch (err) {
    console.log(err);
  }
};
export default getChannelMembersWithId;
