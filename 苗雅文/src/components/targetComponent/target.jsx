import React from 'react';
import { Select, Checkbox, Input, Divider, Card, Button, Table } from 'antd';
import { SearchOutlined, CaretUpOutlined, RightCircleFilled,DownSquareOutline } from '@ant-design/icons';
import { useState, useMemo, useRef, useEffect } from 'react';
import "./target.css"
import request from '../../fetch';
import index from "../../assets/img/index.png";
import index2 from "../../assets/img/index2.png"
import index3 from "../../assets/img/index3.png"


function IndexPage(props) {
    const [show, setShow] = useState("hidden")  //button按钮是否显示
    const [tmpvalue, setTmpvalue] = useState([]) //存储这选中的指标
    const [sortIndex, setsortIndex] = useState([])  //用来控制排名前三的特殊样式
    const [dataOption, setdataOption] = useState([]) //以数组形式存储brr中的全部属性，这个用来做表格中的数据呈现
    const [allOption, setallOption] = useState() //map将paymentAmount，paymentAmountPercentage存储成键值对
    const [options, setOptions] = useState([]) //存储全部选项
    const [fetchData, setFetch] = useState([]) //请求过来的数据
    const [date, setDate] = useState(props.date)
    const [open, setOpen] = useState()
    const [value, setValue] = useState([]);//存储暂时选中的指标，按确认后才会赋值给tmpvalue，按取消则不赋值
    const [inputValue, setInputValue] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);
    useEffect(() => {
        request({ //请求url获取id，并将所有id存储在com数组中
            url: `/category?a=${date[0]}&b=${date[1]}`,
            method: 'get',
        })
            .then(data => {
                if(data.success === "false"){
                    setFetch("概率性报错")
                    setdataOption("报错了")
                }
                let tmp = Object.keys(data.data[0]);//这里获取data中对象数据的属性，因为每个对象属性相同，所以只获取第一个对象全部属性即可
                tmp.shift()//name属性不可选，所以删除
                let arr = []
                for (let i = 0; i < tmp.length; i++) {
                    arr.push({ label: tmp[i], value: tmp[i] }) //arr存储下拉框中的所有可选项
                    i++
                }
                // console.log([arr[0].value]);
                setOptions(arr)
                // console.log(arr);
                setFetch(data.data)
                let brr = new Map();
                for (let i = 0; i < tmp.length; i++) {
                    brr.set(tmp[i], tmp[i + 1])
                    i++
                }
                setallOption(brr)
                setTmpvalue([arr[0].value])
                setValue([arr[0].value])
                
                let crr = [];
                for (let i = 0; i < tmp.length; i++) {
                    crr.push(tmp[i])
                }
                setdataOption(crr)//以数组形式存储brr中的全部属性，这个用来做表格中的数据呈现
            }).catch((e) => {
                return "概率性报错"
            })
    }, [date])

    useEffect(() => {
        setDate(props.date)
    },[props.date])
    const columns = [//这里先把表格中不可选的前两列填进去
        {
            title: '',
            dataIndex: "排行",
            width: "2%",
            // colSpan: 2,
            render: (text, record, index) => {
                if (index === 0 || index === 1 || index === 2) {
                    return sortIndex[index];
                }
                else {
                    return `${index + 1}`
                }

            },
        },
        {
            title: "排行",
            dataIndex: "name",
            width: "10%",
            // colSpan: 1
        }];
        
        // console.log(allOption);
        // console.log(tmpvalue[0]);
    for (let i = 0; i < tmpvalue.length; i++) {
        columns.push({
            title: tmpvalue[i],
            dataIndex: tmpvalue[i],
            width: "5%",
            fixed: "left"
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
    useEffect(() => {//每次请求的数据改变，都更新tmp，也就是sort，把前三名的特殊样式填进去
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
    // console.log(sortIndex);

    const data = [];//填入表格的数据
    if (fetchData) {
        for (let i = 0; i < fetchData.length; i++) {
            let obj = {}
            obj["key"] = i + 1;
            obj["name"] = fetchData[i].name;
            let j = 0
            while (j < dataOption.length) {
                if (fetchData[i][dataOption[j]] < 1) { obj[dataOption[j]] = (fetchData[i][dataOption[j]] * 100).toFixed(2) + "%" } else {
                    obj[dataOption[j]] = fetchData[i][dataOption[j]]//添加新属性和新的数据
                }
                j++;
            }
            data.push(obj)
        }
    }
    // console.log(data);

    const displayOptions = useMemo(() => {
        return options.filter(option => option.label.includes(inputValue));
    }, [inputValue, options])//这里做搜索过滤

 
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

    const onCheckAllChange = e => { //全选和取消
        let tmp = options.map((item) => {
            return item.value
        })
        setValue(e.target.checked ? tmp : [])
        setIndeterminate(false); //全选样式，增加不明确是否选取状态
        setCheckAll(e.target.checked);
    };

    const onChange = list => { 
        setValue(list);
        // setTmpvalue(list)
        // console.log(tmpvalue);
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
        // console.log(inputEl.current);
    }
    const onFocus = () => {
        setOpen(true)
        // console.log(inputEl.current);
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

    const btnClick = () => {
        setValue([]);
        setTmpvalue([])
        setCheckAll(false)
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
                <span style={{ zIndex: '10', position: 'relative', left: '46%', bottom: '10px' }}
                    onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                    {/* <Button onClick={btnClick} className="iconfont" size="small" style={{position: 'relative', left: '340px', bottom: '15px', zIndex: '1', border: "none", visibility: show }}>
                &#xe63c;</Button> */}
                    <Button onClick={btnClick} className="iconfont" size="small" style={{ position: 'abosolute', zIndex: '1', border: "none", visibility: show, bottom: '10px' }}>
                        &#xe63c;</Button>
                </span>
                <Select
                    ref={inputEl}
                    mode="multiple"
                    showArrow
                    placeholder='请选择相关内容'
                    onFocus={onFocus}
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
                style={{ paddingTop: "50px" }}
            />
        </div>
    );
}


function Target(props) {
    function top() {
        return (
            <div id="topnav">
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
