interface OverallData {
  name: string,
  value: number,
  id: string,
  compareToLastDay: number,
  compareToLastWeek: number,
  datedValues: {
    dates: string[],
    values: number[]
  }
}
export interface OverallDatas extends Array<OverallData> { }

interface Series {
  name: string
  data: number[],
  type: string,
  smooth: boolean,
  symbol: string,
  itemStyle: {
    normal: {
      lineStyle: {
        color: string
      }
    }
  }
}
export interface SeriesSet extends Array<Series> { }
