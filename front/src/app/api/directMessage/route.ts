export async function POST(req: Request) {
  const { userId, token } = await req.json();
  // get user info :
  console.log('userId :', userId);
  console.log('token :', token);

  const privateRoom = await fetch(`http://127.0.0.1/api/direct-message`, {
    method: 'POST',
    headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverId: userId }),
  }).then((res) => res.json());
  console.log('privateRoom :', privateRoom);
//// console.log("User :", User)
  // const User = await fetch(`http://127.0.0.1/api/users/${userId}`).then(res => res.json())
  // const Room = await fetch(`http://127.0.0.1/api/rooms/`, {
  //   method : 'POST',
  //   headers: {
  //       Authorization: `${token}`,
  //       'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //       name : User.login,
  //       type: "PRIVATE"
  //   })
  // }).then(res => res.json())
  // console.log("User :", User)
  return new Response(JSON.stringify(privateRoom), {
    headers: { 'Content-Type': 'application/json' },
  });
}
