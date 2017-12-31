import '../asset/style/share.less'
import uaUtil from './uaUtil'
import * as storeUtil from './storeUtil'
import SITECODE from '../constant/sitecode'
import {setShareParam} from './wechatUtil'
import {getParam, updateUrl} from './urlUtil'
import Bridge from './bridge'
import {get, post} from '../service/request'
import Api from '../../APIConfig'
import BRIDGE_EVENT from "@/constant/bridgeEvent";

const imgUrl = require('../asset/image/pic_share_arr@2x.png');
let inter = null;

export let createShare = async ({type, share_link, cid}) => {
    let res = null;
    if (type === 7) {
        res = await post(Api.APIURL_Share_Common, {type, share_link})
    } else if (type === 4) {
        res = await post(Api.APIURL_Share_CoursePackage, {type, cid})
    } else {
        return alert('invalid_type')
    }
    if (res.except_case_desc) {
        return alert(res.except_case_desc)
    }
    return res
};

export let updateShare = (sharelog_id) => {
    return get(Api.APIURL_Share_Update, {sharelog_id}).then(res => {
        if (!res.status) {
            return alert(res.msg)
        }
        return res
    })
};

export let queryShare = (sharelog_id) => {
    return get(Api.APIURL_Web_Share_Log, {sharelog_id})
};

export let showShareMask = () => {
    let maskNode = document.querySelector('.share-mask');
    if (!maskNode) {
        maskNode = document.createElement('div');
        maskNode.className = 'share-mask'
    }
    maskNode.innerHTML = `
        <div class="share-tip">请点击右上角 ...，选择分享到朋友圈</div>
        <div class="share-icon"><img src=${imgUrl} alt=""></div>
    `;
    document.body.appendChild(maskNode)
};

export let hideShareMask = () => {
    document.querySelector('.share-mask').remove()
};

export let checkShareMask = () => {
    if (getParam().share_mask == 1) {
        showShareMask()
    }
};

export let showShareQRCode = ({url, sharelog_id}) => {
    console.log(`sharelog_id ${sharelog_id}`);
    let updatedUrl = updateUrl({share_mask: 1, sharelog_id}, url);
    let qrcode = `http://www.bstcine.com/qrcode?text=${encodeURIComponent(updatedUrl)}`;
    let maskNode = document.createElement('div');
    maskNode.className = 'share-mask';
    maskNode.innerHTML = `
        <div class="share-container">
            <div class="share-close">x</div>
            <div class="share-qrcode"><img src=${qrcode} alt=""></div>
        </div>
    `;
    document.body.appendChild(maskNode);
    let closeNode = document.querySelector('.share-close');
    closeNode.addEventListener('click', function () {
        hideShareQRCode()
    })
};

export let hideShareQRCode = () => {
    let closeNode = document.querySelector('.share-close');
    let maskNode = document.querySelector('.share-mask');
    closeNode.removeEventListener('click', hideShareQRCode);
    inter && clearInterval(inter);
    maskNode.remove()
};

let checkShareStatus = (sharelog_id) => {
    return new Promise(resolve => {
        inter = setInterval(() => {
            queryShare(sharelog_id).then(res => {
                if (res.status && res.data.status === '1') {
                    inter && clearInterval(inter);
                    resolve()
                }
            })
        }, 3000)
    })
};

export let share = async ({share_params}) => {
    let sitecode = storeUtil.get('sitecode');
    if (sitecode === SITECODE.ANDROID_PHONE) {
        await Bridge.android(BRIDGE_EVENT.SHARE, share_params);
        return updateShare(share_params.sharelog_id)
    } else if (sitecode === SITECODE.IOS_IPHONE || sitecode === SITECODE.IOS_IPAD || sitecode === SITECODE.IOS) {
        // todo ios 侧提供已安装软件列表
        // let list = await Bridge.ios(BRIDGE_EVENT.INSTALLED_APP_LIST)
        // if(list && list.wechat===1){
        //     await Bridge.ios(BRIDGE_EVENT.SHARE, share_params);
        //     // alert('await Bridge.ios(\'share\', share_params)')
        //     return updateShare(share_params.sharelog_id)
        // }else{
        //
        // }

        await Bridge.ios(BRIDGE_EVENT.SHARE, share_params);
        alert('await Bridge.ios(\'share\', share_params)')
        return updateShare(share_params.sharelog_id)
    } else {
        if (uaUtil.mobile()) {
            if (uaUtil.wechat()) {
                showShareMask();
                await setShareParam(share_params);
                await updateShare(share_params.sharelog_id);
                return hideShareMask()
            } else {
                showShareQRCode({url: share_params.link, sharelog_id: share_params.sharelog_id});
                await checkShareStatus(share_params.sharelog_id);
                return hideShareQRCode()
            }
        } else {
            showShareQRCode({url: share_params.link, sharelog_id: share_params.sharelog_id});
            await checkShareStatus(share_params.sharelog_id);
            return hideShareQRCode()
        }
    }
};



