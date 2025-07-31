let selectedCountry = null;
let selectedGenre = null;

d3.csv("data/spotify_by_country.csv").then(data => {
  // Convert streams to numbers
  data.forEach(d => d.streams = +d.streams);
  renderScene(data);
});

function renderScene(data) {
  d3.select("#chart").html(""); // Clear previous scene

  if (!selectedCountry) {
    renderGlobalChart(data);
  } else if (!selectedGenre) {
    renderGenreChart(data, selectedCountry);
  } else {
    renderTrackChart(data, selectedCountry, selectedGenre);
  }
}

function renderGlobalChart(data) {
  // TO DO: build scene 1
}

function renderGenreChart(data, country) {
  // TO DO: build scene 2
}

function renderTrackChart(data, country, genre) {
  // TO DO: build scene 3
}
