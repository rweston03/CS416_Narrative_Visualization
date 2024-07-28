var symbol = d3.symbol();

function formatDataScene2(data1, data2) {
    let dataArray = [];
    let d2NonYearKeys = ["Country Code", "Country Name", "Female Secondary School Enrollment", "Income Group", "Region"]
    // 53 years in data, 1970 - 2022
    let years = Object.keys(data2[0]).filter(k => !d2NonYearKeys.includes(k))
    data1.forEach(d1 => {
        let d2Match = data2.filter(d => d["Country Code"] == d1["Country Code"])[0]

        let d1Sum = 0;
        let d2Sum = 0;
        let yearCount1 = 0;
        let yearCount2 = 0;
        years.forEach(y => {
            if(d1[y] !== "") {
                yearCount1 += 1;
                d1Sum += Number(d1[y]);
            }
            if(d2Match[y] !== "" && d2Match[y] !== null) {
                yearCount2 += 1;
                d2Sum += Number(d2Match[y]);
            }
        })
        let d1Avg = d1Sum && d1Sum > 0 ? d1Sum / yearCount1 : 0;     
        let d2Avg = d2Sum && d2Sum > 0 ? d2Sum / yearCount2 : 0;

        dataArray.push({"Country": d1["Country Name"], "IncomeGroup": d1["Income Group"], "Region": d1["Region"], "InfantMortalityAverage": d1Avg.toFixed(2), "SchoolAverage": d2Avg.toFixed(2)})
    })
    return dataArray
}

async function loadScene2() {
    const data1 = await d3.csv("https://rweston03.github.io/CS416_Narrative_Visualization//WDI-Filtered-Infant-Mortality.csv")
    const data2 = await d3.csv("https://rweston03.github.io/CS416_Narrative_Visualization//WDI-Filtered-Secondary-School.csv")

    const chartData = formatDataScene2(data1, data2)

    const annotations = [
        {
            type: d3.annotationCallout,
            note: {
                title: "Incomplete Data",
                label: "Not all countries have recorded data in the World Development Indicators Data Bank for fertility rates and/or secondary school enrollment.",
                wrap: 300,
            },
            x: 5,
            y: 610,
            dy: -50,
            dx: 50
        },
        {
            type: d3.annotationCallout,
            note: {
                title: "Low Income Countries",
                label: "Countries with lower incomes likely have less money to spend on education and healthcare as a whole. As a result, women may be have less knowledge of and/or access to modern medicine. It should also be noted that many countries in the top-left of this graph are areas where malaria is a common cause of infant death.",
                wrap: 300,
            },
            x: 150,
            y: 150,
            dy: -25,
            dx: 150
        },
        {
            type: d3.annotationCallout,
            note: {
                title: "High Income Countries",
                label: "Countries with higher incomes likely have more money to spend on education and healthcare as a whole. As a result, women may be have more knowledge of and/or access to modern medicine. Women who finish secondary school may also be more likely to be employed outside the home and thereby have greater access to health insurance and regular doctor visits.",
                wrap: 300,
            },
            x: 900,
            y: 550,
            dy: -200,
            dx: 40
        },
    ]

    let svg = d3.select("#canvas").append("svg").attr("width",width).attr("height",height).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
    svg.append("rect").attr("width","100%").attr("height","100%").attr("fill", "#ffffff");
    var x = d3.scaleLinear()
        .domain([0, 150])
        .range([ 0, 1200 ]);
    svg.append("g")
        .attr("transform", "translate(0," + (height - 80) + ")")
        .call(d3.axisBottom(x));
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", ((1300 + margin.left + margin.right)/2))
        .attr("y", height - 35)
        .text("Average Secondary School Enrollment (% gross)");
    var y = d3.scaleLinear()
        .domain([0, 150])
        .range([ (height - 80), 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 50-margin.left)
        .attr("x",0 - ((height - 350) / 2))
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average Infant Mortality Rate (per 1000 births)");
    let tooltip = d3.select('body').append("div")
        .style("opacity", 0)
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("z-index", "100")
        .attr('class', 'tooltip')
    svg.append('g').selectAll("path")
        .data(chartData)
        .enter().append("path")
        .attr("class", "dot")
        .attr("transform", function(d) { return "translate(" + x(d.SchoolAverage) + "," +  y(d.InfantMortalityAverage) + ")" })
        .attr("d", symbol.type(function(d){
            if(d["IncomeGroup"] == "High income"){ return d3.symbolDiamond
            } else if (d["IncomeGroup"] == "Upper middle income"){ return d3.symbolSquare
            } else if (d["IncomeGroup"] == "Lower middle income"){ return d3.symbolCircle
            } else if (d["IncomeGroup"] == "Low income"){ return d3.symbolTriangle
            } else {return d3.symbolCircle}
        }))
        .style("fill", function (d) { return regionColors[d.Region] })
        .on("mouseover", function(d,i) {
            d3.select('.tooltip')
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Country: " + i.Country + "<br/>" + 
                        "Region: " + i.Region + "<br/>" + 
                        "Avg. Infant Mortality Rate: " + i.InfantMortalityAverage + "<br/>" + 
                        "Avg. School Enrollment: " + i.SchoolAverage + "<br/>" + 
                        "Income Group: " + i.IncomeGroup + "<br/>"  )
            .style("left", (d.x) + "px") 
            .style("top", (d.y) + "px")
        })
        .on("mouseout", function(d,i) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        }) ;
    const makeAnnotations = d3.annotation().annotations(annotations)
    svg.append("g").attr("class", "annotation-group").call(makeAnnotations)
}