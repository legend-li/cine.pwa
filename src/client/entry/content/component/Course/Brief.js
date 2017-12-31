import React, {Component} from 'react'

export default class Brief extends Component {

    static defaultProps = {
        course: null,
        user: null,
    };

    constructor(props) {
        super(props);
    }

    //优惠列表
    renderActivityPromoteList(course) {
        if (course && course.activitys && course.activitys.length) {
            let list = course.activitys.map((activity, i) => {
                if (activity.filter === '1') {
                    return (
                        course.is_shared ?
                            <div key={i} className="promote-title after-share">{activity.share_after_desc}</div>
                            :
                            <div key={i} className="promote-title share"
                                 onClick={this.props.clickShare}>{activity.share_before_desc}</div>
                    )
                } else {
                    return (
                        <div key={i} className="promote-title">{activity.share_before_desc}</div>
                    )
                }
            });
            return (
                <div className="promote">
                    <div className="promote-label"><span className="bord-label">优惠</span></div>
                    <div className="promote-list">
                        {list}
                    </div>
                </div>
            )
        }
    }

    renderPointPromoteList(course, user) {
        if (course && course.is_allow_point === '1') {
            return (
                <div className="promote">
                    <div className="promote-label"><span className="bord-label">积分</span></div>
                    <div className="promote-list">
                        {
                            user ?
                                <div className="promote-title">当前积分{user.point}，可抵扣{user.point}元</div>
                                :
                                <div className="promote-title" onClick={this.props.login}>1积分抵扣1元钱，<span
                                    className="blue">登录</span><span
                                    className="grey">查看可抵扣金额</span></div>
                        }
                    </div>
                </div>
            )
        }
    }

    renderBottomButton(course) {
        const {goLearn, goBuy, clickShare} = this.props;
        if (course.is_paid) {
            return <div className="btn-action btn-learn" onClick={goLearn}>立即学习</div>
        } else {
            if (course.object_type === '1' || course.object_type === '2' || course.object_type === '3') {
                return <div className="btn-action btn-buy" onClick={goBuy}>立即购买</div>
            } else if (course.object_type === '4') {
                return <div className="btn-action btn-share" onClick={clickShare}>分享开通</div>
            }
        }
    }

    renderMeta(course) {
        if (course && (course.author || course.time_arrange)) {
            let metas = [];
            if (course.author) metas.push(<span key={course.author} className="meta">授课老师：{course.author}</span>);
            if (course.time_arrange) metas.push(<span key={course.time_arrange}
                                                      className="meta">授课时长：{course.time_arrange}</span>);
            return (
                <div className="metas">
                    {metas}
                </div>
            )
        }
    }

    renderPrices(course) {
        if (!course) return;
        if (course.status === '1') {
            if (isNaN(course.price)) {
                return <div className="prices"><span className="price">{course.price}</span></div>
            } else {
                if (course.original_price) {
                    return (
                        <div className="prices">
                            <span className="price">￥{course.activity_price}</span>
                            <span className="old-price">原价：<span className="del">￥{course.original_price}</span></span>
                        </div>
                    )
                } else {
                    return (
                        <div className="prices">
                            <span className="price">￥{course.activity_price}</span>
                        </div>
                    )
                }
            }
        } else if (course.status === '2') {
            return <div className="coming-soon">待推出</div>
        }
    }

    render() {
        let {course, user, relatedCourse} = this.props;
        return course ? (
            <div className="brief-container">
                <div className="video-container">
                    <video className="content" src="http://www.bstcine.com/f/2017/07/06/141540516S48yNNt.mp4"
                           poster={course.img ? ('http://www.bstcine.com/f/' + course.img) : null} controls></video>
                </div>
                <div className="desc-container">
                    <div className="title">{course.name}</div>
                    <div className="slogan">{course.subtitle}</div>
                    {
                        course.related_lesson_id ?
                            <div className="related-course"><span
                                onClick={e => relatedCourse(course.related_lesson_id, e)}>学习精读课程 >></span></div>
                            : null
                    }

                    {this.renderMeta(course)}
                    {this.renderPrices(course)}

                    <div className="promotes">
                        {this.renderActivityPromoteList(course)}
                        {this.renderPointPromoteList(course, user)}
                    </div>
                    {
                        course.notice ?
                            <div className="notice">
                                <div className="label">公告</div>
                                <div className="notice-details">
                                    <div className="detail">{course.notice}</div>
                                </div>
                            </div> : null
                    }

                    {this.renderBottomButton(course)}
                </div>
            </div>

        ) : null
    }
}