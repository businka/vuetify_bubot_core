import axios from 'axios'
import {EJSON} from 'bson'
import {redirectToSignIn, getAppUrl} from '../components/Session/session'
import {navigate} from '@/Helpers/UrlParam'
import ExtException from '../../Helpers/ExtException'


function bson_deserialize(config) {
    if (!config) {
        config = {}
    }
    config.transformResponse = function (data, headers) {
        let contentType = headers['content-type']
        if (contentType && contentType.indexOf('json') >= 0) {
            try {
                return EJSON.parse(data)
            } catch (e) {
                throw new ExtException({message: 'Bad BSON answer ', detail: String(e), dump: {data}})
            }
        } else {
            return data
        }
    }
    config.responseType = 'json'
    return config
}

export default {

    post: async function (url, data, config) {
        try {
            config = bson_deserialize(config)
            return await axios.post(url, data, config)
        } catch (err) {
            processError(err.response)
        }
    },
    get: async function (url, config) {
        try {
            config = bson_deserialize(config)
            return await axios.get(url, config)
        } catch (err) {
            console.log(err)
            if (err.response) {
                processError(err.response)
            } else {
                throw(new ExtException({
                    message: 'Ошибка отправки запроса',
                    detail: `${url} - ${err.message}`,
                    dump: config
                }))
            }
        }
    }
}

function processError(response) {

    let contentType = undefined
    if (response.headers) {
        contentType = response.headers['content-type']
    }
    let destPath
    let url = getAppUrl()
    switch (response.status) {
        case 401:
            redirectToSignIn(window.location.pathname + window.location.search)
            break
        case 409:
            destPath = `${url.base}${url.appName}Account/select`
            if (destPath !== window.location.pathname)
                navigate(`${destPath}?redirect=${url.base}${url.appName}${url.path}${window.location.search}`)
            break
    }
    if (contentType && contentType.toLowerCase().indexOf('application/json') >= 0) {
        throw  new ExtException(response.data)
    } else {
        throw(new ExtException({
            message: `${response.status} ${response.statusText}`,
            detail: response.data
        }))
    }
}
