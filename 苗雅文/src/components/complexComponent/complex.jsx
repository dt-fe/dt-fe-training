import React from 'react';
import "./complex.css";
import request from '../../fetch';
import arrowdown from '../../assets/img/arrowdown.png';
import arrowup from '../../assets/img/arrowup.png'


class Top extends React.Component {
  // constructor(props) {
  //   super(props);
  // };
  render() {

    return (
      <div id="top">
        <h4>整体分析</h4>
      </div>
    )
  }
}

class ComplexCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plexarr: [],
      check: [],
      idDates: [],
      idValues: [],
      com: [] //全部的id数组
    }
    this.test = this.test.bind(this)
  }

  complexCheck(e) {  //用来做复杂筛选框的选中
    // console.log(e);
    let ck = e.target, checkarr = this.state.check;
    console.log(e.target);
    if (ck.checked === true) {
      checkarr.push(ck.id);
      console.log(document.getElementById('top' + ck.id));
      document.getElementById('top' + ck.id).style.visibility = ''
    } else {
      document.getElementById('top' + ck.id).style.visibility = 'hidden'
      if (checkarr.includes(ck.id)) {
        let index = checkarr.indexOf(ck.id)
        checkarr.splice(index, 1)
      }
    }
    this.setState({
      check: checkarr
    })
    this.props.getOption(this.state.check);
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.options);
     if(!nextProps.options.length){ 
      console.log("测试一下");
      let tmp =document.getElementsByClassName("show")
      for(let i =0; i< tmp.length; i++){
        tmp[i].style.visibility="hidden"
      }
     }
  }

  test() {
    console.log("测试成虫");
    for (let i = 0; i < this.state.plexarr.length; i++) {
      document.getElementById(i).checked = false
    }
  }

  componentDidMount() {
    let idDates1 = [];
    let idValues1 = []
    let com = [];
    let plexarr1 = [];

    this.props.onRef(this)

    let p1 = request({ //请求url获取id，并将所有id存储在com数组中
      url: '/overall',
      method: 'get',
    }).then(data => {
      com = data.data.map((item, index) => {
        return item.id
      })
      this.setState({
        com: com
      })
      return com
    }).catch((e) => {
      return "数据出错"
    })

    p1.then(data => { //获取id后，定义getDetail函数来，返回值为请求每个id详细内容的promise
      function getDetail(id) {
        return request({
          url: `/overall/${id}`,
          method: 'get'
        })
      }
      const requests = com.map(id => getDetail(id))
      let i = 0;
      Promise.all(requests)// Promise.all并发处理所有的请求，防止数据加载顺序混乱
        .then(details => {
          details.forEach(detail => {
            /* 渲染列表 */
            // console.log(detail);
            if (detail.err) {  //如果加载失败，将其数据填充为404，防止一个卡片报错影响全局加载
              detail = {
                data: {
                  "value": "404",
                  "compareToLastDay": "0.404",
                  "compareToLastWeek": "0.404",
                  "datedValues": {
                    "dates": [404],
                    "values": [404]
                  }
                }
              }
            }

            if (detail.data.value < 1) { //为value属性加百分号
              detail.data.value = (detail.data.value * 100).toFixed(2) + "%"
            }
            let arrow0, arrow1;
           
            arrow0 = detail.data.compareToLastDay.toString().split("")[0] === '-' ? arrowdown : arrowup;
            arrow1 = detail.data.compareToLastWeek.toString().split("")[0] === '-' ? arrowdown : arrowup;
            detail.data.compareToLastDay = arrow0 ? Math.abs (detail.data.compareToLastDay) : detail.data.compareToLastDay
            detail.data.compareToLastWeek = arrow1 ? Math.abs(detail.data.compareToLastWeek) : detail.data.compareToLastWeek
            detail.data.compareToLastDay = (detail.data.compareToLastDay * 100).toFixed(2) + "%"
            detail.data.compareToLastWeek = (detail.data.compareToLastWeek * 100).toFixed(2) + "%"
            if (detail.data.datedValues.dates[1]) {
              idDates1.push(detail.data.datedValues.dates)
            }//除非所有的url都有问题，否则一定能取到正确时间
            //因为是一一对应，可以分开保存在两个数组中来对应，用一个i即可
            idValues1.push(detail.data.datedValues.values)
           
           
            plexarr1.push(
              <div className="card" key={detail.data.value === "404" ? 404 + i : detail.data.value}>
                {/* {这里防止出现多个加载失败404后，key值重复} */}
                <div className="show" style={{ width: '100%', height: '3px', backgroundColor: '#1673ff', visibility: "hidden" }}  id={"top" + i} ></div>
                <div id="cardbtw">
                  <div className="incard">
                    <label htmlFor={i}>{com[i]}</label> <input onChange={(e) => this.complexCheck(e)} className="checkBox" type="checkbox" name={com[i]} id={i} />
                  </div>
                  <div className="incard">
                    <h3>{detail.data.value}</h3>
                  </div>
                  <div className="incard" style={{ clear:'both' }}>
                    <small style={{ float:'left' }}>较前一日 </small> <small style={{ float:'right' }}>{detail.data.compareToLastDay} 
                    <img style={{ width:'10px', height:'15px'}} src={arrow0}/> </small>
                  {/* <small style={{ float:'right' }} className="">  </small> */}
                  </div>
                  <div className="incard" style={{ clear:'both' }}>
                    <small styel={{ floa:'left' }}>较上周同期 </small> <small style={{ float:'right' }}>{detail.data.compareToLastWeek} 
                    <img style={{ width:'10px', height:'15px'}} src={arrow1}/> </small>
                  </div>
                </div>
              </div>)
            i++;
          });
          this.setState({
            plexarr: plexarr1,
            idDates: idDates1[0],
            idValues: idValues1
          })
          // this.props.getOption(this.state.check);
          this.props.getIdDate(this.state.idDates);
          this.props.getIdValue(this.state.idValues);
          // console.log(this.state.idValues);
          this.props.setCom(this.state.com)
        })
    })
  }

  render() {
    return (
      <div id="middleCard" style={{ height:'240px', width:'100%' }}>
        {
          this.state.plexarr
        }
      </div>
    )
  }
}


class Complex extends React.Component {
  render() {
    return (
      <div id="main">
        <Top />
        <hr />
        <ComplexCard getOption={this.props.getOption}
          getIdDate={this.props.getIdDate}
          getIdValue={this.props.getIdValue}
          onRef={this.props.onRef}
          setCom={this.props.setCom}
          options={this.props.options}
        // test={this.props.test}
        />
      </div>
    )
  }

}

export default Complex;