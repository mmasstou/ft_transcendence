
const getUsers = async (token : string) => {
    try {
      return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      }).then((res) => res.json());
    } catch (err) {
      console.log(err);
      return null
    }
  };
  export default getUsers;
  