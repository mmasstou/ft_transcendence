export async function POST(req: Request) {
    const body = await req.json()
    console.log("API - Body:", body);
    return new Response("Hello, Next.js!");
  }