
// IsMember

const IsMember = async (channeLId: string,userId : string, token: string) => {
    try {
      const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${userId}/${channeLId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        console.log('const IsMember = async response :', response);
        return await response.json();
      }
      return null
    } catch (err) {
      console.log(err);
      return null
    }
  };
  export default IsMember;
  