let Source = require('./Source')
import buxios from '../../helpers/buxios'
import {EJSON} from 'bson'
import {updateObject} from '../../../Helpers/BaseHelper'
import ExtException from '../../../Helpers/ExtException'

export default class Service extends Source {
    getAll() {
        return null
    }

    async _list() {
        return null
    }

    async list(filter = {}, nav = {}) {
        this.loading = true
        let data = {
            filter: updateObject({}, this.props.filterConst, filter),
            nav
        }
        let url = `/${this.props.appName}/api/${this.props.objName}/${this.props.list || 'list'}`
        return this.post(url, data)
    }

    async read(id) {
        this.loading = true
        let resp
        try {
            let url = `/${this.props.appName}/api/${this.props.objName}/read`
            resp = await buxios.get(url, {params: {id}})
            this.loading = false
            return resp.data
        } catch (err) {
            throw new ExtException(err.data)
        } finally {
            this.loading = false
        }
    }

    async update(payload) {
        let url = `/${this.props.appName}/api/${this.props.objName}/update`
        return this.post(url, payload.data)
    }

    async create(payload) {
        let url = `/${this.props.appName}/api/${this.props.objName}/create`
        return this.post(url, payload.data)
    }

    async call(payload) {
        let url = `/${this.props.appName}/api/${this.props.objName}/${payload.method}`
        return this.post(url, payload.data)
    }
    async post(url, data) {
        this.loading = true
        let resp
        try {
            data = EJSON.serialize(data)
            let config = {headers: {'ContentType': 'application/json'}}
            resp = await buxios.post(url, data, config)
            this.loading = false
            return resp.data
        } finally {
            this.loading = false
        }

    }
}
