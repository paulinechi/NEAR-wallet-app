/* App.js */
import React from 'react';
var Component = React.Component;
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

let spendingArr = [];
let dataArr = [];
var rows =[];

class PieChart extends Component {
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
    let totalSpend = 0.0;
    console.log(rows);
		for(let i=0; i<rows.length; i++) {
			// spending
			if(rows[i].sender === window.accountId) {
				spendingArr.push({label: rows[i].type, y: parseFloat(rows[i].amount)});
        totalSpend += parseFloat(rows[i].amount)
			}
    }
    console.log(spendingArr.length);

		if (spendingArr.length > 0){
      console.log("here");
			for(let i=0; i<spendingArr.length; i++) {
        console.log("here too");
        if(i==0){
          dataArr.push(spendingArr[i]);
          continue
        };
        let found = false;
        for(let j=0; j<dataArr.length; j++) {
  				if(spendingArr[i].label == dataArr[j].label){
  					dataArr[j].y = dataArr[j].y + (spendingArr[i].y*100/totalSpend);
            found = true;
            break
  				}
        }
        if(!found){
          dataArr.push({label: spendingArr[i].type, y: spendingArr[i].y*100/totalSpend});
        };
			};
		}
		console.log(dataArr);
	}


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
				dataPoints: dataArr/*[
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

				]*/
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
