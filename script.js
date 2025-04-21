const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const parkingLot = document.getElementById('parking-lot');
let carCount = 0;

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Camera access denied!");
    console.error(err);
  });

function parkCar() {
  carCount++;

  // Take snapshot
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageURL = canvas.toDataURL('image/png');

  const licensePlate = `CAR-${Math.floor(Math.random() * 10000)}`;
  const carId = `car-${carCount}`;

  const car = document.createElement('div');
  car.className = 'car';
  car.id = carId;
  car.innerHTML = `
    ${licensePlate}
    <button onclick="removeCar('${carId}')">×</button>
    <img src="${imageURL}" alt="Car Image" />
  `;

  parkingLot.appendChild(car);
}

function removeCar(carId) {
  const carElement = document.getElementById(carId);
  if (carElement) {
    carElement.remove();
  }
}
