let table;
let countries = [];
let countryIndex = 0;
let years = [];
let maxLifeExpectancy = 0;
let currentYearIndex = 0; // Tracks the year index to plot points one by one
let pointTimer = 0; // Timer to control intervals
const POINT_INTERVAL = 10; // Faster interval (10 frames = ~0.16 seconds at 60 FPS)

function preload() {
  // Load the CSV file
  table = loadTable("life.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Full-page canvas
  textFont("Arial", 16);

  // Process CSV data
  let countryData = {};
  for (let row = 0; row < table.getRowCount(); row++) {
    let country = table.getString(row, "Country");
    let lifeExpectancy = parseFloat(table.getString(row, "Life expectancy"));
    if (!countryData[country]) {
      countryData[country] = [];
    }
    countryData[country].push(lifeExpectancy);

    // Update max life expectancy for graph scaling
    if (lifeExpectancy > maxLifeExpectancy) {
      maxLifeExpectancy = lifeExpectancy;
    }
  }

  // Store data for each country and reverse it (to match 2000-2015 order)
  for (let country in countryData) {
    countries.push({
      name: country,
      lifeExpectancy: countryData[country].reverse()
    });
  }

  // Define years for the x-axis (2000 to 2015)
  for (let i = 2000; i <= 2015; i++) {
    years.push(i);
  }
}

function draw() {
  background(240);

  // Draw the graph for the current country
  drawCountryGraph(countries[countryIndex]);

  // Control the plotting interval for points
  pointTimer++;
  if (pointTimer >= POINT_INTERVAL) { // Faster interval
    pointTimer = 0;
    currentYearIndex++;
  }

  // Transition to the next country once all points are plotted
  if (currentYearIndex >= years.length) {
    currentYearIndex = 0;
    countryIndex = (countryIndex + 1) % countries.length;
  }
}

function drawCountryGraph(countryData) {
  // Responsive positions
  let graphLeft = width * 0.1;
  let graphRight = width * 0.9;
  let graphBottom = height * 0.85;
  let graphTop = height * 0.15;

  // Title
  fill(0);
  textAlign(CENTER);
  textSize(24);
  text(countryData.name, width / 2, graphTop - 30);

  // Draw axes
  stroke(0);
  line(graphLeft, graphBottom, graphRight, graphBottom); // X-axis
  line(graphLeft, graphBottom, graphLeft, graphTop); // Y-axis

  // Label axes
  textSize(16);
  textAlign(CENTER);
  text("Year", (graphLeft + graphRight) / 2, graphBottom + 40);
  textAlign(RIGHT);
  text("Life Expectancy", graphLeft - 20, (graphTop + graphBottom) / 2);

  // Plot years on the x-axis
  textSize(12);
  textAlign(CENTER);
  for (let i = 0; i < years.length; i++) {
    let x = map(i, 0, years.length - 1, graphLeft, graphRight);
    text(years[i], x, graphBottom + 20);
    stroke(200);
    line(x, graphBottom, x, graphTop); // Vertical grid lines
  }

  // Plot life expectancy on the y-axis
  for (let i = 0; i <= maxLifeExpectancy; i += 10) {
    let y = map(i, 0, maxLifeExpectancy, graphBottom, graphTop);
    textAlign(RIGHT);
    text(i, graphLeft - 10, y);
    stroke(200);
    line(graphLeft, y, graphRight, y); // Horizontal grid lines
  }

  // Plot life expectancy data up to the current year index
  noFill();
  stroke(0);
  beginShape();
  for (let i = 0; i <= currentYearIndex && i < countryData.lifeExpectancy.length; i++) {
    let x = map(i, 0, years.length - 1, graphLeft, graphRight);
    let y = map(countryData.lifeExpectancy[i], 0, maxLifeExpectancy, graphBottom, graphTop);
    vertex(x, y);
  }
  endShape();

  // Plot points up to the current year index
  fill(255, 0, 0);
  noStroke();
  for (let i = 0; i <= currentYearIndex && i < countryData.lifeExpectancy.length; i++) {
    let x = map(i, 0, years.length - 1, graphLeft, graphRight);
    let y = map(countryData.lifeExpectancy[i], 0, maxLifeExpectancy, graphBottom, graphTop);
    ellipse(x, y, 8, 8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust canvas size on window resize
}
