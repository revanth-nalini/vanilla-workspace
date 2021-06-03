const socket = io('/')
const videoGrid = document.getElementById('video-grid')
let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    // port: '443'
    port: '3030'
})
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: true
}).then(stream => {

    myVideoStream = stream;
    addVideoStream(myVideo, stream)
  
    socket.on('user-connected',(userId) => {
        console.log('user-connected', "->", userId);
        connectToNewUser(userId,stream);
    })

    let text = $('input');
    $('html').keydown(e=>{
        if(e.which==13 && text.val().length!=0){
            socket.emit('message',text.val());
            text.val('');
        }
    })
    socket.on('createMessage', (message, userId) => {
        $('ul').append(`<li class="message"><b>${userId}</b><br/>${message}</li>`)
    })
})

peer.on('open',id=>{
    console.log('peer', "->", id);
    socket.emit('join-room',ROOM_ID,id)
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

peer.on('call', call => {
    navigator.getUserMedia({
        video: true, 
        audio: false            
    }, stream =>{
        console.log("answering")
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })            
})


const connectToNewUser = (userId,stream) => {
    const call  = peer.call(userId,stream);
    const video = document.createElement('video');
    console.log("going to call","->",userId)
    call.on('stream', userVideoStream => {
        console.log("calling","->",userId)
        addVideoStream(video,userVideoStream);
    })
    call.on('close', () => {
        video.remove()
      })
    peers[userId] = call
}

const addVideoStream = (video, stream) => {
    console.log("append video")
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video)
}

const scrollToBottom = () =>{
    let down = $('.main__chat__window');
    down.scrollTop(down.prop('scrollHeight'))
}

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    } else{
        myVideoStream.getAudioTracks()[0].enabled=true;
        setMuteButton();
    }
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}

const playStop = () =>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo();
    } else{
        myVideoStream.getVideoTracks()[0].enabled=true;
        setStopVideo();
    }
}

const setPlayVideo = () => {
    const html = `
        <i class="stop fas fa-video-slash"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}

const setStopVideo = () => {
    const html = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}