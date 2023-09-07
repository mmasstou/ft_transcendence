const FindOneBySLug = async (slug: string, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/slug/${slug}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) return null;
      return await response.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  };
  export default FindOneBySLug;
  