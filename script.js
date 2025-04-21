let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let parkingLot = document.getElementById('parking-lot');
let carCount = 0;
let currentFacing = 'environment'; // back by default

// Start camera
function startCamera(facingMode = 'environment') {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: facingMode }
  })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert('Camera not accessible: ' + err);
  });
}

startCamera(currentFacing);

function switchCamera() {
  currentFacing = currentFacing === 'user' ? 'environment' : 'user';
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  startCamera(currentFacing);
}

function parkCar() {
  // Capture frame
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageDataURL = canvas.toDataURL('image/png');

  // OCR with Tesseract.js
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
