let globalChart = undefined;
const submit = async (e) => {
  if (globalChart != undefined) {
    globalChart.destroy();
    globalChart = undefined;
  }
  document.getElementById("loading").style.display = "block";
  document.getElementById("submit").disabled = true;

  const minRiskDiv = document.getElementById("min-risk");
  minRiskDiv.innerHTML = '<p class="risktitle">MIN RISK </p>';

  const maxReturnDiv = document.getElementById("max-return");
  maxReturnDiv.innerHTML = '<p class="risktitle">MAX RETURN</p>';

  e.preventDefault();
  const stock = document.getElementById("stock").value;
  const response = await fetch('http://127.0.0.1:5000/api/portfolio?tickers=' + stock, {
        method: 'GET',
    });
    const json = await response.json();
  console.log(json);
  const minRisk = JSON.parse(json.minRisk);
  const maxReturn = JSON.parse(json.maxReturn);
  const df = JSON.parse(json.df);
  const minRiskTable = getTable(minRisk);
  const maxReturnTable = getTable(maxReturn);
  minRiskDiv.appendChild(minRiskTable);
  maxReturnDiv.appendChild(maxReturnTable);
  document.getElementById("submit").disabled = false;
  document.getElementById("loading").style.display = "none";
  let colors = ["red", "green", "blue", "yellow", "purple"];
  let xValues = [];
  df.index.forEach((e) => {
    let date = new Date(e);
    let d =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    xValues.push(d);
  });
  let datasets = [];
  df.columns.forEach((e, i) => {
    let data = {
      data: [],
      label: e,
      borderColor: colors[i],
      fill: false,
    };
    datasets.push(data);
  });
  console.log(datasets);
  df.data.forEach((element) => {
    element.forEach((e, i) => {
      datasets[i].data.push(e);
    });
  });

  globalChart = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: datasets,
    },
    options: {
      legend: { display: false },
    },
  });
};
document.getElementById("submit").addEventListener("click", submit);

const getTable = (data) => {
  let table = document.createElement("table");
  table.className = "risktable";
  for (let [key, value] of Object.entries(data)) {
    let k = Object.keys(value)[0];
    let v = value[k];
    table.innerHTML += `<tr> <td>${key}</td> <td>${v}</td></tr>`;
  }
  return table;
};
