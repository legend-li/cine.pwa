import React, {Component} from 'react';
import * as Service from '@/service/content';
import {getParam} from '@/util/urlUtil';
import errorMsg from '@/util/errorMsg';
import uaUtil from '@/util/uaUtil';
import storeUtil from '@/util/storeUtil';

export default class PreConfirm extends Component {
    constructor(props) {
        super(props);
        this.inputChange = this.inputChange.bind(this);
        this.confirmOrder = this.confirmOrder.bind(this);
        this.preCalculatePrice = this.preCalculatePrice.bind(this);
        this.goAddress = this.goAddress.bind(this);
        this.state = {
            is_show_point: false,
            is_show_coupon: false,
            course: null,
            addressInfo: null,
            user: null,
            calPrice: null,
            coupon_no: '',
            coupon_msg: '',
            point: '',
            point_msg: '',
            remark: '',
            orderedLessonsOrders: []
        };
    }

    componentDidMount() {
        let cid = getParam().cid;
        Service.prepareOrder({cid}).then(res => {
            if (!res) return;
            let {
                is_show_point,
                is_show_coupon,
                lesson: course,
                user,
                calPrice,
                orderedLessonsOrders,
                addressInfo
            } = res;
            let updateStater = {
                is_show_point,
                is_show_coupon,
                course,
                user,
                calPrice,
                orderedLessonsOrders
            };
            if (calPrice.point_discount) {
                updateStater.point = calPrice.point_discount;
            }
            if (calPrice.coupon_no) {
                updateStater.coupon_no = calPrice.coupon_no;
            }
            if (addressInfo) {
                updateStater.addressInfo = {
                    name: addressInfo.name,
                    phone: addressInfo.phone,
                    address: addressInfo.area.replace(/-/g, '').replace(/-市辖区-/, '') + addressInfo.address
                };
            }
            this.setState(updateStater, () => {
                if (calPrice.point_discount || calPrice.coupon_no) {
                    this.preCalculatePrice();
                }
            });
        });
    }

