import React from 'react';
var Component = React.Component;
import  CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import moment from 'moment';

let spendingArr = [];
let incomeArr = [];
let dataArr = [];
var rows =[];


class Chart extends Component {
	constructor(props) {
		super(props);
		//console.log(props);
		this.getTransactionData = this.getTransactionData.bind(this);
	}

	componentDidMount() {
		this.getTransactionData();
	}

	async getTransactionData() {
		rows = await this.props.rows;
		if(rows == [] || rows === undefined){
			return;
		}

		this.spendingArr = [];
		this.incomeArr = [];
		this.dataArr = [];
		rows = rows["rows"];
		for(let i=0; i<rows.length; i++) {
			var check = moment(rows[i].datetime, 'MMMM Do YYYY, h:mm:ss a');
			var year = check.format('Y');
			var month = check.format('M');
			var day = check.format('D');

			//console.log(new Date(check));

			// spending
			if(rows[i].sender === window.accountId) {
				spendingArr.push({x: new Date(check), y: parseFloat(rows[i].amount)});
			}

			// income
			if(rows[i].receiver === window.accountId){
				incomeArr.push({x: new Date(year, month), y: rows[i].amount});
			}
		}

		if (spendingArr.length > 0){
			for(let i=0; i<spendingArr.length; i++) {
				if(i !== 0 && (spendingArr[i].x == dataArr[dataArr.length - 1].x)){
					dataArr[dataArr.length - 1].y = dataArr[dataArr.length - 1].y - spendingArr[i].y;
				} else {
					dataArr.push(spendingArr[i]);
				}
			}
		}

		if (incomeArr.length > 0) {
			for(let i=0; i<incomeArr.length; i++) {
				if(incomeArr[i].x == dataArr[dataArr.length - 1].x){
					dataArr[dataArr.length - 1].y = dataArr[dataArr.length - 1].y + incomeArr[i].y;
				} else {
					dataArr.push(incomeArr[i]);
				}
			}
		}
		//console.log(dataArr);
	}


	render() {
		const options = {
			animationEnabled: true,
			title:{
				text: "Spending Trend"
			},
			axisX: {
				valueFormatString: "DD MMM YYYY"
			},
			axisY: {
				title: "Spending",
				prefix: "N",
				includeZero: true
			},
			data: [{
				yValueFormatString: "N#,###",
				xValueFormatString: "DD MMMM",
				type: "spline",
				dataPoints: dataArr
				/*[
					{ x: new Date(2020, 1, 25), y: 5 },
					{ x: new Date(2020, 2, 1), y: 2 },
					{ x: new Date(2020, 2, 3), y: 3 },
					{ x: new Date(2020, 2, 7), y: 4 },
					{ x: new Date(2020, 2, 14), y: 6 },
					{ x: new Date(2020, 2, 18), y: 3 },
					{ x: new Date(2020, 2, 20), y: 8 },
					{ x: new Date(2020, 3, 4), y: 3 },
					{ x: new Date(2020, 3, 8), y: 5 },
				]*/
			}]
		}

		return (
			<div>
				<CanvasJSChart options = {options}
				onRef={ref => this.chart = ref}
			/>
			</div>

		// 	<CanvasJSChart options = {options}
		// 		onRef={ref => this.chart = ref}
		// 	/>
		// 	{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		// </div>
		);
	}
}
module.exports = Chart;
