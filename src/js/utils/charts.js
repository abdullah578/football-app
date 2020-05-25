export const radarChart = function () {
  Highcharts.theme = {
    colors: [
      "#2b908f",
      "#90ee7e",
      "#f45b5b",
      "#7798BF",
      "#aaeeee",
      "#ff0066",
      "#eeaaee",
      "#55BF3B",
      "#DF5353",
      "#7798BF",
      "#aaeeee",
    ],
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, "#2a2a2b"],
          [1, "#3e3e40"],
        ],
      },
      style: {
        fontFamily: "'Unica One', sans-serif",
      },
      plotBorderColor: "#606063",
    },
    title: {
      style: {
        color: "#E0E0E3",
        textTransform: "uppercase",
        fontSize: "20px",
      },
    },
    subtitle: {
      style: {
        color: "#E0E0E3",
        textTransform: "uppercase",
      },
    },
    xAxis: {
      gridLineColor: "#707073",
      labels: {
        style: {
          color: "#E0E0E3",
        },
      },
      lineColor: "#707073",
      minorGridLineColor: "#505053",
      tickColor: "#707073",
      title: {
        style: {
          color: "#A0A0A3",
        },
      },
    },
    yAxis: {
      gridLineColor: "#707073",
      labels: {
        style: {
          color: "#E0E0E3",
        },
      },
      lineColor: "#707073",
      minorGridLineColor: "#505053",
      tickColor: "#707073",
      tickWidth: 1,
      title: {
        style: {
          color: "#A0A0A3",
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      style: {
        color: "#F0F0F0",
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: "#F0F0F3",
          style: {
            fontSize: "13px",
          },
        },
        marker: {
          lineColor: "#333",
        },
      },
      boxplot: {
        fillColor: "#505053",
      },
      candlestick: {
        lineColor: "white",
      },
      errorbar: {
        color: "white",
      },
    },
    legend: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      itemStyle: {
        color: "#E0E0E3",
      },
      itemHoverStyle: {
        color: "#FFF",
      },
      itemHiddenStyle: {
        color: "#606063",
      },
      title: {
        style: {
          color: "#C0C0C0",
        },
      },
    },
    credits: {
      style: {
        color: "#666",
      },
    },
    labels: {
      style: {
        color: "#707073",
      },
    },
    drilldown: {
      activeAxisLabelStyle: {
        color: "#F0F0F3",
      },
      activeDataLabelStyle: {
        color: "#F0F0F3",
      },
    },
    navigation: {
      buttonOptions: {
        symbolStroke: "#DDDDDD",
        theme: {
          fill: "#505053",
        },
      },
    },
    // scroll charts
    rangeSelector: {
      buttonTheme: {
        fill: "#505053",
        stroke: "#000000",
        style: {
          color: "#CCC",
        },
        states: {
          hover: {
            fill: "#707073",
            stroke: "#000000",
            style: {
              color: "white",
            },
          },
          select: {
            fill: "#000003",
            stroke: "#000000",
            style: {
              color: "white",
            },
          },
        },
      },
      inputBoxBorderColor: "#505053",
      inputStyle: {
        backgroundColor: "#333",
        color: "silver",
      },
      labelStyle: {
        color: "silver",
      },
    },
    navigator: {
      handles: {
        backgroundColor: "#666",
        borderColor: "#AAA",
      },
      outlineColor: "#CCC",
      maskFill: "rgba(255,255,255,0.1)",
      series: {
        color: "#7798BF",
        lineColor: "#A6C7ED",
      },
      xAxis: {
        gridLineColor: "#505053",
      },
    },
    scrollbar: {
      barBackgroundColor: "#808083",
      barBorderColor: "#808083",
      buttonArrowColor: "#CCC",
      buttonBackgroundColor: "#606063",
      buttonBorderColor: "#606063",
      rifleColor: "#FFF",
      trackBackgroundColor: "#404043",
      trackBorderColor: "#404043",
    },
  };
  Highcharts.setOptions(Highcharts.theme);
  Highcharts.chart("charts", {
    chart: {
      polar: true,
      type: "line",
    },

    accessibility: {
      description:
        "A spiderweb chart compares the allocated budget against actual spending within an organization. The spider chart has six spokes. Each spoke represents one of the 6 departments within the organization: sales, marketing, development, customer support, information technology and administration. The chart is interactive, and each data point is displayed upon hovering. The chart clearly shows that 4 of the 6 departments have overspent their budget with Marketing responsible for the greatest overspend of $20,000. The allocated budget and actual spending data points for each department are as follows: Sales. Budget equals $43,000; spending equals $50,000. Marketing. Budget equals $19,000; spending equals $39,000. Development. Budget equals $60,000; spending equals $42,000. Customer support. Budget equals $35,000; spending equals $31,000. Information technology. Budget equals $17,000; spending equals $26,000. Administration. Budget equals $10,000; spending equals $14,000.",
    },

    title: {
      text: "Team  Stats",
      x: 0,
    },

    pane: {
      size: "80%",
    },

    xAxis: {
      categories: [
        "Goals For",
        "Goals Against",
        "Losses",
        "Draws",
        "Wins",
        "Goals Avg",
      ],
      tickmarkPlacement: "on",
      lineWidth: 0,
    },

    yAxis: {
      gridLineInterpolation: "polygon",
      lineWidth: 0,
      min: 0,
    },

    tooltip: {
      shared: true,
      pointFormat:
        '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>',
    },

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },

    series: [
      {
        name: "Liverpool",
        data: [4, 6, 7, 8, 1, 5],
        pointPlacement: "on",
      },
      {
        name: "Manchester United",
        data: [2, 5, 7, 9, 3, 1],
        pointPlacement: "on",
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
              layout: "horizontal",
            },
            pane: {
              size: "70%",
            },
          },
        },
      ],
    },
  });
};

