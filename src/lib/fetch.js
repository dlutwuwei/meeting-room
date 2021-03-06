import 'whatwg-fetch'
import { abortableFetch } from './abort-controller';
import { Modal } from 'antd';

const defOpts = {
    mode: 'cors',
    credentials: 'include'
}

const defGetOpts = {
    headers: {
        'Accept': 'application/json'
    }
}



function toQueryString(obj) {
    return obj ? Object.keys(obj).map(function (key) {
        const val = obj[key]

        if (Array.isArray(val)) {
            return val.map(function (val2) {
                return encodeURIComponent(key + '[]') + '=' + encodeURIComponent(val2)
            }).join('&')
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : ''
}

let popFlag = false;

function request(method, url, data, opts) {
    const isGet = method === 'get'
    let finalData, query;
    const defPostOpts = {
      headers: {
          'Accept': 'application/json'
      }
    }
    if(data instanceof FormData) {
      query = data;
    } else {
      defPostOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8',
      finalData = Object.assign(
        isGet ? { _: Date.now() } : {},
        data
      );
      query = toQueryString(finalData)
    }


    const finalUrl = isGet ? url + '?' + query : url
    const finalOpts = Object.assign(
        {
            method: method
        },
        defOpts,
        isGet ? defGetOpts : defPostOpts,
        opts
    );

    if(!isGet) {
        finalOpts.body = query;
    }

    return abortableFetch(finalUrl, finalOpts)
        .then((res) => {
            // http 返回成功
            if (res.status == 200) {
                return Promise.resolve(res)
            } else {
                return Promise.reject(res)
            }
        })
        .then((res) => {
            // 处理response
            if (res.headers.get('content-type').indexOf('application/json') !== -1) {
                return res.json().catch(() => {
                    return Promise.reject({ s: 810, msg: '无法解析成JSON' })
                })
            } else {
                return Promise.reject({ s: 800, msg: '非JSON格式' })
            }
        })
        .then((res_data) => {
            const data = res_data;
            // 判断返回的s值
            if(data.code === 0) {
                return Promise.resolve(data);
            } else {
                if(popFlag) {
                    return Promise.reject();
                }
                if(data.code ===  404 || data.code === 402 || data.code === 401) {
                    popFlag = true;
                    Modal.confirm({
                        title: '登录已失效，请点击确定重新登录?',
                        okText: '确认',
                        cancelText: '取消',
                        onOk() {
                            popFlag = false;
                            location.href=`${window.auth_url}?callback=` + encodeURIComponent(`${location.protocol}//${location.host}${location.pathname}`);
                        },
                        onCancel() {
                            popFlag = false;
                        },
                    });
                } else if (data.code === 505) {
                    Modal.info({
                        title: '没有权限使用这个功能, 请联系管理员',
                        okText: '确认'
                    });
                }
                return Promise.reject({ code: data.code, msg: `错误码${data.code}` })
            }
        }).catch(res => {
            if(res.code) {
                return Promise.reject(res);
            }
            return res.text().then((data) => {
                try {
                    const d = JSON.parse(data);
                    return Promise.reject(d.error);
                } catch(e) {
                    return Promise.reject(data);
                }
            });
        })
}

export default {
    get(url, data, opts) {
        return request('get', url, data, opts)
    },
    post(url, data, opts) {
        return request('post', url, data, opts)
    }
}
