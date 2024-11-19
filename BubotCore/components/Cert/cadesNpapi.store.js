import { dateFormatter, parseCertProps, state, mutations, find } from './cades.store'
// import { Base64 } from './base64'


window.certs = []

export default {
  namespaced: true,
  state,
  mutations,
  actions: {
    find,
    async getCertificates({ commit }) {
      // alert('begin get Certificates')
      let countCerts, allCerts
      let oStore = openStore()

      try {
        allCerts = oStore.Certificates
        countCerts = allCerts.Count
      } catch (e) {
        oStore.Close();
        throw new Error('Невозможно загрузить список сертификатов.' + window.cadesplugin.getError(e))
      }

      let cert, toDate, active, fromDate, hasPrivateKey
      let progress = 0
      let dateObj = new Date()
      commit('setCertificates', [])
      for (let i = 1; i <= countCerts; i++) {
        let certObj
        progress = Math.max(progress, Math.ceil(i * 100 / countCerts))
        if (progress !== state.progress) {
          commit('updateProgress', progress)
        }
        try {
          certObj = allCerts.Item(i)
          hasPrivateKey = certObj.HasPrivateKey()
          if (!hasPrivateKey) {
            continue
          }
          cert = parseCertProps(certObj.SubjectName, 'subject')
          if (cert['subjectNameCN'] === 'DO_NOT_TRUST') {  //выкидываем порнуху фидлера
            continue
          }

          // const pubKey = certObj.PublicKey()
          // const algo = pubKey.Algorithm

          toDate = new Date((certObj.ValidToDate))
          fromDate = new Date(certObj.ValidFromDate)
          active = fromDate <= dateObj && dateObj <= toDate
          if (!active || !certObj.IsValid()) {
            continue
          }
          cert.index = i
          // cert.cert = certObj
          cert.toDate = dateFormatter.format(toDate)
          cert.fromDate = dateFormatter.format(fromDate)
          cert.sha1 = certObj.Thumbprint
          // cert.algoOid = algo.Value
          // cert.algoName = algo.FriendlyName
          cert.active = active
          commit('addCertificate', { cert, certObj })
        } catch (err) {
          console.error(err)
        }
        oStore.Close()
      }
    },

    async signBase64String(store, payload) {
      let signature
      const cadesplugin = window.cadesplugin
      const dataToSign = payload.data
      const sha1 = payload.cert.sha1

      let oStore = openStore()
      let certObj = findCertBySha1(oStore, sha1)
      oStore.Close();


      let oSigner
      let errormes = ''
      errormes = await errormes
      try {
        // alert('before-cpsigner')
        oSigner = cadesplugin.CreateObject('CAdESCOM.CPSigner')
      } catch (err) {
        errormes = '09 Failed to create CAdESCOM.CPSigner: ' + err.number
        // alert(errormes)
        throw errormes
      }
      oStore.Close()
      if (oSigner) {
        // alert('before-signer=cert')
        try {
          oSigner.Certificate = certObj
        } catch (err) {
          // alert('10a' + err + '-' + cadesplugin.getLastError(err))
          return
        }

        // oStore.Close()
      } else {
        errormes = '10 Failed to create CAdESCOM.CPSigner'
        // alert(errormes)
        throw errormes
      }
      let oSignedData
      try {
        oSignedData = cadesplugin.CreateObject('CAdESCOM.CadesSignedData')
      } catch (err) {
        // alert('11 Failed to create CAdESCOM.CadesSignedData: ' + err.number)
        return
      }

      if (dataToSign) {
        // Данные на подпись ввели
        oSignedData.ContentEncoding = cadesplugin.CADESCOM_BASE64_TO_BINARY
        if (typeof (setDisplayData) !== 'undefined') {
          // Set display data flag flag for devices like Rutoken PinPad
          oSignedData.DisplayData = 1
        }
        oSignedData.Content = dataToSign
        oSigner.Options = cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN //CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY
        try {
          signature = oSignedData.SignCades(oSigner, cadesplugin.CADESCOM_CADES_BES, true)
        } catch (err) {
          errormes = 'Не удалось создать подпись из-за ошибки: ' + cadesplugin.getError(err)
          // alert('12 ' + cadesplugin.getLastError(err))
          throw errormes
        }
        return signature
      }
    }
  }
}

function openStore() {
  let oStore
  try {
    oStore = window.cadesplugin.CreateObject('CAdESCOM.Store')
  } catch (e) {
    throw new Error('Ошибка при создании хранилища: ' + window.cadesplugin.getError(e))
  }
  if (!oStore) {
    throw new Error('Ошибка при создании хранилища')
  }

  try {
    oStore.Open();
  } catch (e) {
    throw new Error('Ошибка при открытии хранилища: ' + window.cadesplugin.getError(e))
  }
  return oStore
}

function findCertBySha1(oStore, sha1) {
  let allCerts, findCerts
  try {
    allCerts = oStore.Certificates
    findCerts = allCerts.Find(window.cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, sha1);
  } catch (e) {
    oStore.Close();
    throw new Error('Can not find certificate by hash:' + window.cadesplugin.getError(e));
  }

  if (0 === (findCerts.Count)) {
    oStore.Close();

    throw new Error('Certificate not found');
  }

  return findCerts.Item(1);
}