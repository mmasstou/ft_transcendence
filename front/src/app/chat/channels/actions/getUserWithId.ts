const getUserWithId = async (userId : string, token : string) => {
    try {
      return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
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
  export default getUserWithId;
  