import { dateFormatter, parseCertProps, state, mutations, find } from './cades.store'
// import { Base64 } from './base64'

export default {
  namespaced: true,
  state,
  mutations,
  actions: {
    find,
    async getCertificates({ state, commit }) {
      commit('updateProgress', 0)

      let oStore = await openStore()
      let allCerts = await oStore.Certificates
      let countCerts = await allCerts.Count
      let cert, toDate, active, fromDate, hasPrivateKey
      let certObj
      let progress = 0
      let dateObj = new Date()
      commit('setCertificates', [])
      // let j = 0
      for (let i = 1; i <= countCerts; i++) {
        progress = Math.max(progress, Math.ceil(i * 100 / countCerts))
        if (progress !== state.progress) {
          commit('updateProgress', progress)
        }
        try {
          certObj = await allCerts.Item(i)
          hasPrivateKey = await certObj.HasPrivateKey()
          if (!hasPrivateKey) {
            continue
          }
          cert = parseCertProps(await certObj.SubjectName, 'subject')
          if (cert['subjectNameCN'] === 'DO_NOT_TRUST') {
            continue
          }

          // const pubKey = await certObj.PublicKey()
          // const algo = pubKey.Algorithm

          toDate = new Date((await certObj.ValidToDate))
          fromDate = new Date(await certObj.ValidFromDate)
          active = fromDate <= dateObj && dateObj <= toDate
          if (!active || !await certObj.IsValid()) {
            continue
          }


          cert.index = i
          // cert.cert = certObj
          cert.toDate = dateFormatter.format(toDate)
          cert.fromDate = dateFormatter.format(fromDate)
          cert.active = active
          cert.sha1 = await certObj.Thumbprint
          // cert.algoOid = algo.Value
          // cert.algoName = algo.FriendlyName
          cert.serialNumber = await certObj.SerialNumber
          commit('addCertificate', { cert, certObj })
          // j++
        } catch (err) {
          console.error(err)
        }
      }
    },
    async signBase64String(store, payload) {
      let signature
      const cadesplugin = window.cadesplugin
      const dataToSign = payload.data
      const sha1 = payload.cert.sha1
      const detached = payload.detached || false

      let oStore = await openStore()
      let certObj = await findCertBySha1(oStore, sha1)
      oStore.Close();

      let errormes = ''
      let oSigner
      try {
        oSigner = await cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner')
        console.log('oSigner', oSigner)
      } catch (err) {
        console.log(err)
        errormes = 'Failed to create CAdESCOM.CPSigner: ' + err.number
        throw new Error(errormes)
      }
      if (!oSigner) {
        errormes = 'Failed to create CAdESCOM.CPSigner'
        throw new Error(errormes)

      }

      try {
        // FillCertInfo_Async(certificate);
        // let oSigningTimeAttr = await cadesplugin.CreateObjectAsync('CADESCOM.CPAttribute')
        //
        // await oSigningTimeAttr.propset_Name(cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME)
        // let oTimeNow = new Date()
        // await oSigningTimeAttr.propset_Value(oTimeNow)
        // let attr = await oSigner.AuthenticatedAttributes2
        // await attr.Add(oSigningTimeAttr)
        //
        // let oDocumentNameAttr = await cadesplugin.CreateObjectAsync('CADESCOM.CPAttribute')
        // await oDocumentNameAttr.propset_Name(cadesplugin.CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME)
        // await oDocumentNameAttr.propset_Value('Document Name')
        // await attr.Add(oDocumentNameAttr)

        await oSigner.propset_Certificate(certObj)
        let oSignedData = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData')
        if (dataToSign) {
          // Данные на подпись ввели
          await oSigner.propset_Options(cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY)
          await oSignedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY)
          if (typeof (setDisplayData) !== 'undefined') {
            // Set display data flag flag for devices like Rutoken PinPad
            await oSignedData.propset_DisplayData(1)
          }
          console.log('beforeSetContent')
          await oSignedData.propset_Content(dataToSign)

          try {
            // console.log('beforeSignCades')
            signature = await oSignedData.SignCades(oSigner, cadesplugin.CADESCOM_CADES_BES, detached)
            // console.log('afterSignCades')
          } catch (err) {
            errormes = 'Не удалось создать подпись из-за ошибки: ' + cadesplugin.getError(err)
            // throw err
            console.error('SignCades')
            throw new Error(errormes)
          }
        }
        // console.log(signature)
        return signature
      } catch (err) {
        console.error('SignCades !!!!')
        throw err
      }
    }
  }

}

async function openStore() {
  let oStore
  try {
    oStore = await window.cadesplugin.CreateObjectAsync('CAdESCOM.Store')
  } catch (e) {
    const msg = 'Ошибка при создании хранилища: ' + window.cadesplugin.getError(e)
    console.error(msg)
    throw new Error(msg)
  }
  if (!oStore) {
    throw new Error('Ошибка при создании хранилища')
  }

  try {
    await oStore.Open();
  } catch (e) {
    throw new Error('Ошибка при открытии хранилища: ' + window.cadesplugin.getError(e))
  }
  return oStore
}

async function findCertBySha1(oStore, sha1) {
  let allCerts, findCerts
  try {
    allCerts = await oStore.Certificates
    findCerts = await allCerts.Find(window.cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, sha1);
  } catch (e) {
    await oStore.Close();
    throw new Error('Can not find certificate by hash:' + window.cadesplugin.getError(e));
  }

  if (0 === (findCerts.Count)) {
    await oStore.Close();

    throw new Error('Certificate not found');
  }

  return await findCerts.Item(1);
}