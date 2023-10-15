const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChartDataSchema = new Schema({
    labels: {
        type: [Number],
        required: true,
    },
    datasets:[
        {
            data: {
                type: [Number],
                required: true,
            },
            backgroundColor: {
                type: String,
                required: true,
            },
            borderColor: {
                type: String,
                required: true,
            },
            borderWidth: {
                type: Number,
                required: true,
            },
        }
    ]
  
});

const ChartData = mongoose.model('ChartData', ChartDataSchema);
module.exports = ChartData;
