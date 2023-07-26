
const getChannelWithId = async (token : string) => {
    try {
      return await fetch(`http://127.0.0.1/api/users`, {
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
  export default getChannelWithId;
  