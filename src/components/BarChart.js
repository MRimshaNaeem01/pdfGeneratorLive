import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'
import { EnvironmentOutlined } from '@ant-design/icons';
import { Button } from 'antd';

Chart.register(...registerables);

const BarChart = () => {
    const [chartRendered, setChartRendered] = useState(false);
    // const [leftFooter, setLeftFooter] = useState("Report Genereted on September 26, 2023");
    // const [rightFooter, setRightFooter] = useState("RealAssist Property Report | Page 1 of 25");
    // const [crime, setCrime] = useState("Crime");
    
    const leftFooter = "Report Genereted on September 26, 2023";
    const rightFooter = "RealAssist Property Report | Page 1 of 25"
    const crime = "Crime"

    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Burglary',
                data: [],
                backgroundColor: '#F2F4F5',
                borderColor: 'blue',
                borderWidth: 2,
            },
        ],
    });


    const handleGeneratePDF = () => {

        if (chartRendered) {
            const chartCanvas = document.getElementById('bar-chart');
            const chartImageURL = chartCanvas.toDataURL('image/png');

            axios.post('http://localhost:5000/api/generate-pdf', { data, chartImageURL, crime, leftFooter, rightFooter }, { responseType: 'blob' })
                .then(response => {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            console.error("Chart is not yet rendered.");

        }
    };
    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => {
                //  setData(response.data);
                console.log("data", response.data);
                const years = response.data.data.map(item => item.data_year);
                const burglaryData = response.data.data.map(item => item.Burglary);

                console.log("years", burglaryData);

                setData(prevData => {
                    return {
                        ...prevData,
                        labels: years,
                        datasets: [
                            {
                                ...data.datasets[0],
                                data: burglaryData

                            }
                        ]
                    }
                })
                setChartRendered(true);

            })
            .catch(error => {
                console.error(error);
                console.log("err", error)
            });
    }, [data]);

    const chartOptions = {
        scales: {
            x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true,
                
              }
        },
    };

    return (
      
            <div className='app'>
                <div className='top'>
                    <div className="heading">
                        <span style={{color: '#1463FF'}}> 
                        <EnvironmentOutlined /></span>
                        <h3 style={{margin: '4px'}}>{crime}</h3>
                    </div>
                    <div className='line'></div>
                </div>

                <div className='container'>
                    <div className='barChart'>
                        <Line
                            data={data}
                            id="bar-chart"
                            options={chartOptions}
                        />
                    </div>
                </div>

                <div className='top'>
                    <div className='line'></div>
                </div>

                <div className='footer'>
                    <span style={{color: '#1463FF'}}>
                   {leftFooter}
                    </span>
                    <span style={{color: '#090E24'}}>
                  {rightFooter}
                    </span>
                </div>

                <div className='btn'>
                    <Button style={{ fontWeight: '500'}} type="primary" block onClick={handleGeneratePDF}>GENERATE PDF</Button>
                </div>
            </div>
      

    );
};

export default BarChart;