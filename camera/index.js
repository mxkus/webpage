const video = document.getElementById("video");
const text = document.getElementById("prediction");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

function prediction_string(obj) {
  let top_prediction = "neutral";
  let maxVal = 0;
  var str = top_prediction;

  if (!obj) return str;

  obj = obj.expressions;
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (obj[p] > maxVal) {
        maxVal = obj[p];
        top_prediction = p;
        if (p===obj.sad || obj.disgusted || obj.angry){
          top_prediction="grumpy"
        }
      }
    }
  }

  return  top_prediction;
}

function startVideo() {
  
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
  if (navigator.getUserMedia) {
   navigator.getUserMedia({  video: true },
      function(stream) {
         var video = document.querySelector('video');
         video.srcObject = stream;
         video.onloadedmetadata = function(e) {
           video.play();
         };
      },
      function(err) {
         console.log(err.name);
      }
   );
} else {
   document.body.innerText ="getUserMedia not supported";
   console.log("getUserMedia not supported");
  }
}

video.addEventListener("play", () => {
  let visitedMsg = true;

  setInterval(async () => {
    const predictions = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (visitedMsg) {
      text.innerText = "Your expression";
      visitedMsg = false;
    }

    text.innerHTML = prediction_string(predictions[0]);
  }, 100);
});
