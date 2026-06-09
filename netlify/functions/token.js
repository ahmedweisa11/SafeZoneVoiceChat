const { AccessToken } = require("livekit-server-sdk");

exports.handler = async (event) => {
  try {
    const identity =
      event.queryStringParameters?.identity || "guest";

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing LiveKit env variables"
        })
      };
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity
    });

    at.addGrant({
      roomJoin: true,
      room: "safezone"
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: await at.toJwt()
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
