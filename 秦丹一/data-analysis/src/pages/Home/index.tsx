import React, { useState, createContext, useEffect } from 'react';
import Menu from '../../components/Menu';
import SideMenu from '../../components/SideMenu';
import DateBar from '../../components/Datebar';
import ComplexSelect from '../../components/ComplexSelect';
import TrendChart from '../../components/TrendChart';
import IndexSelect from '../../components/IndexSelect';
import GoodsList from '../../components/GoodsList';
import styles from './index.module.scss';
import { getName, getTrend } from '../../service'
import { OverallDatas } from '../../types'



export const OverallContext = createContext<OverallContext>({
  selectedList: [],
  setSelectedList: () => { },
  overallData: [],
  setOverallData: () => { },
  time: [],
  setTime: () => { },
  selectedGoodsList: [],
  setSelectedGoodsList: () => { },
})

interface OverallContext {
  selectedList: string[]
  setSelectedList: any
  overallData: OverallDatas
  setOverallData: any
  time: string[]
  setTime: any
  selectedGoodsList: string[]
  setSelectedGoodsList: any
}



function Home() {

  const [selectedList, setSelectedList] = useState<string[]>([])
  const [selectedGoodsList, setSelectedGoodsList] = useState<string[]>(["pieceCount", "userCount", "paymentAmount"])
  const [overallData, setOverallData] = useState<any[]>([])
  const [time, setTime] = useState<string[]>([])

  useEffect(() => {
    getName().then(res => {
      const nameData = res.data as Array<any>
      Promise.all(nameData.map((item) => getTrend(item.id, time).then(res => res.data))).then(resList => {
        const newList = nameData.map((item, index) => {
          return {
            ...item,
            ...resList[index]
          }
        })
        setOverallData(newList)
      })
    });

  }, [time])


  return (
    <OverallContext.Provider value={{
      selectedList, setSelectedList,
      overallData, setOverallData, time,
      setTime, selectedGoodsList, setSelectedGoodsList
    }}>
      <div className={styles.body}>
        <SideMenu />
        <div className={styles.main}>
          <DateBar />
          <div className={styles.overall}>
            <div className={styles.overall_title}>整体分析</div>
            <div className={styles.overall_panel}>
              {/* <OverallContext.Provider value={{ selectedList }}> */}
              <ComplexSelect />
              <TrendChart />
              {/* </OverallContext.Provider> */}
            </div>
          </div>
          <div className={styles.category}>
            <div className={styles.category_title}>分类目分析</div>
            <div className={styles.category_panel}>
              <IndexSelect />
              <GoodsList />
            </div>
          </div>
        </div>
      </div>

    </OverallContext.Provider>

  )
}

export default Home;
