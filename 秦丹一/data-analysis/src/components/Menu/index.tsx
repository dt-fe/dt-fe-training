import React from 'react'
import { menuGroups } from '../../data.json'
import styles from './index.module.scss'
import { NavLink, Route } from 'react-router-dom'

export default function Menu() {
  return (
    <div className={styles.menu}>
      {
        menuGroups.map((menuList, index) => {
          return (
            <div className={styles.menu_list} key={index}>
              {
                menuList.map(menuItem => {
                  return (

                    <NavLink activeClassName="chose" to={`/${menuItem.key}`} className={styles.menu_item} key={menuItem.key}>{menuItem.name}</NavLink>

                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}
