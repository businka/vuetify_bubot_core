// import { xml } from './TestXmlSerializer/XmlJsonSerializer'
import UrlParam from '../../../Helpers/UrlParam'


export function initConnector() {
//  toExtSys = document.getElementById('toExtSys')
    if (!window.toExtSys) {
        let app = document.querySelector('body')
        window.toExtSys = document.createElement('div')
        window.toExtSys.setAttribute('style', 'display: none')
        window.toExtSys.setAttribute('id', 'toExtSys')
        window.toExtSys.setAttribute('name', 'toExtSys')
        window.toExtSys.setAttribute('ref', 'toExtSys')
        app.appendChild(window.toExtSys)
    }

    if (!window.lockExtSys) {
        window.lockExtSys = false
        window.callbackFromExtSys = null
        window.errorFromExtSys = null

        let mode = new UrlParam().get('mode')
        if (mode !== 'ie1c') {
            window.toExtSys.onclick = function (event) {
                // const _form = event.srcElement.getAttribute('form')
                const _method = event.srcElement.getAttribute('method')
                if (_method !== 'error') {
                    global.callbackFromExtSys('test')
                } else {
                    global.errorFromExtSys('test')
                }
            }
        }
    }
}

export async function commandTo1C(form, method, data, attempt) {
    let promise = new Promise((resolve, reject) => {
        if (!window.toExtSys) {
            initConnector()
        }
        if (window.lockExtSys) { // 1C не освободилась
            attempt = !attempt ? 1 : attempt + 1
            if (attempt > 5) {
                throw new Error('Превышено время ожидания внешней системы ')
            }
            setTimeout(commandTo1C(form, method, data, attempt), 100 * attempt)
            return
        }
        window.lockExtSys = true
        window.callbackFromExtSys = function (data) {
            window.lockExtSys = false
            resolve(data)
        }
        window.errorFromExtSys = function (data) {
            window.lockExtSys = false
            reject(data)
        }

        // document.write(navigator.userAgent);
        window.toExtSys.setAttribute('form', form)
        window.toExtSys.setAttribute('method', method)
        window.toExtSys.textContent = data
        // alert(data)
        console.log(`commandTo1C(${form}, ${method})`)
        window.toExtSys.click()

    })

    return await promise
}
