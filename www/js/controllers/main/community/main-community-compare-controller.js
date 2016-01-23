angular.module('enertalkHomeUSA.controllers')

.controller('CommCompareCtrl', function ($scope, $state, CompareModel, $rootScope) {

    function init() {
        CompareModel.getYearData()
			.then(function (response) {
			    $scope.detailDataList = response;
			})
    }

    $scope.edit = function () {
        if (typeof $rootScope.home == 'undefined') {
            $rootScope.home = {};
        }
        $state.go('main.compare-edit')
    }

    function drawChart() {
        var barOptions = {
            chart: {
                type: 'column',
                renderTo: 'chart'
            },
            title: {
                text: ''
            },

            xAxis: {
                title: {
                    text: null
                },
                type: 'datetime',
                labels: {
                    enabled: false
                },
                lineWidth: 0,
                tickWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                plotLines: [{
                    value: $scope.plan,
                    color: '#999999',
                    width: 2,
                    label: {
                        enabled: false
                        // text: 'daily plan'
                    }
                }]
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '',
                data: $scope.dataList,
                color: '#2D71E7'
            }]
        };

        $scope.chart = new Highcharts.chart(barOptions);
    }

    $scope.removeZero = function (item) {
        return item.y > 0;
    };
    init();

});
