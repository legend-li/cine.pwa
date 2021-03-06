import { getWechatJsSignature } from '@/service/base';
import { checkShareMask, updateShare, hideShareMask } from './shareUtil';
import { queryShare } from './shareUtil';
import { getParam, removeParam } from './urlUtil';
import uaUtil from '@/util/uaUtil';

export let setShareParam = params => {
    if (typeof window.wx === 'undefined' || !window.wx)
        return console.log('window.wx not found, ensure include jweixin in your html');
    return setShareTimeline(params);
};

export let setShareTimeline = ({ title, link, imgUrl, desc }) => {
    return new Promise(resolve => {
        window.wx.onMenuShareTimeline({
            title: title,
            link: link,
            imgUrl: imgUrl,
            success: function() {
                console.log('onMenuShareTimeline shared');
                resolve();
            },
            cancel: function() {}
        });
        window.wx.onMenuShareAppMessage({
            title: title,
            link: link,
            imgUrl: imgUrl,
            desc: desc,
            success: function() {
                console.log('onMenuShareAppMessage shared');
                // resolve()
            },
            cancel: function() {}
        });
    });
};

export let initWechat = async () => {
    console.log('initWechat');
    if (!uaUtil.wechat()) {
        console.log('not in wechat skip init');
        return;
    }
    try {
        let wechatConfig = await getWechatJsSignature();
        await configWechat(wechatConfig);
        checkShareMask();
        let param = getParam();
        let sharelog_id = param.sharelog_id;
        if (sharelog_id) {
            let res = await queryShare(sharelog_id);
            if (res.status) {
                let data = res.data;
                await setShareParam({
                    title: data.share_title,
                    link: removeParam(data.share_link, ['token', 'share_mask']),
                    imgUrl: data.share_imgUrl,
                    desc: data.share_desc
                });
                await updateShare(sharelog_id);
                hideShareMask();
            } else {
                console.log(res);
            }
        }
        return true;
    } catch (err) {
        console.error(err);
    }
};

export let configWechat = config => {
    return new Promise((resolve, reject) => {
        if (typeof window.wx === 'undefined' || !window.wx)
            return reject(new Error('window.wx not found, ensure include jweixin in your html'));
        window.wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: ['chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        window.wx.ready(() => {
            console.log('wechat config ready');
            resolve(null, 'ready');
        });
        window.wx.error(err => {
            // alert(`err ${err}`)
            console.log('wechat config err', err);
            resolve(err);
        });
    });
};
