export async function POST(request) {
  const body = await request.json();
  const questionText = body.contents[0].parts[0].text;

  try {
   const apiResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: questionText }] }],
    }),
  }
);


    const responseData = await apiResponse.json();

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "API request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
