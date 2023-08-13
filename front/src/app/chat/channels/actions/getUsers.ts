
const getUsers = async (token : string) => {
    try {
      const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
          },
      })
      if(response.ok){
        
        return await response.json()
      }
      return null
    } catch (err) {
      console.log(err);
      return null
    }
  };
  export default getUsers;
  