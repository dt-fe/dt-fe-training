import React from 'react';
// import request from '../../fetch';
import "./charts.css"
import * as echarts from 'echarts';
// import echarts from 'echarts/lib/echarts'
import moment from 'moment';



class Chart extends React.Component {
    constructor(props) {
        let current = moment().local("zh-cn").format("YYYY-MM-DD")
        let weekAgo = moment().subtract(7, "days").format("YYYY-MM-DD")
        super(props);
        this.state = {
            // legendData: [],
            source: [],
            series: [],
            date:[current, weekAgo]//初始选中date，最近一周
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
        // console.log(oldarr);
        var maxLength = this.getMaxLength(oldarr);
        if (!maxLength) return oldarr
        var rowarr = []
        for (var k = 0; k < oldarr.length; k++) {
            for (var m = 0; m < maxLength; m++) {
                if (!rowarr[m]) rowarr[m] = [];
                rowarr[m].push(oldarr[k][m]);
            }
        }
        return rowarr;
    }
    //在加载成功前初始化图表占位
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

    componentDidUpdate(prevProps) {
        // console.log(this.state.source);
        // if(this.props.options === []){
        //     this.setState({
        //         source: [],
        //         series: []
        //     })
        // }
        let option = {
            title: {
                subtext: `已选 ${this.props.options.length}/ ${prevProps.com.length}`,
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
                axisLabel:{interval:0} //这里是为了阻止echarts类目轴数字太多时，会隔一个显示一个
            },
            yAxis: {
                axisLabel: {//这个设置是为了y轴不显示数字
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
        if (nextProps.options === []) {
            this.setState({
                source: [],
                series: []
            })
        }
        if (this.props.idDates && this.props.date && this.props.idValues) {
            //以下操作获取props传值
            let date = new Array()
            if(nextProps != this.props.date){
                date = [nextProps.date[0], nextProps.date[1]]
                this.setState({
                    date: nextProps.date
                })
            }
            
            let legend = nextProps.idDates; //全部时间
            let leValue = nextProps.idValues;//全部的详细数据
            // console.log(legend);
            console.log(leValue);
            //对全部的时间转时间戳
            if(legend){
                legend = legend.map((item) => {
                    return (
                        moment(item).format().split("T")[0]
                    )
                })
            }
            
            //选中的时间在整个时间数组的位置，因此获取时间的
            let color = ['#5FABF9', '#FF9F4E', '#76D687', '#77E0DE', '#979CBD',
                '#FFC159', '#EC78BE', '#4DB8FF', '#FC8474', '#D26FF5', '#FF715F', '#875B9B'];
            let series = [];
            let i = legend.indexOf(date[0]), j = legend.indexOf(date[1]);//查找选中的时间
            console.log(i,j);
            let datesel = legend.slice(i, j + 1);//获取选中的时间段
            let valuesel = [];
            for (let k = 0; k < this.props.com.length; k++) {
                let tmp = leValue[k];//从数据的数组中获取
                if (!tmp) {
                    tmp = [0]
                }
                
                valuesel[k] = tmp.slice(i, j + 1)//获取选中时间段对应数据
                // console.log(valuesel);
            };
            console.log(valuesel);
            let tmp = this.changearr(valuesel), valueChange = [];//这里给数组横纵转换，以符合chartdata要求
            // console.log(tmp);
            //这里筛选出来一个
            if (tmp) {
                valueChange[0] = new Array()
                valueChange[0].push("pruduct")
                for (let i = 0; i < tmp.length; i++) {
                    valueChange[i + 1] = new Array();
                    valueChange[i + 1].push(datesel[i])
                    for (let j of nextProps.options) {
                        if (!valueChange[0].includes(this.props.com[j])) {
                            valueChange[0].push(this.props.com[j]) //这里在构成横坐标的数据
                            series.push({ type: 'line', smooth: 'true', symbol: 'none', color: color[j] })//这里能保证color是一一对应不会改变的
                        }
                        valueChange[i + 1].push(tmp[i][j])//这里填入选中时间对应的value数据
                    }
                }
            }
            // console.log(valueChange);
            this.setState({
                source: valueChange,
                series: series
            })
        }
    }
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
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



