const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

let N = 1;
if (localStorage.getItem("carCount")) {
  N = localStorage.getItem("carCount");
}
const cars = generateCars(N);
let bestCar = cars[0];


let mutationAmount = 0.3;
if (localStorage.getItem("mutationAmount")) {
  mutationAmount = localStorage.getItem("mutationAmount");
}

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, mutationAmount);
    }
  }
}
const trafficN = 5;
let traffic = [];
traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];
const RandomCarsCheckbox = document.querySelector('#randomCars');

RandomCarsCheckbox.addEventListener('change', () => {
  if (RandomCarsCheckbox.checked) {
    traffic = [];
    for (let i = 0; i < trafficN; i++) {
      traffic.push(
        new Car(road.getLaneCenter(Math.floor(Math.random() * 3)),
          Math.random() * 500, 30, 50, "DUMMY", 2, getRandomColor())
      );

      traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random() * 3)),
        -Math.random() * 300, 30, 50, "DUMMY", 2, getRandomColor())
      );
    }
  }
});


animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    // change from AI to KEYS to use the keyboard
    cars.push(new Car(road.getLaneCenter(1), 200, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  /*
   Todo add better fitness function
   - in case of turn y is not good fitness
   - add a func which make sure car is in center
   - don't allow car to sway unnecessary
  */
  bestCar = cars.find(
    car => car.y == Math.min(
      ...cars.map(
        car => car.y
      )
    )
  );

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carContext.save();
  carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carContext);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carContext);
  }
  carContext.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carContext);
  }
  carContext.globalAlpha = 1;
  bestCar.draw(carContext, true);

  carContext.restore();


  networkContext.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkContext, bestCar.brain);
  requestAnimationFrame(animate);
}