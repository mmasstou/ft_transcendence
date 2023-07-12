export async function POST(req: Request) {
  const { userId, token } = await req.json();
  // get user info :
  const User = await fetch(`http://127.0.0.1/api/users/${userId}`).then(res => res.json())
  console.log("User :", User)
  const Room = await fetch(`http://127.0.0.1/api/rooms/`, {
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
  console.log("User :", User)
  return new Response(JSON.stringify(Room), { headers: { 'Content-Type': 'application/json' } });
}
