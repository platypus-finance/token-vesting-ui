import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";

import { displayAmount } from "../utils";

class VestingChart extends Component {
  render() {
    return <Line data={this.chartData()} options={this.chartOptions()} />;
  }

  chartData() {
    return {
      datasets: [
        this.fromBaseDataset({
          data: this.getPoints(),
        }),
      ],
    };
  }

  getPoints() {
    const { start, cliff, end } = this.props.details;
    const now = new Date() / 1000; // normalize to seconds

    const points = [this.getDataPointAt(start)];

    // Add signitificant datapoints. Order matters.
    if (cliff < now) {
      points.push(this.getDataPointAt(cliff));
    }

    if (start < now && now < end) {
      points.push(this.getDataPointAt(now));
    }

    if (cliff > now) {
      points.push(this.getDataPointAt(cliff));
    }

    points.push(this.getDataPointAt(end));

    return points;
  }

  getDataPointAt(date) {
    return {
      x: this.formatDate(date),
      y: this.getAmountAt(date),
    };
  }

  formatDate(date) {
    return moment(date * 1000).format("MM/DD/YYYY HH:mm");
  }

  getAmountAt(date) {
    const { total, cliff, end, decimals } = this.props.details;

    if (date <= cliff) {
      return 0;
    }

    const slope = (date - cliff) / (end - cliff);

    return displayAmount(total, decimals) * slope;
  }

  chartOptions() {
    return {
      tooltips: {
        titleFontFamily: "Lato",
        xPadding: 16,
        yPadding: 16,
        titleMarginBottom: 12,
      },
      legend: { display: false },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "#fff",
            },
            type: "time",
            time: {
              format: "MM/DD/YYYY HH:mm",
              tooltipFormat: "ll HH:mm",
            },
            scaleLabel: {
              display: true,
              labelString: "Date",
              fontColor: "#fff",
              fontFamily: "Lato",
            },
            gridLines: {
              color: "#fff",
              zeroLineColor: "#00A7FF",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#fff",
              callback: function (value) {
                return value.toLocaleString("en-US");
              },
            },
            scaleLabel: {
              display: true,
              labelString: this.props.details.symbol || "",
              fontColor: "#fff",
              fontFamily: "Lato",
            },
            gridLines: {
              color: "#fff",
            },
          },
        ],
      },
    };
  }

  fromBaseDataset(opts) {
    return {
      lineTension: 0.1,
      backgroundColor: "#f2c84c7d",
      borderColor: "#F2C94C",
      borderJoinStyle: "miter",
      pointBackgroundColor: "#F2C94C",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      color: "#fff",

      ...opts,
    };
  }
}

export default VestingChart;