export const barChart = function () {
  Highcharts.theme = {
    colors: [
      "#2b908f",
      "#90ee7e",
      "#f45b5b",
      "#7798BF",
      "#aaeeee",
      "#ff0066",
      "#eeaaee",
      "#55BF3B",
      "#DF5353",
      "#7798BF",
      "#aaeeee",
    ],
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, "#2a2a2b"],
          [1, "#3e3e40"],
        ],
      },
      style: {
        fontFamily: "'Unica One', sans-serif",
      },
      plotBorderColor: "#606063",
    },
    title: {
      style: {
        color: "#E0E0E3",
        textTransform: "uppercase",
        fontSize: "20px",
      },
    },
    subtitle: {
      style: {
        color: "#E0E0E3",
        textTransform: "uppercase",
      },
    },
    xAxis: {
      gridLineColor: "#707073",
      labels: {
        style: {
          color: "#E0E0E3",
        },
      },
      lineColor: "#707073",
      minorGridLineColor: "#505053",
      tickColor: "#707073",
      title: {
        style: {
          color: "#A0A0A3",
        },
      },
    },
    yAxis: {
      gridLineColor: "#707073",
      labels: {
        style: {
          color: "#E0E0E3",
        },
      },
      lineColor: "#707073",
      minorGridLineColor: "#505053",
      tickColor: "#707073",
      tickWidth: 1,
      title: {
        style: {
          color: "#A0A0A3",
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      style: {
        color: "#F0F0F0",
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: "#F0F0F3",
          style: {
            fontSize: "13px",
          },
        },
        marker: {
          lineColor: "#333",
        },
      },
      boxplot: {
        fillColor: "#505053",
      },
      candlestick: {
        lineColor: "white",
      },
      errorbar: {
        color: "white",
      },
    },
    legend: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      itemStyle: {
        color: "#E0E0E3",
      },
      itemHoverStyle: {
        color: "#FFF",
      },
      itemHiddenStyle: {
        color: "#606063",
      },
      title: {
        style: {
          color: "#C0C0C0",
        },
      },
    },
    credits: {
      style: {
        color: "#666",
      },
    },
    labels: {
      style: {
        color: "#707073",
      },
    },
    drilldown: {
      activeAxisLabelStyle: {
        color: "#F0F0F3",
      },
      activeDataLabelStyle: {
        color: "#F0F0F3",
      },
    },
    navigation: {
      buttonOptions: {
        symbolStroke: "#DDDDDD",
        theme: {
          fill: "#505053",
        },
      },
    },
    // scroll charts
    rangeSelector: {
      buttonTheme: {
        fill: "#505053",
        stroke: "#000000",
        style: {
          color: "#CCC",
        },
        states: {
          hover: {
            fill: "#707073",
            stroke: "#000000",
            style: {
              color: "white",
            },
          },
          select: {
            fill: "#000003",
            stroke: "#000000",
            style: {
              color: "white",
            },
          },
        },
      },
      inputBoxBorderColor: "#505053",
      inputStyle: {
        backgroundColor: "#333",
        color: "silver",
      },
      labelStyle: {
        color: "silver",
      },
    },
    navigator: {
      handles: {
        backgroundColor: "#666",
        borderColor: "#AAA",
      },
      outlineColor: "#CCC",
      maskFill: "rgba(255,255,255,0.1)",
      series: {
        color: "#7798BF",
        lineColor: "#A6C7ED",
      },
      xAxis: {
        gridLineColor: "#505053",
      },
    },
    scrollbar: {
      barBackgroundColor: "#808083",
      barBorderColor: "#808083",
      buttonArrowColor: "#CCC",
      buttonBackgroundColor: "#606063",
      buttonBorderColor: "#606063",
      rifleColor: "#FFF",
      trackBackgroundColor: "#404043",
      trackBorderColor: "#404043",
    },
  };
  Highcharts.setOptions(Highcharts.theme);
  Highcharts.chart("charts", {
    chart: {
      type: "bar",
    },
    title: {
      text: "General Statistics",
    },
    xAxis: {
      categories: [
        "Games",
        "Wins",
        "Draws",
        "Losses",
        "Goals For",
        "Goals Against",
      ],
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Parsi Saint German",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      shadow: true,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Home",
        data: [107, 31, 635, 203, 100, 120],
      },
      {
        name: "Away",
        data: [104, 37, 654, 290, 109, 127],
      },
      {
        name: "Total",
        data: [102, 67, 700, 300, 200, 240],
      },
    ],
  });
};
