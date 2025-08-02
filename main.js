
// ========== Scene 1: Placement Rate by College ==========
function drawScene1() {
  d3.select("#chart").html("");

  d3.csv("data/college_student_placement_dataset.csv").then(data => {
    data.forEach(d => {
      d.Academic_Performance = +d.Academic_Performance;
    });

    const stats = d3.rollups(
      data,
      v => {
        const placed = v.filter(d => d.Placement.toLowerCase() === "yes").length;
        return {
          placed,
          total: v.length,
          rate: placed / v.length
        };
      },
      d => d.Academic_Performance
    ).sort((a, b) => d3.ascending(a[0], b[0]));

    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 20, bottom: 60, left: 60 };

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height + 50)
      .append("g")
      .attr("transform", `translate(0, 20)`);

    const x = d3.scaleBand()
      .domain(stats.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateRdYlGn);

    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Placement Rate by Academic Performance");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 50)
      .attr("text-anchor", "middle")
      .text("Academic Rating");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left - 45)
      .attr("text-anchor", "middle")
      .text("Placement Rate");

    svg.selectAll("rect")
      .data(stats)
      .enter()
      .append("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1].rate))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d[1].rate))
      .attr("fill", d => color(d[1].rate))
      .append("title")
      .text(d => `${d[0]}: ${(d[1].rate * 100).toFixed(1)}% (${d[1].placed}/${d[1].total})`);
  });
}

// ========== Scene 2: CGPA vs Placement ==========
function drawScene2() {
  d3.select("#viz").html("");

  const width = 700;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 50, left: 50 };

  const svg = d3.select("#viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/college_student_placement_dataset.csv").then(data => {
    data.forEach(d => {
      d.CGPA = +d.CGPA;
      d.Placement = d.Placement === "Yes" ? 1 : 0;
    });

    const xScale = d3.scaleLinear()
      .domain([4, 11])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-0.2, 1.2])
      .range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale).ticks(2).tickFormat(d => d === 1 ? "Placed" : "Not Placed"));

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.CGPA))
      .attr("cy", d => yScale(d.Placement + (Math.random() * 0.2 - 0.1)))
      .attr("r", 3)
      .style("fill", d => d.Placement ? "#4CAF50" : "#F44336")
      .style("opacity", 0.5);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("CGPA vs Placement Outcome");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .text("CGPA");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .text("Placement Status");
  });
}

function drawScene3() {
  d3.select("#intern-chart").html("");

  const width = 600;
  const height = 600;
  const margin = { top: 70, right: 30, bottom: 80, left: 80 };

  const svg = d3.select("#intern-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("data/college_student_placement_dataset.csv").then(data => {
    // Group by Internship and calculate placement rate
    // const normalizedData = data.map(d => ({
    //     ...d,
    //     Internship: d.Internship.toLowerCase() === "yes" ? "Yes" : "No"
    // }));
    const stats = d3.rollups(
      data,
      v => {
        const placed = v.filter(d => d.Placement === "Yes").length;
        return {
          total: v.length,
          placed: placed,
          rate: placed / v.length
        };
      },
      d => d.Internship_Experience
    );

    // Sort to make "Yes" appear first
    stats.sort((a, b) => d3.descending(a[0], b[0]));

    const x = d3.scaleBand()
      .domain(stats.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(["Yes", "No"])
      .range(["#4CAF50", "#F44336"]);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    // Bars
    svg.selectAll("rect")
      .data(stats)
      .enter()
      .append("rect")
      .attr("x", d => x(d[0]))
      .attr("y", y(0)) // start from bottom
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", d => color(d[0]))
      .transition()
      .duration(800)
      .attr("y", d => y(d[1].rate))
      .attr("height", d => y(0) - y(d[1].rate));

    // Labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Placement Rate by Internship Experience");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .text("Internship Experience");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .text("Placement Rate");

    // Percentage labels above bars
    svg.selectAll("text.label")
      .data(stats)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d[0]) + x.bandwidth() / 2)
      .attr("y", d => y(d[1].rate) - 5)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text(d => `${(d[1].rate * 100).toFixed(1)}%`);

    // Annotation
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 70)
      .attr("text-anchor", "middle")
      .style("font-style", "italic")
      .style("fill", "#555")
      .text("Having internship experience does not seem to have an effect on placement.");
  });
}

