export default{
    data() {
        return {
            seriesOptions: [{
                symbol: 'circle',
                symbolSize: 3,
                itemStyle: {
                    color: '#6F8EE6'
                },
                lineStyle: {
                    width: 1,
                    color: '#8FAEFE'
                },
                areaStyle: {
                    color: 'rgba(143, 174, 254, .24)'
                }
            }],
            otherOptions: {
                grid: {
                    left: 2,
                    right: 2,
                    top: 5,
                    bottom: 2
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: {show: false}
                },
                yAxis: {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax',
                    axisLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: {show: false},
                    splitLine: {show: false}
                },
            }
        }
    },
    methods: {
        getCellStyle({row, column}) {
            let prop = column.property,
                data = row[prop]
            let style = ''
            if (row.isSummary) {
                style += 'font-weight: bold; background: #f5f5f5;'
            }
            if (prop == 'change') {
                if (['增持', '新进', '上升'].includes(data)) {
                    style += 'color: #FD484C;'
                }
                if (['减持', '下降'].includes(data)) {
                    style += 'color: #50C75A;'
                }
            }
            return style
        },
        formatData(data) {
            if(data === 0) return '0%'
            if (!data) return '--'
            return (data * 100).toFixed(2) + '%'
        },
    }
}