import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 220,
  },
  recovered: {
    hex: "#7dd71d",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "rgb(50, 50, 50)",
    half_op: "rgba(50, 50, 50, 0.5)",
    multiplier: 2000,
  },
};

function LineGraph({casesType = "cases"}) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=10")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }

    return chartData;
  };

  return (
    <div className="app__graph">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: casesTypeColors[casesType].half_op,
                borderColor: casesTypeColors[casesType].hex,
                data: data,
              },
            ],
          }}
          options={options}
        ></Line>
      )}
    </div>
  );
}

export default LineGraph;
