import { Room } from "https://cdn.skypack.dev/livekit-client";

let room;

document.getElementById("join").onclick = async () => {
  try {
    const identity = document.getElementById("name").value || "guest";

    const res = await fetch(
      `/.netlify/functions/token?identity=${identity}`
    );

    const data = await res.json();

    if (!data.token) {
      throw new Error("Token missing from server");
    }

    room = new Room();

    await room.connect(
      "wss://safezonevoicechat-nzt911jb.livekit.cloud",
      data.token
    );

    console.log("✅ Connected to voice room");

  } catch (err) {
    console.error("❌ Connection failed:", err);
    alert(err.message);
  }
};
