import React, { useEffect, useState, useMemo } from 'react';
import {Pie, Bar } from 'react-chartjs-2';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import 'chartjs-plugin-datalabels';

const genQuestionPieChartData = (labels, data = {}, colors) => {
    return {
        labels: labels,
        datasets: [
            {
                label: 'Biểu đồ thống kê',
                fill: true,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
                borderColor: "white",
                borderWidth: 2,
                data: [
                    ...data
                ],
            },
        ],
    };
};
const genQuestionBarChartData = (labels, data = {}, colors) => {
    // console.log("colors: ", labels)
    return {
        labels: labels,
        datasets: [
            {
                label: 'Lượt chọn',
                fill: true,
                backgroundColor: colors,
                borderColor: "white",
                borderWidth: 2,
                data: [
                    ...data
                ],
            },
        ],
    };
};

const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        labels: true,
        datalabels: {
            display: true,
            color: 'white',
            formatter: function (value, ctx) {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                let percentage = (value*100 / sum).toFixed(1)+"%";
                return value + ' (' + percentage + ")"
            }
        }
    },
    legend: {
        display  : true,
        position : 'top',
        fullWidth: true,
        reverse  : false,
        labels   : {
            boxWidth: 20,
        },
    },
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                var total = meta.total;
                var currentValue = dataset.data[tooltipItem.index];
                var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                return currentValue + ' (' + percentage + '%)';
            },
            title: function (tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
            }
        }
    }
}
const barOptions = {
    maintainAspectRatio: false,
    responsive: true,
    showScale: true,
    pointDot: true,
    showLines: false,
    plugins: {
        labels: false
    },
    title: {
        display: false,
    },

    legend: {
        display: false  ,
        labels: {
            boxWidth: 50,
            fontSize: 10,
            // fontColor: '#bbb',
            // padding: 5,
        }
    },
    scales: {
        xAxes: [
        {
            barThickness: 'flex',
            display: false,
            gridLines: {
                display: false
            },
            ticks: {
                autoSkip: false,
                maxRotation: 20,
                minRotation: 20,
                maxHeight:60,
            }
        }
    ],
        yAxes: [{
            ticks: {
                beginAtZero:true,
                // min: 0,
                // max: 100
            }
          }]
       }
}


const defaultColors = [ "#00D084", "#ff5722", "#93c572", "#697689",
"#F47373", "#00bcd4", "#009688", "#4caf50", "#8bc34a",
"#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#90ecab",
"#795548", "#607d8b"]
function getColor(index){
    // console.log("===> index: ", index)
    return defaultColors[index]
}

function QuestionChart(props) {
    const [type, setType] = useState("")

    const [titles, setTitles] = useState([])
    const [values, setValues] = useState([])
    const [title, setTitle] = useState("")
    const [colors, setColors] = useState([])

    useEffect(() => {
        // console.log("==> chay vao chart data roi nhe")
        if (props && props.data) {
            const question = props.data.question
            const chartData = props.data.chartData
            if (question && chartData) {
                //for get chart type
                var defaultChart = ""
                if (question.type === "SINGLECHOICE" || question.type === "SMILEY" || question.type === "RATING_STAR" || question.type === "MULTIPLECHOICE" || question.type === "DROPDOWN") {
                    if (question.type === "SINGLECHOICE" || question.type === "SMILEY" || question.type === "RATING_STAR") {
                        defaultChart = "PIE"
                    } else if (question.type === "MULTIPLECHOICE" || question.type === "DROPDOWN") {
                        defaultChart = "BAR"
                    }
                }
                var mTitles = []
                var mValues = []
                var mColors = []
                chartData.map((mData, index) => {
                    var title = ""
                    var value = null
                    if (mData._id) title = mData._id
                    if (mData.total) value = mData.total
                    if (title && value) {
                        mTitles.push(title)
                        mValues.push(value)
                        // var colorCode = rgbToHex(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
                        var colorCode = getColor(index % defaultColors.length)
                        mColors.push(colorCode )
                    }
                })
                setType(defaultChart)
                setTitles(mTitles)
                setValues(mValues)
                setTitle(question.title)

                // console.log("==> mColors: ", mColors)
                setColors(mColors)
            }
        }
    }, [props])

    return (
        <Card style={{ minWidth: "300px", height: "400px" }}>
          <div style={{ height: "80px", width: "100%", backgroundColor: "#487eb0",}}>
            <div style={{ margin:"auto", marginTop:"15px",  marginLeft: "20px",display:"inline-block",  }}>
              <span style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>{title && title}</span>
            </div>
          </div>
          <CardContent>
            <Container>
              <Box >
                {
                  useMemo(() => {
                    switch (type) {
                      case 'PIE': {
                        return (<Pie width={"250px"} height={"250px"} data={genQuestionPieChartData(titles, values, colors)} options={pieOptions} />)
                      }
                      case 'BAR': {
                        return (<Bar width={"250px"} height={"280px"} data={genQuestionBarChartData(titles, values, colors)} options = {barOptions}/>)
                      }
                      default:
                        return null;
                    }
                  }, [titles, values, type, colors])
                }
              </Box>
            </Container>
          </CardContent>
        </Card>
    )
}
export default QuestionChart;
