// http://127.0.0.1/api/rooms/a6602f3c-676d-492e-9292-c4eec04fdf35


const getChannelWithId = async (channeLId : string, token : string) => {
    try {
      return await fetch(`http://127.0.0.1/api/rooms/${channeLId}`, {
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
  