import React, { useEffect, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Icon, IconButton, Paper, Input, Tab, Tabs, Typography, Button, Fab, TextField, Toolbar } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';


const genSurveyLineData = (labels, data1 = {}, data2 = {}) => {
    console.log("titles: ", labels, " users: ", data1, "  total: ", data2)
    return {
        labels: labels,
        datasets: [
            {
                label: 'Tổng khách làm khảo sát',
                fill: false,
                backgroundColor: "white",
                borderColor: "#F5A623",
                borderWidth: 1,
                data: [
                    ...data1
                ],
            },
            {
                label: 'Tổng lượt làm khảo sát',
                fill: false,
                backgroundColor: "white",
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
    console.log("chart data: ", props.chartData)
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
        <Card style={{ display: "block", margin: "20px", }}>
            <div style={{ height: "60px", width: "100%", backgroundColor: "#192D3E" }}>
                <div style={{paddingTop:"18px"}}><span style={{marginLeft:"20px", color:"white", fontSize:"20px", fontWeight:"bold"}}>THỐNG KÊ CHIẾN DỊCH KHẢO SÁT</span></div>
            </div>
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