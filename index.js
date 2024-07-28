
const incomeLevels = ["High income", "Upper middle income", "Lower middle income", "Low income"];
const incomeLevelColors = {
    "High income" : "",
    "Upper middle income" : "",
    "Lower middle income": "",
    "Low income": ""
}

/* "High income" : "symbolDiamond",
"Upper middle income" : "symbolSquare",
"Lower middle income": "symbolCircle",
"Low income": "symbolTriangle" */

const regions = ["East Asia & Pacific", "Europe & Central Asia", "Latin America & Caribbean", "Middle East & North Africa", "North America", "South Asia", "Sub-Saharan Africa"]
const regionColors = {
    "East Asia & Pacific": "#61B2D0", // light-blue
    "Europe & Central Asia": "#8A3680", // purple
    "Latin America & Caribbean": "#AEBF2C", // green
    "Middle East & North Africa": "#BF1515", // red
    "North America": "#FF5F05", // orange
    "South Asia": "#345AA1", // dark-blue
    "Sub-Saharan Africa": "#F2C216", // yellow 
}

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


var symbol = d3.symbol();

async function load() {
    const data = await d3.csv("WDI-Country-Data.csv")
    console.log(data)
}