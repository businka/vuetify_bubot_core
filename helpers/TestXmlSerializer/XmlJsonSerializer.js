export const xml = {
  xmlNodes: ['array', 'object', 'str', 'num'],
  decode: function(xmlStr) {
    const xml = this.loads(xmlStr)
    return this.decodeNode(xml.childNodes[0], null, '')
  },
  decodeNode: function(node, parent, path) {
    if (this.xmlNodes.indexOf(node.nodeName) === -1) { return }
    // throw new Error("unsupported node: " + node.nodeName + ", path:" + path + ", content:" + node.textContent + ",");
    const name = node.getAttribute('name')
    const result = this['decode_' + node.nodeName](node, parent, path + '.' + (name || node.nodeName))
    if (name) {
      parent[name] = result
      return
    }
    return result
  },
  decode_array: function(node, parent, path) {
    const result = []
    const _nodes = node.childNodes
    if (_nodes) {
      // alert('array'+ node.textContent);
      for (let i = 0; i < _nodes.length; i++) {
        result.push(this.decodeNode(_nodes[i], null, path))
      }
    }
    return result
  },
  decode_object: function(node, parent, path) {
    const result = {}
    const _nodes = node.childNodes
    if (_nodes) {
      // alert('object'+ node.textContent);
      for (let i = 0; i < _nodes.length; i++) {
        this.decodeNode(_nodes[i], result, path)
      }
    }
    return result
  },
  decode_str: function(node, parent) {
    return node.textContent
  },
  decode_num: function(node, parent) {
    return node.textContent
  },
  loads: function(xmlStr) {
    //                alert('window.DOMParser="' +typeof window.DOMParser + '"; window.ActiveXObject="' +typeof window.ActiveXObject +'"');
    if (typeof window.DOMParser !== 'undefined') {
      return new window.DOMParser().parseFromString(xmlStr, 'text/xml')
    } else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
      const xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
      xmlDoc.async = 'false'
      xmlDoc.loadXML(xmlStr)
      return xmlDoc
    } else {
      throw new Error('No XML parser found')
    }
  }

}
