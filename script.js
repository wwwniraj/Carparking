let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let parkingLot = document.getElementById('parking-lot');
let carCount = 0;
let currentStream = null;
let useFrontCamera = false;

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: {
      facingMode: useFrontCamera ? 'user' : 'environment'
    },
    audio: false
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (err) {
    console.error("Camera error:", err);
    alert("Could not access camera: " + err.message);
  }
}

// Initialize camera
startCamera();

// Switch between front/back
function switchCamera() {
  useFrontCamera = !useFrontCamera;
  startCamera();
}

// Capture and scan
function parkCar() {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageDataURL = canvas.toDataURL('image/png');

  Tesseract.recognize(canvas, 'eng', {
    logger: m => console.log(m)
  }).then(({ data: { text } }) => {
    let plateNumber = text.replace(/\s/g, '').match(/[A-Z0-9\-]{5,}/g);
    plateNumber = plateNumber ? plateNumber[0] : `CAR-${Math.floor(Math.random() * 10000)}`;

    const carId = `car-${++carCount}`;
    const car = document.createElement('div');
    car.className = 'car';
    car.id = carId;
    car.innerHTML = `
      <strong>${plateNumber}</strong>
      <button onclick="removeCar('${carId}')">×</button>
      <img src="${imageDataURL}" alt="Car Image" />
    `;
    parkingLot.appendChild(car);
  }).catch(err => {
    console.error('OCR Error:', err);
    alert("Couldn't read plate. Try again.");
  });
}

function removeCar(carId) {
  const el = document.getElementById(carId);
  if (el) el.remove();
}

navigator.mediaDevices.enumerateDevices().then(devices => {
    console.log("Available devices:", devices);
  });
  