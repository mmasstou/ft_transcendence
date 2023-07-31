export async function POST(req: Request) {
  const { userId, token } = await req.json();
  // get user info :
  const User = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`).then(res => res.json())
  const Room = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/`, {
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
  return new Response(JSON.stringify(Room), { headers: { 'Content-Type': 'application/json' } });
}
