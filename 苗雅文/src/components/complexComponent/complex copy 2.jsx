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
      <div id="topnav">
        <h4>整体分析</h4>
      </div>
    )
  }
}

class ComplexCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plexarr: [], //存储全部的DOM
      check: ["0"],
      idDates: [],//存储的是获取到的前100天时间
      idValues: [],
      com: [], //全部的id数组
      date: [],
      detailAll: [],
      arrow: [],
      checked: [],
      visib: []
    }
    this.test = this.test.bind(this)
    this.getDetailData = this.getDetailData.bind(this)
    this.miao = this.miao.bind(this)
  }

  //checked用来控制check状态，check用来存储已经被选择的数量，也就是options
  complexCheck(e) {  //用来做复杂筛选框的选中
    let ck = e.currentTarget.id.split("t")[1], checkarr = this.state.check, checked = [], visib = []
    console.log(e.target);
    for (let i in this.state.detailAll) {
      visib.push("hidden")
      checked.push(false)
    }
    //循环生成的DOM，不变量是其所在的循环次数，也就是i，这里获取i，如果i存在在checkarr里，说明已经点击过，删掉。对应的checked状态也改变掉
    if (checkarr.includes(ck)) {
      let index = checkarr.indexOf(ck)
      checkarr.splice(index, 1)
    } else {
      checkarr.push(ck)
    }
    // console.log(checkarr);
    for (let i of checkarr) {//选中的选项卡全部checked=true
      checked[i] = checkarr[i] === true ? false : true
      visib[i] = "visible"
    }
    this.setState({
      check: checkarr,
      checked: checked,
      visib: visib
    })
    this.props.getOption(this.state.check);
  }


  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  }

  test() { //清除每个复杂筛选框 选项卡的选中
    let visib = [], checked = []
    for (let i in this.state.detailAll) {
      visib.push("hidden")
      checked.push(false)
    }
    console.log("测试成虫");
    this.setState({
      checked: checked,
      visib: visib,
      check: []
    })
  }

  miao() {
    return 123123
  }

  getDetailData(details, arrowdown, arrowup) {
    let checked = [];
    let idDates1 = [];
    let idValues1 = []
    let visib = []
    let arrow = [];//用来存储所有的箭头指向
    let detailAll = [];//用来存储所有的details

    details.forEach((detail, index) => {
      if (detail.err) {  //如果加载失败，将其数据填充为404，防止一个卡片报错影响全局加载
        detail = {
          success: "flase",
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
            arrow0 = detail.data.compareToLastDay.toString().split("")[0] === '-' ? arrowdown : arrowup; //判断正负号，决定上升还是下降
            arrow1 = detail.data.compareToLastWeek.toString().split("")[0] === '-' ? arrowdown : arrowup;//判断正负号，决定上升还是下降
            detail.data.compareToLastDay = arrow0 ? Math.abs(Number(detail.data.compareToLastDay) ) : Number(detail.data.compareToLastDay) 
            detail.data.compareToLastWeek = arrow1 ?Math.abs( Number(detail.data.compareToLastWeek)) :  Number(detail.data.compareToLastWeek)

            detail.data.compareToLastDay = (detail.data.compareToLastDay*100).toFixed(2)+'%'
            detail.data.compareToLastWeek = (Number(detail.data.compareToLastWeek) * 100).toFixed(2) + "%"

            if (detail.data.datedValues.dates[1]) {
              idDates1.push(detail.data.datedValues.dates)
            }//除非所有的url都有问题，否则一定能取到正确时间
            //因为是一一对应，可以分开保存在两个数组中来对应，用一个i即可
            idValues1.push(detail.data.datedValues.values)
            detailAll.push(detail)
            arrow.push([arrow0, arrow1])
            if(index === 0){
              checked.push(true)
            visib.push("visible")
            }
            checked.push(false)
            visib.push("hidden")
    });
    // return [detail.data.datedValues.values, detail, [arrow0, arrow1],false,"hidden"]
    return [idDates1, idValues1, detailAll, arrow, checked, visib]
  }

  componentDidUpdate(prevProps,prevState) {
    let _this = this
    let idDates1 = [];
    let idValues1 = []
    // let com = []; 
      if (prevProps.date !== this.props.date) {
    // p1.then(data => { //获取id后，定义getDetail函数来，返回值为请求每个id详细内容的promise
      function getDetail(id) {
        return request({
          url: `/overall/${id}?a=${_this.props.date[0]}&b=${_this.props.date[1]}`,
          method: 'get'
        })
      }

      const requests = this.state.com.map(id => getDetail(id))
      Promise.all(requests)// Promise.all并发处理所有的请求，防止数据加载顺序混乱
        .then(details => {
          let checked = [];
          let visib = []
          let arrow = [];//用来存储所有的箭头指向
          let detailAll = [];//用来存储所有的details
          details.forEach(detail => {
            if (detail.err) {  //如果加载失败，将其数据填充为404，防止一个卡片报错影响全局加载
              detail = {
                success: "flase",
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
            arrow0 = detail.data.compareToLastDay.toString().split("")[0] === '-' ? arrowdown : arrowup; //判断正负号，决定上升还是下降
            arrow1 = detail.data.compareToLastWeek.toString().split("")[0] === '-' ? arrowdown : arrowup;//判断正负号，决定上升还是下降
            detail.data.compareToLastDay = arrow0 ? Math.abs(detail.data.compareToLastDay) : detail.data.compareToLastDay
            detail.data.compareToLastWeek = arrow1 ? Math.abs(detail.data.compareToLastWeek) : detail.data.compareToLastWeek
            detail.data.compareToLastDay = (detail.data.compareToLastDay * 100).toFixed(2) + "%"
            detail.data.compareToLastWeek = (detail.data.compareToLastWeek * 100).toFixed(2) + "%"
            if (detail.data.datedValues.dates[1]) {
              idDates1.push(detail.data.datedValues.dates)
            }//除非所有的url都有问题，否则一定能取到正确时间
            //因为是一一对应，可以分开保存在两个数组中来对应，用一个i即可
            idValues1.push(detail.data.datedValues.values)
            detailAll.push(detail)
            arrow.push([arrow0, arrow1])
            checked.push(false)
            visib.push("hidden")
          });
          if (prevProps.date !== _this.props.date) {
            this.setState({
              idDates: idDates1[0],
              idValues: idValues1,
              detailAll: detailAll,
              arrow: arrow,
            })
            this.props.getIdDate(this.state.idDates);
            this.props.getIdValue(this.state.idValues);
            this.props.setCom(this.state.com)
          }
        })
  }
  }

  componentDidMount() {
    let _this = this
    let checked = [];
    let idDates1 = [];
    let idValues1 = []
    let visib = []
    let arrow = [];//用来存储所有的箭头指向
    let detailAll = [];//用来存储所有的details
    let com = [];
    this.props.onRef(this)
    this.state.check

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
          url: `/overall/${id}?a=${_this.props.date[0]}&b=${_this.props.date[1]}`,
          method: 'get'
        })
      }
      const requests = com.map(id => getDetail(id))
      Promise.all(requests)// Promise.all并发处理所有的请求，防止数据加载顺序混乱
        .then(details => {
          // let checked = [];
          // let visib = []
          // let arrow = [];//用来存储所有的箭头指向
          // let detailAll = [];//用来存储所有的details

          let detailDate = []
          // console.log(this.getDetailData(details))
          detailDate = this.getDetailData(details,arrowdown, arrowup)
          idDates1 = detailDate[0]
          idValues1 = detailDate[1]
          detailAll = detailDate[2]
          // console.log(detailAll);
          arrow = detailDate[3]
          checked = detailDate[4]
          visib = detailDate[5]
          // details.forEach((detail, index) => {
          //   if (detail.err) {  //如果加载失败，将其数据填充为404，防止一个卡片报错影响全局加载
          //     detail = {
          //       success: "flase",
          //       data: {
          //         "value": "404",
          //         "compareToLastDay": "0.404",
          //         "compareToLastWeek": "0.404",
          //         "datedValues": {
          //           "dates": [404],
          //           "values": [404]
          //         }
          //       }
          //     }
          //   }

          //   if (detail.data.value < 1) { //为value属性加百分号
          //     detail.data.value = (detail.data.value * 100).toFixed(2) + "%"
          //   }
          //   let arrow0, arrow1;

          //   arrow0 = detail.data.compareToLastDay.toString().split("")[0] === '-' ? arrowdown : arrowup; //判断正负号，决定上升还是下降
          //   arrow1 = detail.data.compareToLastWeek.toString().split("")[0] === '-' ? arrowdown : arrowup;//判断正负号，决定上升还是下降
          //   detail.data.compareToLastDay = arrow0 ? Math.abs(detail.data.compareToLastDay) : detail.data.compareToLastDay
          //   detail.data.compareToLastWeek = arrow1 ? Math.abs(detail.data.compareToLastWeek) : detail.data.compareToLastWeek
          //   detail.data.compareToLastDay = (detail.data.compareToLastDay * 100).toFixed(2) + "%"
          //   detail.data.compareToLastWeek = (detail.data.compareToLastWeek * 100).toFixed(2) + "%"
          //   if (detail.data.datedValues.dates[1]) {
          //     idDates1.push(detail.data.datedValues.dates)
          //   }//除非所有的url都有问题，否则一定能取到正确时间
          //   //因为是一一对应，可以分开保存在两个数组中来对应，用一个i即可
          //   idValues1.push(detail.data.datedValues.values)
          //   detailAll.push(detail)
          //   arrow.push([arrow0, arrow1])
          //   if(index === 0){
          //     checked.push(true)
          //   visib.push("visible")
          //   }
          //   checked.push(false)
          //   visib.push("hidden")
          // });
          this.setState({
            idDates: idDates1[0],
            idValues: idValues1,
            detailAll: detailAll,
            arrow: arrow,
            checked: checked,
            visib: visib
          })
          this.props.getIdDate(this.state.idDates);
          this.props.getIdValue(this.state.idValues);
          this.props.setCom(this.state.com)
          this.props.getOption(this.state.check);
        })
    })
  }

  render() {

    return (
      <div id="middleCard" style={{ height: '240px', width: '100%' }}>
        {
          this.state.detailAll.map((detail, i) => {
            return (
              <div className="card" key={detail.data.value === "404" ? 404 + i : detail.data.value}>
                {/* {这里防止出现多个加载失败404后，key值重复} */}
                <div className="show" style={{ width: '100%', height: '3px', backgroundColor: '#1673ff', visibility: this.state.visib[i] }} id={"top" + i} ></div>
                <div id="cardbtw" >
                  <button id={"bt" + i} onClick={(e) => this.complexCheck(e)} style={{ backgroundColor: "transparent", border: "0px", width: "100%" }}>
                    <div className="incard">
                      <label htmlFor={i}>{this.state.com[i]}</label> <input checked={this.state.checked[i]} className="checkBox" type="checkbox" name={this.state.com[i]} id={i} />
                    </div>
                    <div className="incard">
                      <h3>{detail.data.value}</h3>
                    </div>
                    <div className="incard" style={{ clear: 'both' }}>
                      <small style={{ float: 'left' }}>较前一日 </small> <small style={{ float: 'right' }}>{detail.data.compareToLastDay}
                        <img style={{ width: '10px', height: '15px' }} src={this.state.arrow[i][0]} /> </small>
                      {/* <small style={{ float:'right' }} className="">  </small> */}
                    </div>
                    <div className="incard" style={{ clear: 'both' }}>
                      <small style={{ float: 'left' }}>较上周同期 </small> <small style={{ float: 'right' }}>{detail.data.compareToLastWeek}
                        <img style={{ width: '10px', height: '15px' }} src={this.state.arrow[i][1]} /> </small>
                    </div>
                  </button>
                </div>
              </div>
            )
          })
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
          date={this.props.date}
          getIdDate={this.props.getIdDate}
          getIdValue={this.props.getIdValue}
          onRef={this.props.onRef}
          setCom={this.props.setCom}
          options={this.props.options}
        />
      </div>
    )
  }

}

export default Complex;