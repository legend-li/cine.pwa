import React, {Component} from 'react';
import {getParam, addParam, removeParam} from '@/util/urlUtil';
import * as Service from '@/service/vocabtest';
import {initWechat, setShareParam} from '@/util/wechatUtil';
import {createShare, share} from '@/util/shareUtil';
import Bridge from '@/util/bridge';
import BRIDGE_EVENT from '@/constant/bridgeEvent';
import siteCodeUtil from '@/util/sitecodeUtil';
import PieChart from './PieChart';

export default class Report extends Component {
    constructor(props) {
        super(props);
        console.log('Report constructor');
        this.state = {
            report: {},
            lessons: [],
            from_share: false
        };
        this.shareClick = this.shareClick.bind(this);
        this.retryClick = this.retryClick.bind(this);
        this.courseClick = this.courseClick.bind(this);
    }

    async componentDidMount() {
        let id = getParam().id;
        Service.queryContentWordResult({id, token: null}).then(res => {
            if (res.except_case_desc) {
                return alert(res.except_case_desc);
            }
            let {statsContentWord, recommendLessons, stat} = res.result;
            this.setState({
                report: statsContentWord,
                lessons: recommendLessons,
                from_share: getParam().from_share === '1',
                stat: stat
            });
        });
        await initWechat();
        let res = await createShare({
            type: 7,
            share_link: addParam(removeParam(undefined, 'token'), {from_share: 1})
        });
        let data = res.result;
        let share_params = {
            sharelog_id: data.sharelog_id,
            title: data.share_title,
            link: data.share_link,
            imgUrl: data.share_imgUrl,
            desc: data.share_desc
        };
        await setShareParam(share_params);
    }

    async shareClick() {
        let res = await createShare({
            type: 7,
            share_link: addParam(removeParam(undefined, 'token'), {from_share: 1})
        });
        let data = res.result;
        let share_params = {
            sharelog_id: data.sharelog_id,
            title: data.share_title,
            link: data.share_link,
            imgUrl: data.share_imgUrl,
            desc: data.share_desc
        };
        share({share_params});
    }

    retryClick() {
        this.props.history.push(`/`);
    }

    courseClick(course_id) {
        if (siteCodeUtil.inIOSAPP()) {
            Bridge.ios(BRIDGE_EVENT.COURSE, {course_id});
        } else if (siteCodeUtil.inAndroidAPP()) {
            Bridge.android(BRIDGE_EVENT.COURSE, {course_id});
        } else {
            location.href = '/lesson/' + course_id;
        }
    }

    renderRecommendList() {
        return this.state.lessons.map(lesson => {
            return (
                <div className="recommend-item" onClick={e => this.courseClick(lesson.id, e)} key={lesson.id}>
                    <div
                        className="item-img"
                        style={{
                            background: 'url(http://www.bstcine.com/f/' + lesson.img + ') no-repeat top center',
                            backgroundSize: 'cover'
                        }}
                    />
                    <div className="item-brief">
                        <div className="item-title">{lesson.name}</div>
                        <div className="item-desc">学习课时：{lesson.time_arrange}</div>
                    </div>
                </div>
            );
        });
    }

    render() {
        let {from_share, report, stat} = this.state;
        return (
            <div className="wrapper">
                <div className="report">
                    <div className="title">{from_share ? '词汇量为' : '你的词汇量为'}</div>
                    <div className="vocab">{report.vocab}</div>
                    <div className="line" />
                    <div className="recommend-title">各类考试所需词汇量参考数据：</div>
                    <ul className="recommend-detail">
                        <li>中考：1500</li>
                        <li>高考：3500</li>
                        <li>大学4级：4500</li>
                        <li>大学6级：6000</li>
                        <li>托福：8000</li>
                        <li>SAT：10000以上</li>
                    </ul>
                    {stat ? (
                        <div className="rank">
                            全国{report.grade}年级词汇量均值：<span>{stat.avg_vocab}</span>
                            <br />
                            在全国{report.grade}年级中的词汇量排位：<span>超过了{stat.my_rank}%的小伙伴</span>
                        </div>
                    ) : null}

                    {stat ? <PieChart data={stat.divides} /> : null}

                    <div className="line" />
                    <div className="recommend-title">
                        {from_share ? '基于词汇量和年龄段，推荐以下课程：' : '基于你的词汇量和年龄段，推荐以下课程：'}
                    </div>
                    <div className="recommend-list">{this.renderRecommendList()}</div>
                </div>
                {from_share ? (
                    <div className="footer mini fixed">
                        <button onClick={this.retryClick} className="btn btn_sm btn_blue btn_try">
                            我也测一下
                        </button>
                    </div>
                ) : (
                    <div className="footer mini fixed">
                        <button onClick={this.retryClick} className="btn btn_sm btn_blue btn_try">
                            再测一次
                        </button>
                        <button onClick={this.shareClick} className="btn btn_sm btn_orange btn_share">
                            分享
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
