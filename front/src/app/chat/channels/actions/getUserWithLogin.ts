// getUserWithLogin
const getUserWithLogin = async (login : string,) => {
    try {
      return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login/${login}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      }).then((res) => res.json());
    } catch (err) {
      console.log(err);
    }
  };
  export default getUserWithLogin;
  