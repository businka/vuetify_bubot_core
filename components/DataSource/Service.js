import Source from './Source'
import buxios from '../../helpers/buxios'
import axios from 'axios'
import {EJSON} from 'bson'
import {updateObject} from 'bubot-helper/BaseHelper'
import ExtException from 'bubot-helper/ExtException'

export default class Service extends Source {
    getAll() {
        return null
    }

    async _list() {
        return null
    }

    get_obj_url() {
        if (this.props.subtype) {
            return `/${this.props.appName}/api/${this.props.objName}/${this.props.subtype}`
        } else {
            return `/${this.props.appName}/api/${this.props.objName}`
        }
    }

    async list(filter = {}, nav = {}) {
        if (this.rawData !== undefined) {
            const result = this.rawData
            this.rawData = undefined
            return result
        }
        let data = {
            Filter: updateObject({}, this.props.filterConst, filter),
            Pagination: nav,
            ExtraFields: this.props.extraFields
        }
        let url = `${this.get_obj_url()}/${this.props.list || 'list'}`
        return this.buxios_post(url, data)
    }

    async read(id) {
        this.loading = true
        let resp
        try {
            let url = `${this.get_obj_url()}/read`
            resp = await buxios.get(url, {params: {id}})
            this.loading = false
            return resp.data
        } catch (err) {
            throw new ExtException({parent: err})
        } finally {
            this.loading = false
        }
    }

    async read_by_key(obj) {
        this.loading = true
        let resp
        try {
            let url = `${this.get_obj_url()}/read_by_key`
            resp = await buxios.post(url, obj)
            this.loading = false
            return resp.data
        } catch (err) {
            throw new ExtException(err.data)
        } finally {
            this.loading = false
        }
    }

    async update(data) {
        let url = `${this.get_obj_url()}/update`
        return await this.buxios_post(url, data)
    }

    async create(data) {

        updateObject(data, this.props.filterConst)
        let url = `${this.get_obj_url()}/create`
        data = await this.buxios_post(url, data)
        console.log(data)
        await this.fetchRow([data[this.props.keyProperty]])
    }

    async call(method, data) {
        let url = `${this.get_obj_url()}/${method}`
        return await this.buxios_post(url, data)
    }

    async post(payload) {
        let url = `${this.get_obj_url()}/${payload.method}`
        return await axios.post(url, payload.data)
    }

    async buxios_post(url, data) {
        this.loading = true
        let resp
        try {
            resp = await buxios.post(url, data)
            this.loading = false
            return resp.data
        } finally {
            this.loading = false
        }

    }
}