// function drawScene3() {
//   d3.select("#extra-chart").html("");
//
//   d3.csv("data/college_student_placement_dataset.csv").then(data => {
//     // Parse Extra_Curricular_Score as a number
//     data.forEach(d => {
//       d.Extra_Curricular_Score = +d.Extra_Curricular_Score;
//     });
//
//     // Group data by extracurricular score and calculate placement rate
//     const stats = d3.rollups(
//       data,
//       v => {
//         const placed = v.filter(d => d.Placement.toLowerCase() === "yes").length;
//         return {
//           placed,
//           total: v.length,
//           rate: placed / v.length
//         };
//       },
//       d => d.Extra_Curricular_Score
//     ).sort((a, b) => d3.ascending(a[0], b[0])); // sort by score
//
//     const width = 800;
//     const height = 400;
//     const margin = { top: 60, right: 20, bottom: 60, left: 60 };
//
//     const svg = d3.select("#extra-chart")
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height + 50)
//       .append("g")
//       .attr("transform", `translate(0, 20)`);
//
//     const x = d3.scaleBand()
//       .domain(stats.map(d => d[0]))
//       .range([margin.left, width - margin.right])
//       .padding(0.2);
//
//     const y = d3.scaleLinear()
//       .domain([0, 1])
//       .range([height - margin.bottom, margin.top]);
//
//     const color = d3.scaleSequential()
//       .domain([0, 10])
//       .interpolator(d3.interpolateRdYlGn);
//
//     // Axes
//     svg.append("g")
//       .attr("transform", `translate(0, ${height - margin.bottom})`)
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .attr("transform", "rotate(-45)")
//       .style("text-anchor", "end");
//
//     svg.append("g")
//       .attr("transform", `translate(${margin.left}, 0)`)
//       .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));
//
//     // Labels
//     svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", margin.top - 30)
//       .attr("text-anchor", "middle")
//       .style("font-size", "16px")
//       .style("font-weight", "bold")
//       .text("Placement Rate by Extra Curricular Score");
//
//     svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", height - margin.bottom + 50)
//       .attr("text-anchor", "middle")
//       .text("Extra Curricular Score");
//
//     svg.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -height / 2)
//       .attr("y", margin.left - 45)
//       .attr("text-anchor", "middle")
//       .text("Placement Rate");
//
//     // Bars
//     svg.selectAll("rect")
//       .data(stats)
//       .enter()
//       .append("rect")
//       .attr("x", d => x(d[0]))
//       .attr("y", d => y(d[1].rate))
//       .attr("width", x.bandwidth())
//       .attr("height", d => y(0) - y(d[1].rate))
//       .attr("fill", d => color(d[0])) // d[0] is the score (0–10)
//       .append("title")
//       .text(d => `Score ${d[0]}: ${(d[1].rate * 100).toFixed(1)}% (${d[1].placed}/${d[1].total})`);
//   });
// }

function drawScene4() {
  d3.select("#scatter-chart").html("");

  const margin = { top: 50, right: 20, bottom: 60, left: 60 },
        width = 600,
        height = 450;

  const svg = d3.select("#scatter-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("data/college_student_placement_dataset.csv").then(data => {
    const numericVars = ["CGPA", "IQ", "Projects_Completed", "Extra_Curricular_Score", "Communication_Skills"];

    const dropdownX = d3.select("#xSelect");
    const dropdownY = d3.select("#ySelect");

    // Populate dropdowns
    dropdownX.selectAll("option")
      .data(numericVars)
      .enter().append("option")
      .attr("value", d => d)
      .text(d => d);

    dropdownY.selectAll("option")
      .data(numericVars)
      .enter().append("option")
      .attr("value", d => d)
      .text(d => d);

    dropdownX.property("value", "CGPA");
    dropdownY.property("value", "IQ");

    function updateChart() {
      const xVar = dropdownX.property("value");
      const yVar = dropdownY.property("value");

      svg.selectAll("*").remove();

      const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d[xVar])).nice()
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d[yVar])).nice()
        .range([height - margin.bottom, margin.top]);

      const color = d3.scaleOrdinal()
        .domain(["Yes", "No"])
        .range(["#4CAF50", "#F44336"]);

      svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

      svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(+d[xVar]))
        .attr("cy", d => y(+d[yVar]))
        .attr("r", 5)
        .attr("fill", d => color(d.Placement))
        .attr("opacity", 0.2)
        .append("title")
        .text(d => `Placement: ${d.Placement}`);

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text(xVar);

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(yVar);
    }

    // Event listeners
    dropdownX.on("change", updateChart);
    dropdownY.on("change", updateChart);

    updateChart();
  });
}
