/* App.js */
import React from 'react';
var Component = React.Component;
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class PieChart extends Component {	
	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1", // "light1", "dark1", "dark2"
			title:{
				text: "Expenditure Breakdown"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
				startAngle: -90,
				dataPoints: [
					{ y: 5, label: "Groceries" },
					{ y: 8, label: "Food & Drinks" },
					{ y: 3, label: "Transport" },
					{ y: 2, label: "Utilities" },
					{ y: 10, label: "Travel" },
                    { y: 15, label: "Shopping" },
                    { y: 6, label: "Exercise" },
					{ y: 4, label: "Beauty" },
					{ y: 1, label: "Medical" },
					{ y: 10, label: "Leisure" },
					{ y: 18, label: "Education" },
					{ y: 5, label: "Pets" },
					{ y: 3, label: "Gifts" },
					{ y: 8, label: "Housing" },
					{ y: 2, label: "Other" },
	
				]
			}]
		}
		
		return (
		<div>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
 
module.exports = PieChart; 