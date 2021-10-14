import React, { useContext } from 'react'
import { DatePicker } from 'antd'
import { OverallContext } from '../../pages/Home/index'
import styles from './index.module.scss'

const { RangePicker } = DatePicker;
// interface DateBarProps {
//   onChange: (dates: RangeValue<Moment>, dateStrings: [string, string]) => void
// }

export default function DateBar() {

  const { setTime } = useContext(OverallContext)


  function getDates(date: any, dateString: string[]) {
    const time: string[] = []
    dateString.map(item => {
      const date = new Date(item)
      time.push(date.getTime().toString())
    })
    return setTime(time)
  }

  return (
    <div className={styles.datebar}>
      <RangePicker
        format='YYYY-MM-DD'
        bordered={false}
        allowClear={false}
        inputReadOnly={true}
        suffixIcon={<span></span>}
        separator={<span>至</span>}
        placeholder={['起始日期', '终止日期']}
        onChange={getDates}
      />
    </div>
  )
}
