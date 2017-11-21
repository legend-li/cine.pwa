import React from 'react';
import Link from 'react-router-dom'
import Button from 'material-ui/Button'
import {CircularProgress, LinearProgress} from 'material-ui/Progress'
import * as Service from '../../service/word'

export default class UserInfo extends React.Component {

    constructor(props) {
        super(props)
        this.props.born_ats = [2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,1997,1996,1995,1994,1993,1992,1991,1990,1989,1988,1987,1986,1985,1984,1983,1982,1981,1980,1979,1978,1977,1976,1975,1974,1973,1972,1971,1970,1969,1968,1967,1966,1965,1964,1963,1962,1961,1960,1959,1958,1957,1956,1955,1954,1953,1952,1951,1950,1949,1948,1947]
        this.props.grades = [{"label":"学龄前","value":"0"},{"label":"一年级","value":"1"},{"label":"二年级","value":"2"},{"label":"三年级","value":"3"},{"label":"四年级","value":"4"},{"label":"五年级","value":"5"},{"label":"六年级","value":"6"},{"label":"七年级","value":"7"},{"label":"八年级","value":"8"},{"label":"九年级","value":"9"},{"label":"十年级","value":"10"},{"label":"十一年级","value":"11"},{"label":"十二年级","value":"12"},{"label":"成人","value":"13"}]
        this.props.areas = [{"label":"北京市","value":"110000"},{"label":"天津市","value":"120000"},{"label":"河北省","value":"130000"},{"label":"山西省","value":"140000"},{"label":"内蒙古自治区","value":"150000"},{"label":"辽宁省","value":"210000"},{"label":"吉林省","value":"220000"},{"label":"黑龙江省","value":"230000"},{"label":"上海市","value":"310000"},{"label":"江苏省","value":"320000"},{"label":"浙江省","value":"330000"},{"label":"安徽省","value":"340000"},{"label":"福建省","value":"350000"},{"label":"江西省","value":"360000"},{"label":"山东省","value":"370000"},{"label":"河南省","value":"410000"},{"label":"湖北省","value":"420000"},{"label":"湖南省","value":"430000"},{"label":"广东省","value":"440000"},{"label":"广西壮族自治区","value":"450000"},{"label":"海南省","value":"460000"},{"label":"重庆市","value":"500000"},{"label":"四川省","value":"510000"},{"label":"贵州省","value":"520000"},{"label":"云南省","value":"530000"},{"label":"西藏自治区","value":"540000"},{"label":"陕西省","value":"610000"},{"label":"甘肃省","value":"620000"},{"label":"青海省","value":"630000"},{"label":"宁夏回族自治区","value":"640000"},{"label":"新疆维吾尔自治区","value":"650000"}]
        this.state = {
            born_at: 2010,
            grade: "1",
            area: "310000"
        }
        this.startClick = this.startClick.bind(this)
        this.bornAtChange = this.bornAtChange.bind(this)
        this.gradeChange = this.gradeChange.bind(this)
        this.areaChange = this.areaChange.bind(this)
    }

    startClick() {
        this.props.history.push(`/card?born_at=${this.state.born_at}&grade=${this.state.grade}&area=${this.state.area}`)
    }

    componentWillMount() {
        console.log('componentWillMount')
    }

    componentDidMount() {
        console.log('componentDidMount')

    }

    bornAtChange(event){
        this.setState({born_at: event.target.value});
    }

    gradeChange(event){
        this.setState({grade: event.target.value});
    }

    areaChange(event){
        this.setState({area: event.target.value});
    }

    render() {
        return (
            <div className="user_info">
                <div className="title">测一下，看看你的词汇量有多少？</div>
                <div className="tips">为保证本测试的学术参考价值，请补充如下个人信息</div>
                <div className="form">
                    <div className="form-item">
                        <div className="form-label">
                            你的出生年份
                        </div>
                        <div className="form-control">
                            <select value={this.state.born_at} onChange={this.bornAtChange}>
                                {this.props.born_ats.map(function (item) {
                                    return <option value={item}>{item+'年'}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-item">
                        <div className="form-label">
                            你的年级
                        </div>
                        <div className="form-control">
                            <select value={this.state.grade} onChange={this.gradeChange}>
                                {this.props.grades.map(function (item) {
                                    return <option value={item.value}>{item.label}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="form-item">
                        <div className="form-label">
                            你所在的地区
                        </div>
                        <div className="form-control">
                            <select value={this.state.area} onChange={this.areaChange}>
                                {this.props.areas.map(function (item) {
                                    return <option value={item.value}>{item.label}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>



                <button className="button button_blue" onClick={this.startClick}>开始词汇量测试</button>
            </div>
        )
    }
}