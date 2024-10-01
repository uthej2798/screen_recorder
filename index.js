let video = document.querySelector("video");
let recBtnCont = document.querySelector(".rec-btn-cont");
let recButton = document.querySelector(".rec-btn");
let timerCont = document.querySelector(".timer-cont");
let timer = document.querySelector(".timer");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";

let recFlag = false;
let recorder;
let chunks = [];

let constraints = {
    video: true,
    audio: true,
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recorder.addEventListener("start",(e)=>{
            chunks = [];
        })
        recorder.addEventListener("dataavailable",(e)=>{
            chunks.push(e.data);
        })

        recorder.addEventListener("stop",async (e)=>{
            let blob = new Blob(chunks,{type: "video/webm"});
            let videoUrl = URL.createObjectURL(blob)
            let a = document.createElement("a");
            a.href = videoUrl;
            a.download = "stream.webm";
            document.body.appendChild(a); 
            a.click()
            document.body.removeChild(a);

            setTimeout(() => {
                URL.revokeObjectURL(videoUrl);
            }, 100);
            chunks = [];
        })

         recBtnCont.addEventListener("click",(e)=>{
            if(!recorder) return;

            recFlag = !recFlag;
            if(recFlag){
                recorder.start();
                recButton.classList.add("scale-record")
                startTimer()
            }else{
                recorder.stop();
                recButton.classList.remove("scale-record")
                stopTimer()
            }

         })

    })

let timerid;
let counter = 0

function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        let totalsec = counter;
       
        let hours = Number.parseInt(totalsec/3600)
        totalsec = totalsec%3600
        let min = Number.parseInt(totalsec/60)
        let sec = totalsec%60
        
        if(hours < 10) hours = "0"+hours
        if(min < 10) min = "0"+min
        sec = (sec<10) ? `0${sec}`:sec

        timer.innerText = `${hours}:${min}:${sec}`;
        
        counter++;
    }
    timerid = setInterval(displayTimer,1000);
}

function stopTimer(){
    clearInterval(timerid);
    counter = 0
    timer.innerText =  "00:00:00"
    timer.style.display = "none";
}

captureBtnCont.addEventListener("click", function () {
    captureBtnCont.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    //canvas.getContext("2d").drawImage(video,0,0);
    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width, canvas.height);
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL("image/jpeg");

    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "image.jpeg";
    a.click()

    setTimeout(() =>{
        captureBtnCont.classList.remove("scale-capture");
    },500);
});

let filter = document.querySelector(".filter-layer");

let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem)=>{
    filterElem.addEventListener("click", (e)=>{
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
});


