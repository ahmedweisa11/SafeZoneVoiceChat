import { AccessToken } from "livekit-server-sdk";

export const handler = async (event) => {
  try {
    const identity =
      event.queryStringParameters?.identity || "guest";

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing env vars" })
      };
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity
    });

    token.addGrant({
      roomJoin: true,
      room: "safezone"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: await token.toJwt()
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
