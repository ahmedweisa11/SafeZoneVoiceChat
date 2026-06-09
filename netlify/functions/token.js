import { AccessToken } from "livekit-server-sdk";

export const handler = async (event) => {

  try {

    const identity = event.queryStringParameters.identity;

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity }
    );

    at.addGrant({
      roomJoin: true,
      room: "safezone"
    });

    const token = await at.toJwt();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        url: process.env.LIVEKIT_URL
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};