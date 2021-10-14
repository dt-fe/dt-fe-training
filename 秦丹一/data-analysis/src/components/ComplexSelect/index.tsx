import React, { useState, useContext } from 'react'
// import { getOverall } from '../../service';
import styles from './index.module.scss';
import up from '../../images/up.svg'
import down from '../../images/down.svg'
import { percentFormat, numberFormat, handleSelect } from '../../utils'
import { OverallContext } from '../../pages/Home/index'


export default function ComplexSelect() {

  const { selectedList, setSelectedList,
    overallData, setOverallData
  } = useContext(OverallContext)
  const [error, setError] = useState(false)


  return (
    <div className={`${styles.selection} ${overallData.length === 0 ? '' : styles.loading_hidden}`}>
      {
        overallData.map((item) => {
          return (
            <div
              className={`${styles.select_card} ${selectedList.includes(item.id) ? '' : styles.hidden}`}
              key={item.id}
              onClick={handleSelect.bind(null, selectedList, setSelectedList, item.id)}
            >
              <div className={styles.card_selectedline}></div>
              <div className={styles.card_title}>{item.name}</div>
              {/* eslint-disable-next-line */}
              <img src={require('../../images/selected-round.svg').default} className={styles.card_selectedicon} />
              <div className={styles.card_value}>
                {
                  item.value > 1
                    ? numberFormat(item.value, 0)
                    : percentFormat(item.value, 2)
                }
              </div>
              <div className={styles.card_compare}>
                <div className={styles.compareToLastDay}>
                  <div className={styles.compare_text}>较前一日</div>
                  <div>{percentFormat(item.compareToLastDay, 2)}</div>
                  <img src={item.compareToLastDay < 0 ? down : up} className={styles.compare_icon} />
                </div>
                <div className={styles.compareToLastWeek}>
                  <div className={styles.compare_text}>较上周同期</div>
                  <div className={styles.compare_value}>
                    {percentFormat(item.compareToLastWeek, 2)}
                    <img src={item.compareToLastWeek < 0 ? down : up} className={styles.compare_icon} />
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
      <div className={styles.loading}>
        <img className={styles.loading_icon} src={require('../../images/loading.svg').default} />
        正在加载数据......
      </div>
    </div>

  )
}
