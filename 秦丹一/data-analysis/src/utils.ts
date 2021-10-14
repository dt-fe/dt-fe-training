export function percentFormat(data: number, retain: number) {
  return (data * 100).toFixed(retain) + '%'
}

export function numberFormat(data: number, retain: number) {
  return Number(data.toFixed(retain)).toLocaleString()
}

export function datesFormat(data: String) {
  const arr = data.split(' ')
  const month = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
  }[arr[1]]
  return arr[3] + '-' + month + '-' + arr[2]
}

export function matchColor(data: string) {
  let lineColor = {
    '支付金额': '#5FABF9', '支付买家数': '#FF9F4E', '支付件数': '#76D687', '客单价': '#77E0DE', '人均支付件数': '#979CBD', '下单金额': '#FFC159', '下单买家数': '#EC78BE', '下单件数': '#4DB8FF', '询单-下单转化率': '#FC8474', '询单-支付转化率': '#D26FF5',
  }[data]
  return lineColor
}

export function handleSelect(selectedList: Array<string>, setSelectedList: ([]) => void, id: string) {
  if (selectedList.includes(id)) {
    setSelectedList(selectedList.filter((item) => {
      return item !== id
    }))
  } else {
    selectedList.push(id)
    setSelectedList(selectedList.slice(0))
  }
}

export function idToName(list: Array<any>, id: string) {
  return list.filter((i) => {
    return i.id === id
  })[0].name
}