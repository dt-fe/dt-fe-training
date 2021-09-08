import React from 'react';
import "./data.css";
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

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
     this.props.getDate(dateString);
    }


    yestoday = moment().local("zh-cn").subtract(1, 'days').format("YYYY-MM-DD")
    // current = moment().startOf('day').diff(moment().local("zh-cn").format("YYYY-MM-DD"), 'days') ===1
    weekAgo = moment().subtract(7, "days").format("YYYY-MM-DD")
    
    componentWillMount(){
        this.props.getDate([ this.weekAgo, this.yestoday])
    }


    disabledDate(current) {
        // return moment().startOf('day').diff(current, 'days') > 99;
        return moment().startOf('day') < current || moment().startOf('day').diff(current, 'days') > 99;
        return moment().startOf('day') < current || moment().startOf('day').diff(current, 'days') > 99;
        
      }
      
    render() {
        // console.log(this.state.data);  
        return (
            <div id="dataContainer">
                <Space id="space" direction="vertical" size={12}>
                    <RangePicker
                        format={dateFormat}
                        locale={locale}
                        allowClear={false}
                        bordered={false}
                        suffixIcon={false}
                        onChange={this.handleSelectTime}//获取选中的时间，antd自带
                        disabledDate={this.disabledDate}
                        defaultValue={[moment(this.yestoday, dateFormat), moment(this.weekAgo, dateFormat)]}
                   />
                </Space>
            </div>
        );
    }

}

export default Data;