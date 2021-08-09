import React from 'react';
// import request from '../../fetch';
import "./charts.css"
import * as echarts from 'echarts';
// import echarts from 'echarts/lib/echarts'
import { Card } from 'antd';
import moment from 'moment';
import { color } from 'echarts';


class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            legendData: [],
            source: [],
            series: []
        }
        this.getMaxLength = this.getMaxLength.bind(this);
    };
    //将数组的行变成列，列改变为行
    getMaxLength(arr) {
        var max = 0;
        if (!arr) return max;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].length > max) {
                max = arr[i].length;
            }
        }
        return max;
    }
    changearr(oldarr) {
        console.log(oldarr);
        var maxLength = this.getMaxLength(oldarr);
        if (!maxLength) return oldarr
        //console.log(maxLength);
        var rowarr = [], rowoldarr = [];
        for (var k = 0; k < oldarr.length; k++) {
            for (var m = 0; m < maxLength; m++) {
                if (!rowarr[m]) rowarr[m] = [];
                rowarr[m].push(oldarr[k][m]);
                if (!rowoldarr[m]) rowoldarr[m] = [];
                rowoldarr[m].push(oldarr[k][m]);
            }
        }
        //console.log(rowarr);
        return rowarr;
    }
    initBarEcharts() {
        let myChart = echarts.init(document.getElementById('main'));
        let options = {
            title: { text: 'ECharts 入门示例' },
            tooltip: {},
            xAxis: {
                data: this.state.data
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
            }]
        };
        myChart.setOption(options, true)
    }

    componentDidMount() {
        var mychart = echarts.init(this.node)
    }

    componentWillMount() {
    }

    componentDidUpdate(nextProps) {
        // console.log(this.state.source);
        let option = {
            title: {
                subtext: `已选 ${this.props.options.length}/ ${nextProps.com.length}`,
                right: 50
            },
            grid: {
                width: "100%",
                left: 70
            },
            legend: {
                left: 50,
                icon: "rect",
                itemHeight: 10,
                itemWidth: 10
            },
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                show: "true",
                feature: {
                    myReset: {
                        show: true,
                        title: '重置',
                        icon: 'path://M512 842.66666667c-102.4 0-201.6-38.4-278.4-108.8-12.8-12.8-12.8-32-3.2-44.8 12.8-12.8 32-12.8 44.8-3.2 64 57.6 150.4 92.8 236.8 92.8 195.2 0 352-156.8 352-352S707.2 74.66666667 512 74.66666667c-172.8 0-316.8 121.6-345.6 291.2-3.2 19.2-19.2 28.8-38.4 25.6-16-3.2-28.8-19.2-25.6-38.4C137.6 154.66666667 310.4 10.66666667 512 10.66666667c230.4 0 416 185.6 416 416s-185.6 416-416 416z',
                        onclick: this.props.clearOption
                    },
                }
            },
            dataset: [{
                id: 'dataset_raw',
                source: this.state.source
            },
            ],
            // 类目轴category
            xAxis: {
                show: 'false',
                type: 'category',
                axisLabel:{interval:0}
            },
            yAxis: {
                axisLabel: {
                    formatter: function () {
                        return "";
                    }
                }
            },
            series:
                this.state.series
        }
        var mychart = echarts.init(this.node)
        mychart.setOption(option, true)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.idDates && this.props.date && this.props.idValues) {
            //以下操作获取props传值
            let date = new Array()
            date = [nextProps.date[0], nextProps.date[1]]
            let legend = nextProps.idDates; //全部时间
            let leValue = nextProps.idValues;//全部的详细数据
            //对选中的时间转时间戳
            legend = legend.map((item) => {
                return (
                    moment(item).format().split("T")[0]
                )
            })
            //选中的时间在整个时间数组的位置，因此获取时间的
            let color = ['#5FABF9', '#FF9F4E', '#76D687', '#77E0DE', '#979CBD',
                '#FFC159', '#EC78BE', '#4DB8FF', '#FC8474', '#D26FF5', '#FF715F', '#875B9B'];
            let series = [];
            let i = legend.indexOf(date[0]), j = legend.indexOf(date[1]);
            let datesel = legend.slice(i, j + 1);//获取选中的时间段
            let valuesel = [];
            for (let k = 0; k < this.props.com.length; k++) {
                let tmp = leValue[k];//从数据的数组中获取
                if (!tmp) {
                    tmp = [0]
                }
                valuesel[k] = tmp.slice(i, j + 1)//获取选中时间段对应数据
            };
            let tmp = this.changearr(valuesel), valueChange = [];
            console.log(tmp);
            //这里筛选出来一个
            if (tmp) {
                valueChange[0] = new Array()
                valueChange[0].push("pruduct")
                for (let i = 0; i < tmp.length; i++) {
                    valueChange[i + 1] = new Array();
                    valueChange[i + 1].push(datesel[i])
                    for (let j of nextProps.options) {
                        if (!valueChange[0].includes(this.props.com[j])) {
                            valueChange[0].push(this.props.com[j])
                            series.push({ type: 'line', smooth: 'true', symbol: 'none', color: color[j] })
                        }
                        valueChange[i + 1].push(tmp[i][j])
                    }
                }
            }
            this.setState({
                source: valueChange,
                series: series
            })
            // console.log(series);
            // console.log(valueChange);
            //以下做series格式化  [ { type: 'line', smooth: 'true', color: '#5FABF9' }, {}]
            //以下开始格式化数据符合source格式，然后传入echarts
            // let valueDate = []
            // valueDate[0] = datesel//日期永远排在最前面，用作product
            // for (let k = 0; k < nextProps.options.length; k++) {
            //     valueDate[k + 1] = valuesel[k]
            // }

            // let valChange = this.changearr(valueDate)//这里将数组扁平化赋值，以符合dataset的格式
            // let com = []
            // com[0] = ["product"].concat(this.props.com);//在数组第一行添加一个product元素以符合格式
            // //将product的id元素与日期对应的数值合成数组
            // for (let k = 0; k < datesel.length; k++) {
            //     com[k + 1] = valChange[k]
            // }
            // console.log(com);
            // console.log(nextProps.options);

        }
    }

    render() {
        return (
            <div id="chart">
                <div id="inchart" ref={node => this.node = node} style={{ height: "400px", background: 'white' }}></div>
            </div>
        )
    }
}

export default Chart;



