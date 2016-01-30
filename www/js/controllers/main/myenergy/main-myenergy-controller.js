angular.module('enertalkHomeUSA.controllers')
  	
  	.controller('MainMyenergyCtrl', function($scope, $state, $timeout, $filter, MyenergyModel, User, Util) {
  		
  		$scope.init = function (){
  			var target = document.getElementById('myenergy');
  			
  			$scope.myenergyItems = [{
    			label: 'Monthly Bill Est.',
    			type: 'bill-estimator',
    			nextState: 'main.bill-estimator'
    		},{
    			label: 'Usage Trends',
    			type: 'usage-trends',
    			nextState: 'main.usage-trends'
    		},{
    			label: 'Monthly Overview',
    			type: 'energy-calendar',
    			nextState: 'main.energy-calendar'
    		},{
    			label: 'Environmental Impact',
    			type: 'environmental-impact',
    			nextState: 'main.environmental-impact'
    		},{
    			label: 'My Home Diet',
    			type: 'myhome-diet',
    			nextState: 'main.myhome-diet'
    		},{
    			label: 'Realtime Usage',
    			type: 'realtime-usage',
    			nextState: 'main.realtime-usage'
    		},{
    			label: 'Always On',
    			type: 'standby-power',
    			nextState: 'main.standby-power'
    		}];

    		MyenergyModel.getModel().then(function (response) {
    			$scope.data = response;
    			$scope.drawChart(parseFloat($scope.data.todayUsage));
    			$scope.myenergyItems[0].figure = '$ ' + $filter('setDecimal')($scope.data.monthBill, 2);
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
	            		data: [{
	            			y: todayUsage,
	            			color: todayUsage < (User.dailyPlan / 1000000) ? '#33cc33' : '#cc0000'
	            		}],
	            		dataLabels: {
		            		// format: '<div style="text-align: center; font-size: 24px;">{y}</div>' + 
		            		// '<div style="text-align: center; font-size: 14px;">kWh</div>',
		            		formatter: function () {
		            			return '<div style="text-align: center; font-size: 24px;">'
		            			+ $filter('setDecimal')(this.y, 2)
		            			+ '</div><div style="text-align: center; font-size: 14px;">kWh</div>'
		            		},
		            		useHTML: true
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
			                innerRadius: '75%',
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
			        	max: (User.dailyPlan / 1000000),
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
			            	innerRadius: '75%',
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