import React, { useEffect, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const genSurveyLineData = (labels, data1 = {}, data2 = {}) => {
    console.log("titles: ", labels, " users: ", data1, "  total: ", data2)
    return {
        labels: labels,
        datasets: [
              {
                datalabels: {
                display: false
              },
              label: 'Tổng khách làm khảo sát',
              fill: false,
              backgroundColor: "#F5A623",
              borderColor: "#F5A623",
              borderWidth: 1,
              data: [
                  ...data1
              ],
            },
            {
                datalabels: {
                display: false
              },
              label: 'Tổng lượt làm khảo sát',
              fill: false,
              backgroundColor: "#4A90E2",
              borderColor: "#4A90E2",
              borderWidth: 1,
              data: [
                  ...data2
              ],
            },
        ],
    };
};


function SurveyChart(props) {
    const [titles, setTitles] = useState([])
    const [users, setUsers] = useState([])
    const [totals, setTotals] = useState([])
    useEffect(() => {
        let chartData = props.chartData
        if (chartData) {
            var mTitles = []
            var mUsers = []
            var mTotals = []
            chartData.map(e => {
                mTitles.push(e.Name)
                var user = 0
                if (e.users) {
                    user = e.users
                }
                mUsers.push(user)

                var total = 0
                if (e.total) {
                    total = e.total
                }
                mTotals.push(total)
            })
            setTitles(mTitles)
            setUsers(mUsers)
            setTotals(mTotals)
        }
    }, [props.chartData])

    return (
        <Card>
          <Typography className="pl-12 text-15 font-bold mb-10 block-tittle">Thống kê khảo sát:</Typography>
            <CardContent>
                <Container>
                    <Box >
                        {
                            useMemo(() => {
                                return (
                                    <Line data={genSurveyLineData(titles, users, totals)} />
                                )
                            }, [titles, users, totals])
                        }
                    </Box>
                </Container>
            </CardContent>
        </Card>
    )
}
export default SurveyChart;
