import React, { useState, useEffect, useContext } from "react";
import { indexList } from '../../data.json'
import { percentFormat, numberFormat, idToName } from '../../utils'
import { getCategoryData } from '../../service'
import { OverallContext } from '../../pages/Home/index'
import styles from './index.module.scss'

export default function GoodsList() {

  const { time, selectedGoodsList } = useContext(OverallContext)
  const [categoryData, setCategoryData] = useState([] as Array<any>)
  const [categoryError, setCategoryError] = useState('')
  // const [selectedIndex, setSelectedIndex] = useState(selectedGoodsList)
  const selectedIndex = selectedGoodsList
  const [pageFlag, setPageFlag] = useState(0)
  const [maxOfpage, setMaxOfPage] = useState(10)
  const [freshCount, setFreshCount] = useState(0)



  useEffect(() => {
    const timer = setInterval(() => {
      setFreshCount(c => c++)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getCategoryData(time).then(res => {
      setCategoryData(res.data)
    })
  }, [freshCount, time])


  function handleChangePage(move: number) {
    setPageFlag(page => page + move)
  }

  function choosePage(page: number) {
    setPageFlag(page)
    console.log(page);

  }



  return (
    <div className={styles.category_analysis}>
      <div className={styles.list_item}>
        <label className={styles.order_name}>排行</label>
        {
          selectedIndex.map((item) => {
            return (
              <div key={item} className={styles.item_data}>
                <span>
                  {
                    idToName(indexList, item)
                  }
                </span>
                <div
                  className={`${styles.index_percentage} ${styles.move}`}

                >
                  占比
                  <div className={styles.percentage_change}>
                    <img src={require('../../images/percentage-dark.svg').default} />
                    <img src={require('../../images/percentage-light.svg').default} />
                  </div>

                </div>
              </div>
            )
          })
        }
        <span>操作</span>
      </div>
      {
        categoryData.slice(pageFlag * 10, pageFlag * 10 + maxOfpage - 1).map((item, index) => {
          return (
            <div key={index} className={styles.list_item}>
              <div className={styles.order_name}>
                <span className={styles.order}>
                  {
                    {
                      0: (
                        <label className={styles.champion_number}>
                          <img src={require('../../images/champion.svg').default} />
                          <span>{index + 1}</span>
                        </label>
                      ),
                      1: (
                        <label className={styles.champion_number}>
                          <img src={require('../../images/champion.svg').default} />
                          <span>{index + 1}</span>
                        </label>
                      ),
                      2: (
                        <label className={styles.champion_number}>
                          <img src={require('../../images/champion.svg').default} />
                          <span>{index + 1}</span>
                        </label>
                      )
                    }[pageFlag * maxOfpage + index]
                    ?? (pageFlag * maxOfpage + index + 1)
                  }
                </span>
                {item.name}
              </div>
              {
                selectedIndex.map((indexItem) => {
                  return (
                    <div key={indexItem} className={styles.item_data}>
                      <span>
                        {numberFormat(item[indexItem], 0)}
                      </span>
                      <div className={styles.index_percentage}>{percentFormat(item[indexItem + 'Percentage'], 2)}</div>
                    </div>
                  )
                })
              }
              <a className={styles.link} href="https://ant.design/index-cn">趋势</a>
            </div>

          )
        })
      }
      <div className={styles.list_footer}>
        <span
          className={`${styles.neighbour_page} ${pageFlag === 0 ? styles.no_neighbour : ''}`}
          onClick={handleChangePage.bind(null, -1)}
        >
          <img
            src={require(`../../images/lastpage.svg`).default}
          />
          上一页
        </span>
        {
          Array.from(new Array(Math.ceil(categoryData.length / maxOfpage))).map((item, index) => {
            return (
              <div
                key={index}
                className={`${styles.page_number} ${pageFlag === index ? styles.current_page : ''}`}
                onClick={choosePage.bind(null, index)}
              >
                {index + 1}
              </div>
            )
          })
        }

        <span
          className={`${styles.neighbour_page} ${pageFlag === Math.ceil(categoryData.length / maxOfpage - 1) ? styles.no_neighbour : ''}`}
          onClick={handleChangePage.bind(null, 1)}
        >
          下一页
          <img src={require('../../images/nextpage.svg').default} />
        </span>
      </div>
    </div>
  )
}