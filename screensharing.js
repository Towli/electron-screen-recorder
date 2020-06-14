"use strict";

const MIMETYPE = "video/webm";
const MIMETYPE_FULL = "video/webm; codecs=vp9";
const RECORDING_TIME = 5000;
const TIMESLICE = 10; // ms.

let recorder = null;
let blob = null;

function onDownloadReady() {
  document.querySelector("#download").classList.add("ready");
}

function stopCapturing() {
  recorder && recorder.stop();
}

function startCapturing() {
  const constraints = {
    audio: false,
    video: { mandatory: { chromeMediaSource: "screen" } },
  };

  const successCallback = (stream) => {
    recorder = new MediaRecorder(stream, {
      mimeType: MIMETYPE,
    });

    const blobs = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) blobs.push(e.data);
    };

    recorder.onstop = (e) => {
      blob = new Blob(blobs, { type: "video/webm" });
    };

    setTimeout(() => recorder.stop(), RECORDING_TIME);

    recorder.start(TIMESLICE); // collect 10ms chunks of data
  };

  const errorCallback = (err) => {
    console.log(err);
  };

  navigator.getUserMedia(constraints, successCallback, errorCallback);
}

function downloadRecording(blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.style.display = "none";
  a.href = url;
  a.download = "recording.webm";

  document.body.appendChild(a);
  a.click();

  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

document.querySelector("#start").addEventListener("click", startCapturing);
document.querySelector("#stop").addEventListener("click", stopCapturing);
document.querySelector("#download").addEventListener("click", () => {
  downloadRecording(blob);
});
