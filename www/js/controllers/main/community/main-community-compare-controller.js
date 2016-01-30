angular.module('enertalkHomeUSA.controllers')

    .controller('CommCompareCtrl', function ($scope, $state, CompareModel, Util, $timeout) {

        function init() {
            var current = new Date(),
                previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);

            $scope.chart1Header = Util.getMonthName(current.getMonth() + 1) + ' ' + current.getFullYear();
            $scope.chart2Header = Util.getMonthName(previous.getMonth() + 1) + ' ' + previous.getFullYear();
            $scope.colorIndex = ['#33cc33', '#ffcc00'];

            CompareModel.getModel().then(function (response) {
                $scope.dataList = response;
                drawCharts($scope.dataList[0], 0);
                drawCharts($scope.dataList[1], 1);
            });
        }

        function drawCharts(data, index) {
            var chartOptions = {
                    chart: {
                        type: 'bar',
                        renderTo: 'chart-' + (index + 1),
                        backgroundColor: 'transparent'
                    },
                    credits: {
                        enabled: false
                    },
                    legend:{
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            enabled: false
                        },
                        tickWidth: 0,
                        gridLineWidth: 0
                    },
                    xAxis: {
                        type: 'category',
                        title: {
                            text: ''
                        },
                        labels: {
                            enabled: true
                        },
                        tickWidth: 0
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        bar: {
                            pointPadding: 0.1,
                            dataLabels: {
                                enabled: true,
                                crop: false,
                                overflow: 'none',
                                formatter: function () {
                                    return (this.y / 1000000).toFixed(1);
                                }
                            }
                        }
                    },
                    series: [{
                        name: '',
                        data: [{
                            name: 'My Home',
                            y: data.usage,
                            drilldown: 'My Home',
                            color: $scope.colorIndex[0]
                        },{
                            name: 'Neighbors',
                            y: data.average,
                            drilldown: 'Neighbors',
                            color: $scope.colorIndex[1]
                        }]
                    }]
                };

            new Highcharts.chart(chartOptions);
        }
        
        $scope.goToInfoSetting = function () {
            $timeout(function () {
                $state.go('main.info-setting');
            }, 300);
            $state.go('main.setting');
        };

        init();

    });