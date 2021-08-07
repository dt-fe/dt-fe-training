import React from 'react';
import { Select, Checkbox, Input, Divider, Card, Button, Table } from 'antd';
import { SearchOutlined, CaretUpOutlined, RightCircleFilled } from '@ant-design/icons';
import { useState, useMemo, useRef, useEffect } from 'react';
import "./target.css"
import request from '../../fetch';
import index from "../../assets/img/index.png";
import index2 from "../../assets/img/index2.png"
import index3 from "../../assets/img/index3.png"



function IndexPage(props) {
    // const options = [
    //     { label: '总支付金额', value: '总支付金额' },
    //     { label: '有效成交金额', value: '有效成交金额' },
    //     { label: '客单价', value: '客单价' },
    //     { label: '总利润', value: '总利润' },
    // ];
    (<button style={{ float:'right' }}>wrefwefd</button>)
    const [show, setShow] = useState("hidden")
    const [tmpvalue, setTmpvalue] = useState([])
    const [sortIndex, setsortIndex] = useState([])
    const [dataOption, setdataOption] = useState([])
    const [allOption, setallOption] = useState()
    const [options, setOptions] = useState([])
    const [fetchData, setFetch] = useState([])
    const [date, setDate] = useState(props.date)
    const [open, setOpen] = useState()
    const [value, setValue] = useState([]);
    const [inputValue, setInputValue] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);
    useEffect(() => {
        request({ //请求url获取id，并将所有id存储在com数组中
            url: `/category?a=${date[0]}&b=${date[1]}`,
            method: 'get',
        })
            .then(data => {
                let tmp = Object.keys(data.data[0]);
                tmp.shift()
                let arr = []
                for (let i = 0; i < tmp.length; i++) {
                    arr.push({ label: tmp[i], value: tmp[i] })
                    i++
                }
                console.log(arr);
                setOptions(arr)
                setFetch(data.data)
                let brr = new Map();
                for (let i = 0; i < tmp.length; i++) {
                    brr.set(tmp[i], tmp[i + 1])
                    i++
                }
                setallOption(brr)
                let crr = [];
                for (let i = 0; i < tmp.length; i++) {
                    crr.push(tmp[i])
                }
                setdataOption(crr)
            }).catch((e) => {
                return "概率性报错"
            })
    }, [props.date])
    console.log(allOption);
    const columns = [
    //     {
    //     title: "排行",
    //     dataIndex: "排行",
    //     width: "2%",
    //     colSpan: 2,
    // },
    {
        title: '',
        dataIndex: "排行",
        width: "2%",
        // colSpan: 2,
        render:(text,record,index)=>{
            if (index === 0 || index === 1 || index === 2) {
                return sortIndex[index];
            }
            else {
                return  `${index+1}`
            }
           
    },
      },
    {
        title: "排行",
        dataIndex: "name",
        width: "10%",
        // colSpan: 1
    }];
    // for (let i = 0; i < value.length; i++) {

    //     columns.push({
    //         title: value[i],
    //         dataIndex: value[i],
    //         width: "5%",
    //         fixed:"left"
    //     })
    //     columns.push({
    //         title: "占比",
    //         dataIndex: allOption.get(value[i]),
    //         width: '10%',
    //         sorter: {
    //             compare: (a, b) => +a[allOption.get(value[i])].replace("%", "") - (+b[allOption.get(value[i])].replace("%", "")),
    //         },
    //     })
    // }
        for (let i = 0; i < tmpvalue.length; i++) {

        columns.push({
            title: tmpvalue[i],
            dataIndex: tmpvalue[i],
            width: "5%",
            fixed:"left"
        })
        columns.push({
            title: "占比",
            dataIndex: allOption.get(tmpvalue[i]),
            width: '10%',
            sorter: {
                compare: (a, b) => +a[allOption.get(tmpvalue[i])].replace("%", "") - (+b[allOption.get(tmpvalue[i])].replace("%", "")),
            },
        })
    }
    columns.push({
        title: '操作',
        fixed: 'right',
        width: 100,
        render: () => <a href="https://ant.design/index-cn">趋势</a>,

    })
    useEffect(() => {
        let tmp = []
        for (let i = 0; i < fetchData.length; i++) {
            if (i === 0) {
                tmp.push(<img src={index} ></img>);
            } else if (i === 1) {
                tmp.push(<img src={index2} ></img>);
            } else if (i === 2) {
                tmp.push(<img src={index3} ></img>);
            } else {
                tmp.push(++i);
            }
        }
        setsortIndex(tmp)
    }, [fetchData])
    console.log(sortIndex);

    const data = [];
    if (fetchData) {
        for (let i = 0; i < fetchData.length; i++) {
            let obj = {}
            obj["key"] = i + 1;
            // if (i === 0 || i === 1 || i === 2) {
            //     obj["排行"] = sortIndex[i];
            // }
            // else {
            //     obj["排行"] = i + 1;
            // }

            obj["name"] = fetchData[i].name;
            let j = 0
            while (j < dataOption.length) {
                if (fetchData[i][dataOption[j]] < 1) { obj[dataOption[j]] = (fetchData[i][dataOption[j]] * 100).toFixed(2) + "%" } else {
                    obj[dataOption[j]] = fetchData[i][dataOption[j]]
                }
                j++;
            }
            data.push(obj)
        }
    }
    console.log(data);

    const displayOptions = useMemo(() => {
        return options.filter(option => option.label.includes(inputValue));
    }, [inputValue, options])
    console.log(options);
    useEffect(() => {
        setDate(props.date)
    })
    console.log(fetchData);
    function Buttom() {
        return (
            <div style={{ paddingTop: '8px' }}>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>全选</Checkbox>
                <span style={{ float: 'right' }}>
                    <Button size="small" style={{ margin: 8 }} onClick={cancle}>取消</Button>
                    <Button type="primary" size="small" onClick={confirm}>确认</Button>
                </span>
            </div>
        )
    }

    const onCheckAllChange = e => {
        let tmp = options.map((item) => {
            return item.value
        })
        setValue(e.target.checked ? tmp : [])
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const onChange = list => {
        setValue(list);
        // setTmpvalue(list)
        console.log(tmpvalue);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
    };

    const cancle = () => {
        setCheckAll(false);
        setValue(tmpvalue);
        setOpen(false);
        inputEl.current.blur()

    }
    const inputEl = useRef(null);

    const confirm = () => {
        setOpen(false)
        setValue(value)
        setTmpvalue(value)
        inputEl.current.blur()
        console.log(inputEl.current);
    }
    const onFocus = () => {
        setOpen(true)
        console.log(inputEl.current);
    }

    // const onMouseEnter = () => {
    //     console.log('asdas');
    //     // setShow('visible')
    //     setOptions(options)
    // }
    const onMouseLeave = () => {
        setShow('hidden')
    }
    const onMouseOver = () => {
         setShow('visible')
    }

    const btnClick = ()=>{
        setValue([]);
        setTmpvalue([])
        setCheckAll(false)
        // document.getElementsByTagName(Select).props.style.userSelect=("none")
    //    console.log(document.getElementsByTagName(Select).props); 
    }

    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页`</a>;
        }
        if (type === 'next') {
            return <a>下一页</a>;
        }
        return originalElement;
    }
    const pagination1 = {
        defaultCurrent: 1,
        pageSizeOptions: [10],
        showSizeChanger: false,
        itemRender: itemRender
    }

    return (
        <div>
            <div id="select" >
                <span style={{ zIndex:'10',position: 'relative', left: '46%', bottom: '10px' }} 
                onMouseOver={onMouseOver} onMouseLeave={ onMouseLeave }>
              {/* <Button onClick={btnClick} className="iconfont" size="small" style={{position: 'relative', left: '340px', bottom: '15px', zIndex: '1', border: "none", visibility: show }}>
                &#xe63c;</Button> */}
                <Button onClick={btnClick} className="iconfont" size="small" style={{position:'abosolute', zIndex: '1', border: "none", visibility: show, bottom:'10px' }}>
                &#xe63c;</Button>
                  </span>
                <Select
                    ref={inputEl}
                    mode="multiple"
                    showArrow
                    // disabled
                    placeholder='请选择相关内容'
                    onFocus={onFocus}
                    // onMouseEnter={onMouseEnter}
                    // onMouseLeave={onMouseLeave}
                    // onMouseOver={onMouseOver}
                    open={open}
                    maxTagCount='responsive'
                    value={value}
                    option={options}
                    suffixIcon={<CaretUpOutlined />}
                    style={{ width: '50%', marginTop: '0px' }}
                    dropdownRender={() => (
                        <div style={{ padding: '10px' }}>
                            <Input
                                value={inputValue}
                                placeholder="搜索关键字词"
                                bordered={false}
                                prefix={<SearchOutlined />}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Divider style={{ margin: 0 }} />
                            <Checkbox.Group value={value} onChange={onChange}>
                                {displayOptions.map(option => {
                                    return (
                                        <div style={{ paddingTop: '8px' }} key={option.value} id={option.value}>
                                            <Checkbox value={option.value}>{option.label}</Checkbox>
                                        </div>
                                    )
                                })}
                            </Checkbox.Group>
                            <Divider style={{ margin: 0 }} />
                            <Buttom />

                        </div>
                    )}
                />
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination1}
                showSorterTooltip={false}
                style={{ paddingTop:"50px" }}
            />
        </div>
    );
}


function Target(props) {
    function top() {
        return (
            <div id="top">
                <h4>分类目分析</h4>
            </div>
        )
    }
    return (
        <div id="content">
            {top()}
            <hr />
            <Card>
                <IndexPage date={props.date} />
            </Card>
        </div>
    )

}

export default Target;
