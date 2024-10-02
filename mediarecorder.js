const canvas = document.querySelector('canvas');
const recordBtn = document.querySelector('button');

if (canvas) {
  console.log('Canvas found');
} else {
  console.log('Canvas not found');
}

if (recordBtn) {
  console.log('Button found');
} else {
  console.log('Button not found');
}

const recordingDuration = 6300;

function getSupportedMimeType() {
  if (MediaRecorder.isTypeSupported('video/webm; codecs="vp9"')) {
    return { mimeType: 'video/webm; codecs="vp9"', extension: 'webm' };
  } else if (MediaRecorder.isTypeSupported('video/webm; codecs="vp8"')) {
    return { mimeType: 'video/webm; codecs="vp8"', extension: 'webm' };
  } else {
    return null;
  }
}

function startRecording() {
  console.log('Button clicked');

  const stream = canvas.captureStream(30); 

  const supportedFormat = getSupportedMimeType();
  if (!supportedFormat) {
    alert('Your browser does not support webm (vp9) or webm (vp8) recording.');
    return;
  }

  const cssWidth = parseInt(canvas.style.width);
  const cssHeight = parseInt(canvas.style.height);
  const internalWidth = canvas.width;
  const internalHeight = canvas.height;
  const devicePixelRatio = window.devicePixelRatio || 1;

  console.log(`Canvas CSS resolution: ${cssWidth}x${cssHeight}, Device DPR: ${devicePixelRatio} ->`);
  console.log(`Canvas internal resolution: ${internalWidth}x${internalHeight}`);
  console.log(`Expected video resolution: ${cssWidth * devicePixelRatio}x${cssHeight * devicePixelRatio}`);

  const options = {
    mimeType: supportedFormat.mimeType,
    videoBitsPerSecond: 10000000,
  };

  const mediaRecorder = new MediaRecorder(stream, options);
  const chunks = [];

  mediaRecorder.onstart = () => {
    console.log('Recording started');
  };

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    console.log('Recording stopped');

    const blob = new Blob(chunks, { type: options.mimeType });
    const videoUrl = URL.createObjectURL(blob);
    
    const baseName = 'rive-recording';
    const filename = `${baseName}.${supportedFormat.extension}`;

    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  mediaRecorder.start();

  setTimeout(() => {
    mediaRecorder.stop();
  }, recordingDuration);
}

if (recordBtn) {
  recordBtn.addEventListener('click', startRecording);
}