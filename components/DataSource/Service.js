let Source = require('./Source')
import buxios from '../../../Helpers/buxios'
import {updateObject} from '../../../Helpers/BaseHelper'
import ExtException from '../../../Helpers/ExtException'

export default class Service extends Source {
    getAll() {
        return null
    }

    async _list() {
        return null
    }

    async list(filter, nav = {}) {
        this.loading = true
        let params = updateObject(nav, this.props.filterConst, filter)
        // params = this.props.filter
        let url = `/${this.props.appName}/api/${this.props.objName}/${this.props.list || 'list'}`

        try {
            let resp = await buxios.get(url, {params})
            // console.log(resp)
            return resp.data
        } catch (err) {
            throw new ExtException(err)
        } finally {
            this.loading = false
        }
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
        this.loading = true
        let resp
        try {
            let url = `/${this.props.appName}/api/${this.props.objName}/update`
            resp = await buxios.post(url, payload)
            this.loading = false
            return resp.data
        } finally {
            this.loading = false
        }
    }

    async create(payload) {
        this.loading = true
        let resp
        try {
            let url = `/${this.props.appName}/api/${this.props.objName}/create`
            resp = await buxios.post(url, payload)
            this.loading = false
            return resp.data
        } finally {
            this.loading = false
        }
    }

    async call(payload) {
        this.loading = true
        let resp
        try {
            let url = `/${this.props.appName}/api/${this.props.objName}/${payload.method}`
            resp = await buxios.post(url, payload.data)
            this.loading = false
            return resp.data
        } finally {
            this.loading = false
        }
    }
}
