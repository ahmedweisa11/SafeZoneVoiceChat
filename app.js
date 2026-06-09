let room;
let localTrack;
let isAdmin = false;

// 👑 ADMIN NAME (غيّر ده)
const ADMIN_NAME = "admin";

async function joinRoom() {

  const name = document.getElementById("name").value;

  if (!name) return alert("اكتب اسمك");

  if (name === ADMIN_NAME) {
    isAdmin = true;
  }

  const res = await fetch(`/.netlify/functions/token?identity=${name}`);
  const data = await res.json();

  const token = data.token;
  const url = data.url;

  room = new LivekitClient.Room();

  await room.connect(url, token);

  document.getElementById("status").innerText = "Connected";

  await room.localParticipant.setMicrophoneEnabled(true);

  document.getElementById("micBtn").disabled = false;

  document.getElementById("micBtn").onclick = async () => {
    const enabled = !room.localParticipant.isMicrophoneEnabled;
    await room.localParticipant.setMicrophoneEnabled(enabled);
  };

  // 👇 users list
  room.on("participantConnected", updateUsers);
  room.on("participantDisconnected", updateUsers);

  updateUsers();
}

function updateUsers() {

  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "";

  room.participants.forEach((p) => {

    const div = document.createElement("div");
    div.innerText = p.identity;

    // 👑 admin controls
    if (isAdmin) {

      const muteBtn = document.createElement("button");
      muteBtn.innerText = "Mute";

      muteBtn.onclick = async () => {
        await room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify({
            target: p.identity,
            action: "mute"
          }))
        );
      };

      div.appendChild(muteBtn);
    }

    usersDiv.appendChild(div);
  });
}