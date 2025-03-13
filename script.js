// DOM elements
const startBtn = document.getElementById('startBtn');
const watchBtn = document.getElementById('watchBtn');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// Peer-to-peer connection
let localStream;
let peerConnection;

// Configuring WebRTC connection
const iceServers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

// Start video stream from webcam
startBtn.addEventListener('click', async () => {
  try {
    // Get user media (webcam)
    localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    localVideo.srcObject = localStream;
    
    // Initialize peer connection
    peerConnection = new RTCPeerConnection(iceServers);

    // Add stream to the peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Create offer and send it to the remote peer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer to the other user (This should be handled via a signaling server in production)
    // For now, we will simulate this by triggering watchBtn manually
    console.log('Offer created:', offer);

    // Show that the user is streaming
    startBtn.disabled = true;
    watchBtn.disabled = false;

  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
});

// Watch video stream from the other user
watchBtn.addEventListener('click', async () => {
  try {
    // Simulating the signaling server response, the remote offer is manually created here.
    const remoteOffer = {
      type: 'offer',
      sdp: '...The SDP from the signaling server...' // Normally you'd get this from the other peer
    };

    // Initialize peer connection for the receiver
    peerConnection = new RTCPeerConnection(iceServers);

    // Handle the remote stream when it's received
    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };

    // Set the remote description from the signaling server's offer
    await peerConnection.setRemoteDescription(remoteOffer);

    // Create an answer to send back to the sender
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Simulate sending the answer back to the other peer (via signaling server)
    console.log('Answer created:', answer);

    // Disable buttons after connection is established
    startBtn.disabled = true;
    watchBtn.disabled = true;

  } catch (error) {
    console.error('Error during WebRTC connection:', error);
  }
});
