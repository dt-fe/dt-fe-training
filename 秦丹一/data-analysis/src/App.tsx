import React from 'react';
import Menu from './components/Menu';
import { menuGroups } from './data.json'
import styles from './App.module.scss';
import Home from './pages/Home';
//引入路由页面
import Realtime from './pages/Realtime';
import Stream from './pages/Stream';
import Commodity from './pages/Commodity';
import Trade from './pages/Trade';
import Marketing from './pages/Marketing';
import Service from './pages/Service';
import Logistics from './pages/Logistics';
import Finance from './pages/Finance';
import Market from './pages/Market';
import Race from './pages/Race';
import Academy from './pages/Academy';
import Access from './pages/Access';
import { Route, Redirect } from 'react-router-dom'

function App() {
  return (
    <div className={styles.App}>
      <Menu />
      {/* <Route path={`/home`} component={Home} />
      <Route path={`/realtime`} component={require('./pages/Realtime').default} />
      <Route path={`/stream`} component={Stream} />
      <Route path={`/Commodity`} component={Commodity} />
      <Route path={`/trade`} component={Trade} />
      <Route path={`/marketing`} component={Marketing} />
      <Route path={`/service`} component={Service} />
      <Route path={`/logistics`} component={Logistics} />
      <Route path={`/finance`} component={Finance} />
      <Route path={`/market`} component={Market} />
      <Route path={`/race`} component={Race} />
      <Route path={`/academy`} component={Academy} />
      <Route path={`/access`} component={Access} />
      <Redirect to="/home" /> */}


      {
        menuGroups.map((menuList) => {
          return (
            menuList.map(menuItem => {
              let com_name = menuItem.key.charAt(0).toUpperCase() + menuItem.key.substr(1);
              return (
                <Route path={`/${menuItem.key}`} component={require(`./pages/${com_name}`).default} />
              )
            })
          )
        })
      }
      <Redirect to="/home" />
    </div>
  )
}

export default App;
