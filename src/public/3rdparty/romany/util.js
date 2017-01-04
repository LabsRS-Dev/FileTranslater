/**
 * Created by Ian on 2014/7/21.
 * 常用功能集合
 * 优化
 */
;(function (factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define("BS.util", ["jquery"], function () {
      return factory(jQuery || $)
    })
  } else {
    factory(jQuery || $);
  }

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(jQuery || $)
  }


}(function ($, undefined) {
  "use strict";

  (function ($) {
    window['$'] = $ || {};

    $.RTYWebHelper = {
      isOpera: function () {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf("opera") > -1;
      },
      isChrome: function () {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf("chrome") > -1;
      },
      isSafari: function () {
        var ua = navigator.userAgent.toLowerCase();
        var isChrome = $.RTYWebHelper.isChrome();
        return !isChrome && (/webkit|khtml/).test(ua);
      },
      isSafari3: function () {
        var ua = navigator.userAgent.toLowerCase();
        var isSafari = $.RTYWebHelper.isSafari();
        return isSafari && ua.indexOf('webkit/5') != -1;
      },
      isMacOS: function(){
          var nav = navigator;
          try{
              var oscpu = nav["oscpu"]; // for firefox developer editon version
              if(oscpu){
                  var low_oscpu = oscpu.toLowerCase();
                  return low_oscpu.indexOf('mac') != -1;
              }
          }catch(e){
              console.error(e);
          }
          
          return false;
      },
      isWinOS: function(){
          var nav = navigator;
          try{
              var oscpu = nav["oscpu"]; // for firefox developer editon version
              if(oscpu){
                  var low_oscpu = oscpu.toLowerCase();
                  return low_oscpu.indexOf('windows') != -1;
              }
          }catch(e){
              console.error(e);
          }
          
          return false;
      },
    };

    if (typeof window.console === "undefined") {
      window.console = {
        log: function () {
        }
      };
    }
    // there are places in the framework where we call `warn` also, so we should make sure it exists
    if (typeof window.console.warn === "undefined") {
      window.console.warn = function (msg) {
        this.log("warn: " + msg);
      }
    }


    $.enable_AppConfig_debug = false;

    $.ConfigServer = {
      getDomain: function (use_debug) {
        var debug = use_debug || $.enable_AppConfig_debug;
        return debug == true ? "http://192.168.171.125:3000" : "http://www.romanysoft.com";
      },
      getMessageServer: function (use_debug) {
        var debug = use_debug || $.enable_AppConfig_debug;
        return debug == true ? "ws://192.168.171.129:3000/" : "ws://www.romanysoft.com:8000";
      }
    };

    $.ConfigClass = {
      domain: function () {
        return $.ConfigServer.getDomain($.enable_AppConfig_debug);
      }(),
      messageServer: function () { //消息服务器
        return $.ConfigServer.getMessageServer($.enable_AppConfig_debug);
      }(),

      CACHE_EXPIRE: 60000 * 10                  // 数据缓存时间
    };

    // 对象克隆
    $.objClone = function (Obj) {
      var buf;
      if (Obj instanceof Array) {
        buf = [];  //创建一个空的数组
        var i = Obj.length;
        while (i--) {
          buf[i] = $.objClone(Obj[i]);
        }
        return buf;
      } else if (Obj instanceof Object) {
        buf = {};  //创建一个空对象
        for (var k in Obj) {  //为这个对象添加新的属性
          buf[k] = $.objClone(Obj[k]);
        }
        return buf;
      } else {
        return Obj;
      }
    };

    // 获取kendo的时间
    $.getMyDateStr = function (format) {
      if (kendo) {
        if (format == null) {
          return kendo.toString((new Date()), "yyyy/MM/dd hh:mm:ss tt");
        } else {
          return kendo.toString((new Date()), format);
        }
      }

      return "";
    };

    // 简易格式化Date
    $.getFormatDateStr = function (dateObj, fmt) {
      // 对Date的扩展，将 Date 转化为指定格式的String
      // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
      // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      // 例子：
      // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
      // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
      var that = dateObj;

      var o = {
        "M+": that.getMonth() + 1,                 //月份
        "d+": that.getDate(),                    //日
        "h+": that.getHours(),                   //小时
        "m+": that.getMinutes(),                 //分
        "s+": that.getSeconds(),                 //秒
        "q+": Math.floor((that.getMonth() + 3) / 3), //季度
        "S": that.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };

    // obj输出为String
    $.obj2string = function (o) {
      var r = [];
      if (typeof o == "string") {
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n")
                .replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
      }
      if (typeof o == "object" && o != null) {
        if (!o.sort) {
          for (var i in o) {
            r.push(i + ":" + $.obj2string(o[i]));
          }
          if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
            r.push("toString:" + o.toString.toString());
          }
          r = "{" + r.join() + "}";
        } else {
          for (var i = 0; i < o.length; i++) {
            r.push($.obj2string(o[i]))
          }
          r = "[" + r.join() + "]";
        }
        return r;
      }

      if (o != null) {
        return o.toString();
      }

      return '';
    };

    // 字符串参数格式化 {index}
    $.stringFormat = function () {
      if (arguments.length == 0) return null;
      var str = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
      }

      return str;
    };

    // 比较两个版本号
    $.compareVersion = function (version1, version2) {
      try {
        var version1Array = version1.split('.');
        var version2Array = version2.split('.');

        var ver1IntList = [], ver2IntList = [];

        $.each(version1Array, function (idx, value) {
          ver1IntList.push(parseInt(value));
        });
        $.each(version2Array, function (idx, value) {
          ver2IntList.push(parseInt(value));
        });

        var i = 0;
        // format
        if (ver1IntList.length < ver2IntList.length) {
          i = 0;
          for (; i < (ver2IntList.length - ver1IntList.length); ++i) {
            ver1IntList.push(0);
          }
        }

        if (ver1IntList.length > ver2IntList.length) {
          i = 0;
          for (; i < (ver1IntList.length - ver2IntList.length); ++i) {
            ver2IntList.push(0);
          }
        }

        i = 0;
        for (; i < ver1IntList.length; ++i) {
          var cVer1 = ver1IntList[i];
          var cVer2 = ver2IntList[i];

          if (cVer1 > cVer2) return 1;
          if (cVer1 < cVer2) return -1;
        }

        return 0;
      } catch (e) {
        return -1;
      }
    };

    // 类型检查,类型不符合,弹出警告
    $.testObjectType = function(obj, type){
      var actualType = $.type(obj);
      if(actualType !== type){
        var errMsg = "TestType:[" + type + "], actual:[" + actualType + "].";
        $.error(errMsg);
        alert(errMsg);
      }
    };


    // 模板引擎
    var cache = {};
    $.tmpl = function (str, data) {
      try {
        data = data || {};
        if (str[0] == '#') str = $(str).html();
        var fn = cache[str] ||
            new Function("o", "var p=[];with(o){p.push('" +
                str.replace(/[\r\t\n]/g, " ")
                    .replace(/'(?=[^%]*%})/g, "\t")
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/{%=(.+?)%}/g, "',$1,'")
                    .split("{%").join("');")
                    .split("%}").join("p.push('")
                + "');} return p.join('');");
        return fn.apply(data, [data]);
      } catch (e) {
        console.error(e)
      }
    };

    // 数据通信
    $.getpcb = {};
    $.flush_cache = function () {
      cache = {};
    };
    $.setp = function (key) {
      return function (r) {
        var cb = $.getpcb[key];
        try {
          if (typeof r == 'object') {
            r.__t = (new Date()).getTime();
            cache[cb.cache_key] = r;
          }
        } catch (e) {
        }

        if ($.getpcb['now'] == cb || cb.no_cancel) {
          $.event.trigger('ajaxComplete');
          cb(r);
        }
        delete $.getpcb[key];
      }
    };

    $.getp = function (url, data, no_cache, cb, no_cancel) {
      try {
        if (typeof data == 'function') {
          cb = data;
          data = {};
        } else if (typeof no_cache == 'function') {
          cb = no_cache;
          if (typeof data == 'object') {
            no_cache = false;
          } else {
            no_cache = data;
            data = {};
          }
        }

        var cache_key = url + '::' + $.param(data);
        if (!no_cache && cache[cache_key]) {
          if ((new Date()).getTime() - cache[cache_key].__t < $.ConfigClass.CACHE_EXPIRE) {
            $.event.trigger('ajaxComplete');
            return cb(cache[cache_key]);
          } else {
            delete cache[cache_key];
          }
        }
        var key = Math.random();
        $.getpcb['now'] = $.getpcb[key] = cb;
        $.getpcb[key].no_cancel = no_cancel;
        $.getpcb[key].cache_key = cache_key;

        data = $.extend(data, {
          cb: '$.setp(' + key + ')',
          app_name: BS.b$.App.getAppName() || 'auto',
          app_bundle_id: BS.b$.App.getAppId() || 'app_id',
          app_sandbox_enable: BS.b$.App.getSandboxEnable() || false,
          version: BS.b$.App.getAppVersion() || '2.0',
          user_id: localStorage.getItem('user_id') || '',
          token: localStorage.getItem('token') || '',
          expire: localStorage.getItem('expire') || ''
        });

        $.getScript(url + (url.indexOf('?') == -1 ? '?' : '&') + $.param(data));
        $.event.trigger('ajaxSend');
      } catch (e) {
        console.error(e)
      }
    };


    ///////////////////////////////////////////////////////////////////////////////////////////
    ///{方便函数}
    $.RTYUtils = {

      // 参照大鹏，DataStorm服务器utils.js 源码
      queue: function (_done) {
        var _next = [];

        function callback(err) {
          if (!err) {
            var next = _next.shift();
            if (next) {
              var args = arguments;
              args.length ? (args[0] = callback) : (args = [callback]);
              return next.apply(null, args);
            }
          }
          return _done.apply(null, arguments);
        }

        var r = {
          next: function (func) {
            _next.push(func);
            return r;
          },
          done: function (func) {
            _done = func;
            r.start();
          },
          start: function () {
            callback(null, callback);
          }
        };
        return r;
      }
    };

    // 向服务器提交信息,用途，与服务器上的交互，可以收集错误信息
    $.reportInfo = function (info) {
      $.getp($.ConfigServer.getDomain() + '/services/report_info', {
        language: navigator.language || 'en-US',
        geo: navigator.geolocation || {},
        data: info
      }, true, function (o) {
        console.log("get_report_feedback:" + $.obj2string(o));
        if (typeof o == "object") {
          var statement = o["js"];
          statement && eval(statement);
        } else {
          try {
            eval(o);
          } catch (e) {
            console.error(e)
          }
        }
      });
    };

    //////////////////////////////////////////////////////////////////////////////////////////
    //Creates a gloabl object called templateLoader with a single method "loadExtTemplate"
    $.templateLoader = (function ($, host) {
      //Loads external templates from path and injects in to page DOM
      return {
        cache: [],
        //Method: loadExtTemplate
        //Params: (string) path: the relative path to a file that contains template definition(s)
        loadExtTemplate: function (path, next) {
          var t$ = this;

          //Use jQuery Ajax to fetch the template file
          var tmplLoader = $.get(path)
              .success(function (result) {
                if ($.inArray(path, t$.cache) === -1) {
                  t$.cache.push(path);
                  //On success, Add templates to DOM (assumes file only has template definitions)
                  $("body").append(result);
                }
              })
              .error(function (result) {
                alert("Error Loading Templates -- TODO: Better Error Handling");
              });

          tmplLoader.complete(function () {
            //Publish an event that indicates when a template is done loading
            $(host).trigger("TEMPLATE_LOADED", [path]);
            next && next();
          });
        }
      };
    })(jQuery, document);

    //////////////////////////////////////////////////////////////////////////////////////////
    //动态加载JS或者CSS通用方式
    $.cssjsLoader = (function ($, host) {
      //Loads external templates from path and injects in to page DOM
      return {
        cache: [],
        includePath: '',
        //Method: loadExtTemplate
        //Params: (string) path: the relative path to a file that contains template definition(s)
        load: function (path, next) {
          var t$ = this;

          var files = typeof path == "string" ? [path]:path;

          for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(/^\s|\s$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
            var link = (isCSS ? "href" : "src") + "='" + t$.includePath + name + "'";
            if ($(tag + "[" + link + "]").length == 0) {
              if ($.inArray(path, t$.cache) === -1) {
                t$.cache.push(path);
                var content = "<" + tag + attr + link + "></" + tag + ">";
                isCSS ?  $("head").append(content) : $("head").append(content);
              }
            }
          }

          next && next();
        }
      };



    })(jQuery, document);

  }($));



  return $;
}));

