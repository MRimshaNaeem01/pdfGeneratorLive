// routes/api.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const PDFDocument = require('pdfkit');
const ChartData = require('../models/BarChart')

router.get('/data', async (req, res) => {
  try {
    const response = await axios.get('https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv');
    const data = response.data;
    // console.log("data", data)
    res.json(data);
  } catch (error) {
   // console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/generate-pdf', async (req, res) => {
 try {
  const { data, chartImageURL, crime, leftFooter, rightFooter } = req.body;
  const labels = data.labels
  const datasets = data.datasets
  // console.log(labels,"==", datasets)
  const doc = new PDFDocument();

  const chartData = new ChartData({
    labels,
    datasets,
  });

  await chartData.save();

  doc.font('Helvetica-Bold');

  // Header
  const headerStartX = 50; 
  const headerStartY = 50; 
  doc.fontSize(11).fillColor('#1463FF').text(crime, headerStartX, headerStartY, { align: 'left' });
  const headerTextWidth = doc.widthOfString(crime);
  doc.lineWidth(1).strokeColor('#1463FF').moveTo(headerStartX + headerTextWidth + 5, headerStartY + 7).lineTo(doc.page.width - 50, headerStartY + 7).stroke(); // Line starting just in front of the text

  // if (chartImageURL) {
  //   doc.image(chartImageURL, { fit: [500, 500], align: 'center' });
  // }
  const chartPadding = 20; 
  const chartBorderColor = '#1463FF'; 
  const chartBackgroundColor = '#fff'; 

  // Chart
  if (chartImageURL) {
    const chartWidth = 600; 
    const chartHeight = 400; 
    const chartX = (doc.page.width - chartWidth) / 2; 
    const chartY = doc.y + chartPadding; 

    // Draw a border around the chart
    doc.rect(chartX, chartY, chartWidth, chartHeight).stroke(chartBorderColor);

    // Set the background color for the chart area
    doc.fillColor(chartBackgroundColor).rect(chartX, chartY, chartWidth, chartHeight).fill();

    // Adding chart image inside the border and background
    doc.image(chartImageURL, chartX + chartPadding, chartY + chartPadding, {
      width: chartWidth - 2 * chartPadding,
      height: chartHeight - 2 * chartPadding
    });

    doc.y = chartY + chartHeight + chartPadding; 
  }
  // Footer
  const textWidth1 = doc.widthOfString(leftFooter);
  const textWidth2 = doc.widthOfString(rightFooter);
  const fontSize = 8;
  const marginY = 10;

  const containerWidth = textWidth1 + textWidth2 + -110;
  const containerStartX = (doc.page.width - containerWidth) / 2;
  const containerStartY = doc.y + marginY;

  // Drawing blue line above the footer
  doc.lineWidth(1).strokeColor('#1463FF').moveTo(containerStartX, containerStartY).lineTo(containerStartX + containerWidth, containerStartY).stroke();
  doc.fontSize(fontSize).fillColor('#1463FF').text(leftFooter, containerStartX, containerStartY + marginY, { align: 'left' });
  doc.fontSize(fontSize).fillColor('#090E24').text(rightFooter, containerStartX + textWidth1 + 20, containerStartY + marginY, { align: 'right' });

  doc.pipe(res);
  doc.end();

 } catch (error) {
  console.error(error); 
    res.status(500).json({ error: 'Internal Server Error' });
 }
 
});

module.exports = router;
