export async function POST(req: Request) {
  const { userId, token } = await req.json();
  // get user info :
<<<<<<< HEAD
  const User = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`).then(res => res.json())
  const Room = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/`, {
=======
  const User = await fetch(`http://127.0.0.1/api/users/${userId}`).then(res => res.json())
  console.log("User :", User)
  const Room = await fetch(`http://127.0.0.1/api/rooms/`, {
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    method : 'POST',
    headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name : User.login,
        type: "PRIVATE"
    })
  }).then(res => res.json())
<<<<<<< HEAD
=======
  console.log("User :", User)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
  return new Response(JSON.stringify(Room), { headers: { 'Content-Type': 'application/json' } });
}
