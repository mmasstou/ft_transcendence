const getMemberWithId = async (userId : string, roomsId : string, token : string) => {
    try {
      return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${userId}/${roomsId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      }).then((res) => res.json());
    } catch (err) {
      console.log(err);
    }
  };
  export default getMemberWithId;
  