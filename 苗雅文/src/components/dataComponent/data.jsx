import React from 'react';
import "./data.css";
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';



const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
// const customFormat = value => `custom format: ${value.format(dateFormat)}`;

class Data extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        //    data:[]
        };
        this.handleSelectTime = this.handleSelectTime.bind(this); //绑定函数this，这里不是箭头函数，需要绑定
    };
    handleSelectTime(value, dateString) {
        console.log('选择的时间：', dateString);
        // this.setState({
        //     data:[dateString[0],dateString[1]] 
        // })
     this.props.getDate(dateString);
    }

    disabledDate(current) {
        // // Can not select days before today and today
        // console.log(moment().startOf('day'));
        // moment().startOf('day') < current &&
        // current.diff(moment().startOf('day'), 'days');
        console.log(moment().startOf('day') < current);
        return moment().startOf('day') < current || moment().startOf('day').diff(current, 'days') > 99;
      }

    render() {
        // console.log(this.state.data);  
        return (
            <div id="dataContainer">
                <Space id="space" direction="vertical" size={12}>
                    <RangePicker
                        // defaultValue={[moment('2021/01/01', dateFormat), moment('2021/01/01', dateFormat)]}
                        format={dateFormat}
                        locale={locale}
                        allowClear={false}
                        bordered={false}
                        suffixIcon={false}
                        onChange={this.handleSelectTime}//获取选中的时间，antd自带
                        disabledDate={this.disabledDate}
                    />
                </Space>
            </div>

        );
    }

}

export default Data;