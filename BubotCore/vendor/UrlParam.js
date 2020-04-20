// /**
//  * @author Разговоров М.А.
//  */
//   var _class = Abstract.extend(/** @lends Integration/Core/UrlParam.prototype */
//     {
//       param: {},
//       constructor: function () {
//         var pos = location.href.indexOf('?');
//         if (pos !== -1) {
//           var query = location.href.substr(pos + 1);
//           var result = {};
//           query.split('&').forEach(function (param) {
//             if (!param) return;
//             var _param = param.split('=');
//             if (!_param) return;
//             result[_param[0]] = _param[1];
//           });
//           this.param = result;
//         }
//       },
//       parseUrl: function () {
//         var query;
//         var pos = location.href.indexOf('?');
//         if (pos === -1) return {};
//         query = location.href.substr(pos + 1);
//         var result = {};
//         query.split('&').forEach(function (param) {
//           if (!param) return;
//           var _param = param.split('=');
//           if (!_param) return;
//           result[_param[0]] = _param[1];
//         });
//         return result;
//       },
//       get: function (name, def) {
//         return this.param.hasOwnProperty(name) ? this.param[name] : def;
//       },
//       add: function (name, value) {
//         this.param[name] = value;
//         this.updateUrl();
//       },
//       del: function (name) {
//         delete this.param[name];
//         this.updateUrl();
//       },
//       updateUrl: function () {
//         var param = '';
//         for (var key in this.param)
//           if (this.param.hasOwnProperty(key)) {
//             param += param ? '&' : '?';
//             param += key + '=' + this.param[key];
//           }
//         window.history.pushState(null, null, param);
//       }
//     }
//   );
//   return _class;
// });
