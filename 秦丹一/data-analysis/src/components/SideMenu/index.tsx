import React, { useState } from 'react'
import { Menu } from 'antd'
import { sideMenuList } from '../../data.json'
import styles from './index.module.scss'
import 'antd/dist/antd.css'



export default function SideMenu() {
  const [selectedKey, setSelectedKey] = useState(sideMenuList[0].key)
  window.addEventListener('scroll', () => {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // console.log(scrollTop);

    if (scrollTop < 280) {
      setSelectedKey('all')
    } else {
      setSelectedKey('category')
    }

  })
  function changeComponent(e: any) {

    setSelectedKey(key => e.key)

    if (e.key === 'all') {
      window.scrollTo(0, 0)
    } else if (e.key === 'category') {
      window.scrollTo(0, 3000)
    }

  }
  return (
    <div className={styles.sidemenu}>
      <div className={styles.sidemenu_deal}>
        {/* eslint-disable-next-line  */}
        <img className={styles.deal_icon} src={require('../../images/deal.png').default} />
        <div className={styles.deal_text}>交易</div>
      </div>
      <Menu
        mode='inline'
        defaultSelectedKeys={[sideMenuList[0].key]}
        selectedKeys={[selectedKey]}
      >
        {
          sideMenuList.map(item => {
            return (
              <Menu.Item
                key={item.key}
                //eslint-disable-next-line
                icon={<img className={styles.sidemenu_icon} src={require('../../images/sidemenu_icon.svg').default} />}
                onClick={changeComponent}

              >
                {item.name}
              </Menu.Item>
            )
          })
        }
      </Menu>
    </div>
  )
}
