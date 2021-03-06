const errorCode = {
    system_error: '系统繁忙，请尝试刷新或稍后重试',
    username_not_null: '用户名/手机/邮箱不能为空',
    password_not_null: '密码不能为空',
    user_not_exist: '用户名/手机/邮箱或密码有误',
    net_error: '网络异常，请稍后重试',
    success: '登录成功',
    login_is_null: '账号为空',
    password_is_null: '密码为空',
    need_reset: '账号需要重置',
    token_is_null: 'token为空',
    param_not_null: 'lesson为空',
    lesson_not_exist: 'lesson错误',
    invalid_point: '非法积分值',
    not_allow_point: '不允许使用积分',
    point_not_enough: '积分不足',
    not_allow_coupon: '不允许使用优惠券',
    coupon_not_exist: '优惠券不存在',
    coupon_not_belong: '优惠券不属于该用户',
    coupon_expired: '优惠券已过期',
    coupon_not_effective: '优惠券失效',
    coupon_limit_new_order: '优惠券限首单用户使用',
    coupon_limit_new_dev_user: '优惠券限新学员使用',
    coupon_limit_lesson: '优惠券限指定课程使用',
    coupon_used: '优惠券已使用',
    coupon_in_use: '优惠券使用中',
    order_already_paid: '订单已支付',
    related_lesson_required: '写作课程请先购买对应的视频课程',
    point_too_large: '当前积分已超出应付金额'
};

export default errorCode;
