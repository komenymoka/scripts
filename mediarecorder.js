// Query for canvas and button elements
const canvas = document.querySelector('canvas');
const recordBtn = document.querySelector('button');

// Log messages based on element presence
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

// Recording duration in milliseconds (configurable)
const recordingDuration = 6300;

// Function to get the best available WebM mimeType
function getSupportedMimeType() {
  if (MediaRecorder.isTypeSupported('video/webm; codecs="vp9"')) {
    return { mimeType: 'video/webm; codecs="vp9"', extension: 'webm' };
  } else if (MediaRecorder.isTypeSupported('video/webm; codecs="vp8"')) {
    return { mimeType: 'video/webm; codecs="vp8"', extension: 'webm' };
  } else {
    return null;
  }
}

// Start recording the canvas
function startRecording() {
  console.log('Button clicked'); // Log when button is clicked

  // Capture at 30 FPS
  const stream = canvas.captureStream(30); 

  const supportedFormat = getSupportedMimeType();
  if (!supportedFormat) {
    alert('Your browser does not support webm (vp9) or webm (vp8) recording.');
    return;
  }

  // Log canvas dimensions and expected video resolution
  const cssWidth = parseInt(canvas.style.width);
  const cssHeight = parseInt(canvas.style.height);
  const internalWidth = canvas.width;
  const internalHeight = canvas.height;
  const devicePixelRatio = window.devicePixelRatio || 1;

  console.log(`Canvas CSS resolution: ${cssWidth}x${cssHeight}`);
  console.log(`Canvas internal resolution: ${internalWidth}x${internalHeight} Device DPR: ${devicePixelRatio}`);
  console.log(`Expected video resolution: ${cssWidth * devicePixelRatio}x${cssHeight * devicePixelRatio}`);

  // Recording options with the best mime type and video bitrate
  const options = {
    mimeType: supportedFormat.mimeType,
    videoBitsPerSecond: 10000000, // 10 Mbps bitrate
  };

  const mediaRecorder = new MediaRecorder(stream, options);
  const chunks = [];

  // Log when the recording starts
  mediaRecorder.onstart = () => {
    console.log('Recording started');
  };

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  // Log when the recording stops
  mediaRecorder.onstop = () => {
    console.log('Recording stopped');

    const blob = new Blob(chunks, { type: options.mimeType });
    const videoUrl = URL.createObjectURL(blob);
    
    // Use the desired base name and extension based on the format
    const baseName = 'rive-recording';
    const filename = `${baseName}.${supportedFormat.extension}`; // Formatted filename

    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = filename; // Set the desired filename
    
    // Trigger download using a click event on the anchor tag
    document.body.appendChild(a); // Append to body to ensure the click is recognized
    a.click();
    document.body.removeChild(a); // Clean up after download
  };

  mediaRecorder.start();

  // Stop recording after the specified duration
  setTimeout(() => {
    mediaRecorder.stop();
  }, recordingDuration);
}

// Add event listener to the button if it exists
if (recordBtn) {
  recordBtn.addEventListener('click', startRecording);
}