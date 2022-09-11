let Source = require('./Source')
import buxios from '../../../Helpers/buxios'
import {updateObject} from '../../../Helpers/BaseHelper'
import ExtException from '../../../Helpers/ExtException'

export default class Service extends Source {
    getAll() {
        return null
    }

    async _query() {
        return null
    }

    async query(filter, nav = {}) {
        this.loading = true
        let params = updateObject(nav, this.props.filterConst, filter)
        // params = this.props.filter
        let actionName
        if (this.props.subtype) {
            actionName = `/${this.props.appName}/api/${this.props.objName}/${this.props.subtype}/${this.props.query || 'query'}`

        } else {
            actionName = `/${this.props.appName}/api/${this.props.objName}/${this.props.query || 'query'}`
        }
        try {
            let resp = await buxios.get(actionName,
                {params}
            )
            console.log(resp)
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
            resp = await buxios.get(`/${this.props.appName}/api/${this.props.objName}/read`,
                {params: {id}}
            )
            this.loading = false
            return resp.data
        } catch (err) {
            throw new ExtException(err.data)
        } finally {
            this.loading = false
        }
    }

    async update(data) {
        this.loading = true
        let resp
        try {
            resp = await buxios.post(`/${this.props.appName}/api/${this.props.objName}/update`,
                data
            )
            this.loading = false
            return resp.data
        } finally {
            this.loading = false
        }
    }

    async create(data) {
        this.loading = true
        let resp
        try {
            resp = await buxios.post(`/${this.props.appName}/api/${this.props.objName}/create`,
                data
            )
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
            resp = await buxios.post(`/${this.props.appName}/api/${this.props.objName}/${payload.method}`, payload.data)
            this.loading = false
            return resp.data
        } finally {
            this.loading = false
        }

    }
}
