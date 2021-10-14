import React, { useEffect, useContext, useState } from 'react'
// import G2 from '@antv/g2';
import styles from './index.module.scss';
import { OverallContext } from '../../pages/Home/index'
import { datesFormat, matchColor } from '../../utils'
import { OverallDatas, SeriesSet } from '../../types'
import * as echarts from 'echarts';


export default function TrendChart() {


  const { selectedList, setSelectedList, overallData } = useContext(OverallContext)
  const [chartData, setChartData] = useState<any[]>([])
  useEffect(() => {

    //筛选出选中的数据集合
    const selectedData = overallData.filter((item) => {
      return selectedList.includes(item.id)
    })
    //准备好日期
    if (!selectedData.length) { echarts.init(document.getElementById('chart') as HTMLElement).dispose(); return }
    const date = selectedData[0].datedValues.dates.map(item => {
      return datesFormat(item)
    })
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chart') as HTMLElement);
    //重置图表大小
    myChart.resize({
      width: 1400,
      height: 400
    });
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      legend: {
        itemGap: 20,
        left: 'left',
        itemWidth: 10,
        itemHeight: 10,
        icon: 'rect',
        textStyle: {
          fontSize: 12,
          color: '#666666'
        },
        data: selectedList
      },
      grid: {
        right: 31,
        x: 0,
        x2: 31,
        y2: 10,
        borderWidth: 1,
        containLabel: true
      },
      xAxis: {
        data: date,
        boundaryGap: false,
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 'auto'
        }
      },
      yAxis: {
        axisLine: {
          show: false,//不显示坐标轴线
        },
        axisLabel: {
          show: false,//不显示坐标轴上的文字
        },
      },
      series: lineChartDataLoader(selectedData)
    });
  }, [selectedList])

  //动态的加载折线
  function lineChartDataLoader(data: OverallDatas) {
    let series: SeriesSet = [];
    data.map(item => {
      series.push({
        name: item.id,
        data: item.datedValues.values,
        type: 'line',
        smooth: true,
        symbol: 'none',
        itemStyle: {
          normal: {
            lineStyle: {
              color: matchColor(item.id) || '#FF715F'
            }
          }
        },
      })
    })
    return series;
  }
  //重置选项
  function reset() {
    setSelectedList([])
  }
  return (
    <div className={`${styles.trend_chart} ${selectedList.length === 0 ? '' : styles.hidden}`}>
      <div className={styles.info}>
        <span>已选{selectedList.length}/{overallData.length}</span>
        <div className={styles.reset} onClick={reset}>重置</div>
      </div>
      <div className={styles.unselected}>请选择指标查看趋势图</div>
      <div className={styles.chart} id="chart">
      </div>
    </div>

  )
}
