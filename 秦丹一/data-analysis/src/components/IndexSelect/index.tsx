import React, { useState, useEffect, useRef, useContext } from 'react'
import { handleSelect, idToName } from '../../utils'
import { indexList } from '../../data.json'
import { OverallContext } from '../../pages/Home/index'
import styles from './index.module.scss'
import Search from 'antd/lib/transfer/search'

export default function IndexSelect() {

  const { selectedGoodsList, setSelectedGoodsList, } = useContext(OverallContext)
  const [pullActive, setPullActive] = useState(false);
  const [inputShowMax, setInputShowMax] = useState(11)
  const [renderList, setRenderList] = useState([] as Array<string>)
  const [searchKey, setSearchKey] = useState('')


  useEffect(() => {
    setRenderList([])
  }, [selectedGoodsList])

  useEffect(() => {
    if (!renderList.length) {
      let lenghthSum = 0
      for (const item of selectedGoodsList) {
        var name = idToName(indexList, item)
        lenghthSum += name.length + 1
        if (lenghthSum > inputShowMax) {
          return;
        } else {
          renderList.push(item)
          setRenderList(renderList => renderList.slice(0))
        }
      }
    }
  }, [renderList])

  //展开下拉框
  function pullSelectionList() {
    setPullActive(!pullActive)
  }

  //在input框删除选中指标
  function handleDeleteInput(event: any) {
    const { keyCode } = event
    //判断按下的是不是删除
    if (keyCode !== 8) return
    selectedGoodsList.pop()
    setSelectedGoodsList(selectedGoodsList.slice(0))
  }

  //删除选中的指标
  function handleDeleteIndex(id: string) {
    setSelectedGoodsList(selectedGoodsList.filter((item) => {
      return item !== id
    }).slice(0))
  }

  //全选
  function selectAll() {
    if (selectedGoodsList.length === indexList.length) {
      setSelectedGoodsList([])
    } else {
      setSelectedGoodsList(indexList.map(item => item.id))
    }
  }

  //取消选择
  function handleCancle() {
    setSelectedGoodsList([])
    setPullActive(false)
  }

  //确定已选
  function handleAffirm() {
    setPullActive(false)
  }
  //获取搜索关键词
  function searchInput(e: any) {
    if (e.keyCode !== 13) return
    setSearchKey(e.target.value)
    console.log(e.target.value);

  }

  return (
    <div className={`${styles.category_select} ${pullActive ? styles.show : ''}`} onKeyDown={handleDeleteInput} tabIndex={0}>
      <div className={styles.input}  >
        {
          selectedGoodsList.length === 0
            ? '请选择相关内容'
            : renderList.map((item) => {
              return (
                <label className={styles.selected_show}>
                  {idToName(indexList, item)}
                  <span onClick={handleDeleteIndex.bind(null, item)}> X</span>
                </label>
              )
            })
        }
        {
          renderList.length === selectedGoodsList.length
            ? ''
            : <label className={styles.selected_show}>
              +{selectedGoodsList.length - renderList.length}</label>
        }
        <span className={styles.imitate_input}>|</span>
        <img
          onClick={pullSelectionList}
          src={require(`../../images/pull.svg`).default}
          className={styles.select_icon}
        />
      </div>
      <div className={styles.selections}>
        <input
          type='text'
          placeholder='搜索关键词'
          className={styles.selections_search}
          onKeyUp={searchInput}
        />
        <ul className={styles.selections_list}>
          {
            indexList.map((item) => {
              return (
                <li
                  className={`${styles.selections_item} ${item.name.includes(searchKey) ? '' : styles.hidden}`} key={item.id}
                  onClick={handleSelect.bind(null, selectedGoodsList, setSelectedGoodsList, item.id)}
                >
                  <label className={styles.item_label}>
                    <img
                      src={require(`../../images/${selectedGoodsList.includes(item.id) ? '' : 'un'}selected-square.svg`).default}
                      className={styles.label_checkbox}
                    />
                    <span>{item.name}</span>
                  </label>
                </li>
              )
            })
          }
        </ul>
        <div className={styles.footer}>
          <label onClick={selectAll}>
            <img src={require(`../../images/${selectedGoodsList.length === indexList.length ? '' : 'un'}selected-square.svg`).default} className={styles.label_selectall} />
            <span>全选</span>
          </label>
          <div className={styles.delete_affirm}>
            <div className={styles.delete} onClick={handleCancle}>取消</div>
            <div className={styles.affirm} onClick={handleAffirm}>确认</div>
          </div>
        </div>
      </div>
    </div>


  )
}
