import React from 'react';
// import ReactDOM, { findDOMNode } from 'react-dom';
import datalist from "../../nav.json";
import "./nav.css";
import { Router, Route, Link, BrowserRouter, Switch } from 'react-router-dom'
import moment from 'moment';

import tradeURL from "../../assets/img/trade.svg";
import Data from '../dataComponent/data';
import Complex from '../complexComponent/complex';
import Chart from '../chartComponent/charts';
import Target from '../targetComponent/target';




class Leftnav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lid: "",
      data: [],
      date: [],
      idDates: [], //数据全部日期，一维数字[100]
      idValues: [0],//每个id对应的全部value[10][100]
      select: "",//左侧
      list:["整体分析", "分类目分析"],
      li:["complex", "target"]
    }
  };

  sel(event) {  //这个用来做选中效果
    let lab = event.currentTarget.id;
    this.setState({
      lid: lab,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.offset < 500) {
      this.setState({
        lid:"li0"
      })
    } else {
      this.setState({
        lid:"li1"
      })
    }
  }

  render() {
    return (
      <div id="aside">
        <div className="asideTop">
          <img id="asideimg" alt="svg图片，无特殊意义" src={tradeURL} ></img>
          <h4>交易</h4>
        </div>
        <ul>
          {
            this.state.list.map((item, index) => {
              return (
                 <li id={"li"+index} className={this.state.lid === "li"+index ? "selected" : "null"}
            onClick={(e) => {this.sel(e); this.props.scrollToAnchor(this.state.li[index])}}>
            <span>
              <a name="miao"><i className="iconfont icon-shuju"></i>{this.state.list[index]}</a></span>
          </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: datalist.data,
      arr: [],
      arrli: [],
      select: "selected",
      // date: ["2021-08-01", "2021-08-13"], //选中的日期
      date: [],
      options: [], //选中的复杂组件
      complex: [],  //complex组件
      com: [],  //全部id
      offset: ""
    };
    this.dateChange = this.dateChange.bind(this);
    this.optionChange = this.optionChange.bind(this);
    this.getIdDate = this.getIdDate.bind(this);
    this.getIdValue = this.getIdValue.bind(this);
    this.clearOption = this.clearOption.bind(this);
    this.onRef = this.onRef.bind(this);
    this.setCom = this.setCom.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollToAnchor = this.scrollToAnchor.bind(this)
  };

  setCom(value) {  //获取全部id组
    this.setState({
      com: value
    })
  }

  dateChange(value) { //获取选中的日期
    this.setState({ date: value }, () => {
      // console.log(this.state.date);
    });
  }

  optionChange(value) { //获取选中的复杂筛选框
    this.setState({
      options: value
    })
  }

  getIdDate(value) { //获取id中的全部时间
    this.setState({
      idDates: value
    })
  }

  getIdValue(value) { //获取id中的全部时间对应的value
    this.setState({
      idValues: value
    })
    // console.log(this.state.idValues);
  }

  clearOption() { //清空选择
    this.setState({
      options: [],
    })
    this.state.complex.test()
  }

  onRef(ref) {  //获取complex组件
    this.setState({
      complex: ref
    })
    // console.log(ref);
  }

  handleScroll() {
    this.setState({
      offset: window.pageYOffset
    })
  }

  scrollToAnchor(anchorName) {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }
  }

  componentDidMount() {
    //反显组件
    window.addEventListener("scroll", this.handleScroll)
  }

  render() {
    return (
      <div className="nav">
        <div style={{ width: '100%', height: '50px' }}>
          <header id="header">
            <ul className="box">
              {
                this.state.test.map((item, index) => { //用来展示导航栏
                  let tmp = item.group.map((m, i) => {
                    if (m.name === "交易") {
                      return (<Link to="/"> <li className={"sig" + i} key={m.id}>  {m.name}</li> </Link>)
                    } else {
                      return (<Link to="/other"> <li className={"sig" + i} key={m.id}>  {m.name}</li> </Link>)
                    }
                  })
                  if (index === this.state.test.length - 1) return tmp;
                  return tmp.concat(<li>|</li>)
                })
              }
            </ul>
          </header>
        </div>

        <div className="content">
          <aside >
            <Leftnav
              // style={{ width:'150px', height:'100%'}}
              offset={this.state.offset}
              scrollToAnchor={this.scrollToAnchor}
            />
          </aside>
          <article style={{ marginLeft: "150px" }}>
            <Data getDate={this.dateChange} />
            <div id="complex">
              <Complex name="complex"
                date={this.state.date}
                getOption={this.optionChange}
                getIdDate={this.getIdDate}
                getIdValue={this.getIdValue}
                onRef={this.onRef}
                setCom={this.setCom}
                options={this.state.options}
              />
              <Chart date={this.state.date}
                options={this.state.options}
                idDates={this.state.idDates}
                idValues={this.state.idValues}
                clearOption={this.clearOption}
                com={this.state.com}
              />
            </div>
            <div id="target">
              <Target date={this.state.date}
              idValues={this.state.idValues} />
            </div>
            {/* <Input placeholder="请输入"/> */}
          </article>
        </div>
      </div>
    );
  }
};

export default Nav;

