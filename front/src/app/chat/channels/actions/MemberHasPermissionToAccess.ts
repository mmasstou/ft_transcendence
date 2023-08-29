// MemberHasPermissionToAccess

const MemberHasPermissionToAccess = async (
  token: string,
  channeLId: string,
  userId: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/HasPermissionToAccess/${userId}/${channeLId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log('MemberHasPermissionToAccess :', data);
      return data;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default MemberHasPermissionToAccess;