    inputChange(e) {
        let {name, value} = e.target;
        if (name === 'point' && value && !/^(\d|\.)+$/.test(value)) return;
        this.setState(
            {
                [name]: value
            },
            () => {
                if (this.timer) {
                    console.log(`clearTimeout(${this.timer})`);
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.preCalculatePrice();
                }, 300);
            }
        );
    }

    preCalculatePrice() {
        let {point, coupon_no} = this.state;
        Service.preCalculatePrice({cid: getParam().cid, point, coupon_no}).then(res => {
            if (this.hasError(res.except_case_desc)) return;
            this.setState(prevState => ({
                calPrice: Object.assign(prevState.calPrice, res.result)
            }));
        });
    }

    goAddress() {
        const localUrl = encodeURIComponent(location.href);
        location.href = `/address?case=1&token=${storeUtil.getToken()}&redirect=${localUrl}`;
    }

    confirmOrder() {
        let cid = getParam().cid;
        let {coupon_no, point, remark, course, addressInfo} = this.state;
        let orderBody = {cid, coupon_no, point, remark};
        if (course.is_need_remark === '1') {
            if (!addressInfo) {
                alert('请填写详细地址');
                return;
            } else {
                orderBody.addressInfo = addressInfo;
            }
        }

        Service.createOrder(orderBody).then(res => {
            if (this.hasError(res.except_case_desc)) return;
            let {order_id} = res.result;
            let url = `/payCenter/${order_id}`;
            if (uaUtil.wechat()) {
                url = 'http://' + location.host + url;
                location.href = 'http://www.bstcine.com/wechat/authorize?redirect=' + encodeURIComponent(url);
            } else {
                location.href = url;
            }
        });
    }

    hasError(msg) {
        if (msg) {
            if (msg.indexOf('point') !== -1) {
                this.setState({
                    point_msg: errorMsg(msg)
                });
            } else {
                this.setState({
                    point_msg: ''
                });
            }
            if (msg.indexOf('coupon') !== -1) {
                this.setState({
                    coupon_msg: errorMsg(msg)
                });
            } else {
                this.setState({
                    coupon_msg: ''
                });
            }
            if (msg.indexOf('coupon') === -1 && msg.indexOf('point') === -1) {
                return alert(errorMsg(msg));
            }
            return true;
        } else {
            this.setState({
                point_msg: '',
                coupon_msg: ''
            });
            return false;
        }
    }

    renderPackageLesson() {
        let {course} = this.state;
        if (!course || !course.packages || !course.packages.length) return null;
        return (
            <div className="package">
                {course.packages.map((item, i) => {
                    return (
                        <div className="item" key={i}>
                            <span className="title">{item.name}</span>
                            <span className="price">￥{item.price}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderOrderedLessons() {
        let {orderedLessonsOrders} = this.state;
        if (!orderedLessonsOrders || !orderedLessonsOrders.length) return null;
        return (
            <div className="ordered-package">
                {orderedLessonsOrders.map((item, i) => {
                    return (
                        <div className="item" key={i}>
                            <span className="title">{item.subject}（已购）</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        let {
            is_show_point,
            is_show_coupon,
            course,
            addressInfo,
            user,
            calPrice,
            coupon_no,
            coupon_msg,
            point,
            point_msg
        } = this.state;
        return (
            <div className="pre-confirm">
                <div className="brief">
                    <div className="image">
                        <div
                            className="content"
                            style={
                                course && course.img
                                    ? {
                                          background: `url(${
                                              course.img ? 'http://www.bstcine.com/f/' + course.img : ''
                                          }) center center / cover no-repeat`
                                      }
                                    : null
                            }
                        />
                    </div>
                    <div className="right">
                        <div className="title">{course && course.name ? course.name : ''}</div>
                        <div className="prices">
                            {course && course.price ? <span className="price">￥{course.price}</span> : null}
                            {course && course.original_price ? (
                                <span className="old-price">
                                    原价：<span className="del">￥{course.original_price}</span>
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
                {this.renderPackageLesson()}

                <div className="order-control total-price">
                    <span className="label">应付金额</span>
                    {calPrice && calPrice.price ? <span className="price">￥{calPrice.price}</span> : null}
                </div>
                {this.renderOrderedLessons()}

                {is_show_coupon ? (
                    <div className="order-control coupon">
                        <span className="label">优惠券</span>
                        <div className="input">
                            <span className="normal">输入优惠券</span>
                            <input
                                name="coupon_no"
                                value={coupon_no}
                                className={coupon_msg ? 'err' : ''}
                                onChange={this.inputChange}
                            />
                            <span className="error-tips">{coupon_msg}</span>
                            <span className="red">抵扣：-￥{calPrice.coupon_discount}</span>
                        </div>
                    </div>
                ) : null}

                {is_show_point && user && calPrice ? (
                    <div className="order-control point">
                        <span className="label">积分</span>
                        <span className="red">{user.point}</span>
                        <div className="input">
                            <span className="normal">本次使用</span>
                            <input
                                name="point"
                                value={point}
                                className={point_msg ? 'err' : ''}
                                onChange={this.inputChange}
                            />
                            <span className="normal">积分</span>
                            <span className="error-tips">{point_msg}</span>
                            <span className="red">抵扣：-￥{calPrice.point_discount}</span>
                        </div>
                    </div>
                ) : null}

                <div className="order-control pay-price">
                    <span className="label">实付金额</span>
                    {calPrice && calPrice.pay_price ? <span className="price">￥{calPrice.pay_price}</span> : null}
                </div>
                {course && course.is_need_remark === '1' ? (
                    <div className="order-control address">
                        <span className="label">收货地址</span>
                        <button className="btn-outline" onClick={this.goAddress}>
                            {addressInfo ? '修改地址' : '添加地址'}
                        </button>
                        {addressInfo ? (
                            <div className="my-address">
                                <div className="my-address-contact">
                                    <span>收货人：</span>
                                    <span className="my-name">{addressInfo.name}</span>
                                    <span>{addressInfo.phone}</span>
                                </div>
                                <div className="my-area">
                                    <span>地址：</span>
                                    <span>{addressInfo.address}</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {course && course.is_need_remark === '1' ? (
                    <div className="order-control remark">
                        <span className="label">备注</span>
                        <div className="my-remark">
                            <textarea name="remark" value={this.state.remark} onChange={this.inputChange} rows="4" />
                        </div>
                    </div>
                ) : null}

                <button className="btn-action btn-confirm" onClick={this.confirmOrder}>
                    提交订单
                </button>
            </div>
        );
    }
}
