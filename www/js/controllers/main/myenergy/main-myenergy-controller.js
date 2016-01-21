angular.module('enertalkHomeUSA.controllers')
  	
  	.controller('MainMyenergyCtrl', function($scope, $state, $timeout, MyenergyModel) {
  		
  		$scope.init = function (){
  			var target = document.getElementById('myenergy');
  			
  			$scope.myenergyItems = [{
    			label: 'Usage Trends',
    			type: 'usage-trends',
    			nextState: 'main.usage-trends'
    		},{
    			label: 'Monthly Overview',
    			type: 'energy-calendar',
    			nextState: 'main.energy-calendar'
    		},{
    			label: 'Realtime Usage',
    			type: 'realtime-usage',
    			nextState: 'main.realtime-usage'
    		},{
    			label: 'Standby Power',
    			type: 'standby-power',
    			nextState: 'main.standby-power'
    		}, {
    			label: 'Bill Estimator',
    			type: 'bill-estimator',
    			nextState: 'main.bill-estimator'
    		}, {
    			label: 'My Home Diet',
    			type: 'myhome-diet',
    			nextState: 'main.myhome-diet'
    		}];

    		MyenergyModel.getModel().then(function (response) {
    			$scope.data = response;
    			$scope.drawChart(parseFloat($scope.data.todayUsage));
    		});
  		};

  		$scope.drawChart = function (todayUsage) {
  			var target = document.getElementById('kwh-chart'),
	  			width = target.style.width,
	  			height = target.style.height,
	  			gaugeOptions = {

			        chart: {
			        	renderTo: 'kwh-chart',
			            type: 'solidgauge',
			            background: 'transparent'
			        },

			        series: [{
	            		name: '',
	            		data: [todayUsage],
	            		dataLabels: {
		            		format: '<div style="text-align: center; font-size: 28px;">{y}</div>' + 
		            		'<div style="text-align: center; font-size: 16px;">kWh</div>'
		            	}
	        		}],

			        title: null,

			        pane: {
			            center: ['50%', '65%'],
			            size: '100%',
			            startAngle: -135,
			            endAngle: 135,
			            background: {
			                backgroundColor: '#EEE',
			                innerRadius: '85%',
			                outerRadius: '100%',
			                shape: 'arc',
			                borderWidth: 0
			            }
			        },

			        tooltip: {
			            enabled: false
			        },

			        yAxis: {
			        	min: 0,
			        	max: 10,
			        	stops: [
			                [0.0, '#00cc00'], // green
			                [1.0, '#00cc00'], // yellow
			            ],
			            lineWidth: 0,
			            minorTickInterval: null,
			            tickPixelInterval: 400,
			            tickWidth: 0,
			            title: {
			                y: -70
			            },
			            labels: {
			            	enabled: false
			            }
			        },

			        plotOptions: {
			            solidgauge: {
			            	innerRadius: '85%',
			                dataLabels: {
			                    y: - 20,
			                    borderWidth: 0,
			                    useHTML: true
			                }
			            }
			        },

			        credits: {
			        	enabled: false
			        }
			    };

		    $scope.chart = new Highcharts.chart(gaugeOptions);
  		};

  		$scope.goToDetailView = function (nextState) {
  			$state.go(nextState);
  		};
  		
  		$scope.init();

  	});