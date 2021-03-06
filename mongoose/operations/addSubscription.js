const subscription = require('../models/Subscription')
const existSubscription = require('../operations/getSubscriptionByName')

// 创建
function createSubscription(username, webname) {
    let promise = new Promise((resolve, reject) => {
        subscription.create({
            username,
            webs: webname
        }, (err, doc) => {
            if (!err) {
                resolve(doc)
            } else {
                reject(err)
            }
        })
    })
    return promise
}

// 更新,默认为添加，若type==false为添加，否则为删除
function updateSubscription(username, webname, type) {
    let promise = new Promise((resolve, reject) => {
        if (!type) {
            subscription.updateOne({
                username
            }, {
                $push: {
                    webs: webname
                }
            }, (err, doc) => {
                if (!err) {
                    resolve(doc)
                } else {
                    reject(err)
                }
            })
        } else {
            subscription.updateOne({
                username
            }, {
                $pull: {
                    webs: webname
                }
            }, (err, doc) => {
                if (!err) {
                    resolve(doc)
                } else {
                    reject(err)
                }
            })
        }

    })
    return promise
}

// 入口
async function addSubscription(username, webname, type) {
    if (!webname) {
        return Promise.reject("网站名为空")
    }
    let result = ''
    let exist = await existSubscription(username)
    if (exist) {
        if (exist.webs.includes(webname) && type === false) {
            // 返回已存在
            return Promise.reject("网站已被订阅")
        } else {
            result = await updateSubscription(username, webname, type)
        }
    } else {
        // 将webname转化为数组
        webname = [webname]
        await createSubscription(username, webname)
        result = {
            ok: 1
        }
    }
    return result
}
module.exports = addSubscription