def(['$', 'lang', 'store'], function($, lang, store){
    var ntv = {}, idx=0, taksId=0;
    var pNative = null;

    // 兼容处理
    try{
        if((typeof maccocojs !== 'undefined') && (typeof maccocojs == 'object') && maccocojs.hasOwnProperty("app")){
            pNative = maccocojs; // 原MacOSX本地引擎
        }else if((typeof process === 'object') && (typeof require === 'function') && (process.hasOwnProperty("pid"))){
            try{
                console.log("============= must first load =================");
                pNative = require("remote").require("./romanysoft/maccocojs"); // Electron引擎
            }catch(e){
                console.log(e);
            }
        }
    }catch(e){
        console.log(e);
    }


    function ErrorItem(msg, detail, stack){
        return {
            msg: jet.tr(msg),
            detail: detail,
            stack: stack
        }
    }

    ntv.ErrorItem = ErrorItem;

    var _nativeCallback = window._nativeCallback = {
        onDragDropCallback : function (info){
            ImportFileCallback(info, _nativeCallback.dragdrop.callback);
        },
        dragdrop:{
            callback:function(err, it){},
            filter:null
        }
    };

    function ImportFileCallback(info, cb){
        if (info.success) {
            var items = [];
            if(info.filesCount){
                if (info.filesArray.length){
                    $.each(info.filesArray,function(id,it){
                        if (it.isReadable){
                            items.push(it)
                        } else {
                            cb(ErrorItem('native.select_file_unreadable', it.filePath));
                        }
                    })
                }
            }else if(info.filePath){
                if (info.isReadable) {
                    items.push(info);
                } else {
                    cb(ErrorItem('native.select_file_unreadable', it.filePath));
                }
            }
            if(items.length){
                $(items).each(function(id, it){
                    cb(null, {
                        taskId:taksId++
                        ,filePath:it.filePath
                        ,fileName:it.fileName
                        ,baseName:it.fileNameWithoutExtension
                        ,extension:it.extension
                        ,fileSize:it.fileSize
                        ,fileSizeFormated:it.fileSizeStr
                    });
                });
            }
        }
    }

    function _call(cb, arg){
        cb && setTimeout(function(){
            cb(arg);
        }, 0);
    }

    function _get_callback(func, noDelete){
        var r = 'callback' + idx++;
        _nativeCallback[r] = function(){
            try {
                if (!noDelete) {
                    delete _nativeCallback[r];
                }
            }catch(e){};
            func && func.apply(null, arguments);
        };
        return '_nativeCallback.' + r;
    }

    ntv.revealInFinder = function(path , _cb){
        if (pNative) {
            return pNative.window.revealInFinder(JSON.stringify({filePath: path}));
        }
        return _cb && _cb(path);
    };
    ntv.selectDirOpts = {
        allowOtherFileTypes:false,
        canChooseDir:true,
        canChooseFiles:false,
        title: jet.tr("native.select_dir_title"),
        prompt:jet.tr("native.prompt"),
        types:[]
    };

    ntv.isNative = function(){
        return typeof pNative !== "undefined" && pNative !== null;
    };

    // 获得产品的ID
    ntv.getAppID = function(defaultID){
        if (pNative) {
            return pNative.app.getAppIdentifier();
        }

        return defaultID || "";
    };

    // 获得产品的版本号
    ntv.getAppVersion = function(){
        if (pNative) {
            return pNative.app.getAppVersion();
        }

        return "1.0";
    };

    // 打开链接
    ntv.openUrl = function(url){
        if(typeof url === "undefined" || url === null || url === "") return;

        if (pNative) {
            return pNative.app.open(url);
        } else {
            try {
               return window.open(url);
            } catch (e) {
            }
        }
    };

    // 检测路径是否存在，且为Dir
    ntv.isExistDirPath = function(path){
        if (pNative){
            var _path = path;
            var exist = pNative.path.pathIsExist(_path);
            if (exist){
                return pNative.path.checkPathIsDir(_path);
            }
        }

        return false;
    };

    // 检测文件夹是否可写
    ntv.isDirCanWriteable = function(path){
        var t$ = this;
        if(t$.isExistDirPath(path)){
            return pNative.path.checkPathIsWritable(path);
        }

        return false;
    };

    ntv.selectDir = function(cb, opts, _cb){
        if (pNative) {
            return pNative.window.openFile(JSON.stringify($.extend({
                callback : _get_callback(function(info){
                    if (info.success) {
                        var it = info.filesCount ? info.filesArray[0] : info;
                        if (it.isWritable){
                            cb(null, it.filePath);
                        } else {
                            cb(ErrorItem("native.select_dir_err_unwriteable", it.filePath));
                        }
                    }
                })
            }, ntv.selectDirOpts, opts)));
        }
        _call(_cb, cb);
    };

    ntv.importFileOpts = {
        allowOtherFileTypes:false,
        canChooseDir:false,
        allowMulSelection:true,
        title: jet.tr("native.select_file_title"),
        prompt:jet.tr("native.prompt"),
        types:[]
    };
    ntv.importFile = function(cb, opts, _cb){
        if (pNative) {
            return pNative.window.openFile(JSON.stringify($.extend({
                callback : _get_callback(function(info){
                    ImportFileCallback(info, cb);
                })
            }, ntv.importFileOpts, opts)));
        }
        _call(_cb, cb);
    };

    ntv.serverPort = function(_cb){
        var r = 0;
        if (pNative) {
            r = pNative.app.getHttpServerPort();
        }
        if (!r) {
            return _cb ? _cb() : 8888 ;
        }
        return r;
    };

    ntv.serverUrl = function(path, _cb){
        return 'http://localhost:' + ntv.serverPort(_cb) + '/' + (path || '');
    };

    ntv.init = function(options){
        options || (options = {});
        if (options.dragdrop) {
            $.extend(_nativeCallback.dragdrop, options.dragdrop);
            if (pNative) {
                pNative.window.setDragDropCallback(JSON.stringify({callback: "_nativeCallback.onDragDropCallback"}));
                pNative.window.setDragDropAllowDirectory(JSON.stringify({enableDir: false}));
                pNative.window.setDragDropAllowFileTypes(JSON.stringify({fileTypes: ["*"]}));
                if (!options.noserver){
                    RunTask('initCore', _get_callback(function(info){
                        if (info.type == "type_initcoresuccess") {
                            var cb = _get_callback(function(obj){
                                if(obj.type == "type_addcalltaskqueue_success"){
                                    return RunTask('sendEvent' , cb, ["start", "calltask", obj.queueInfo.id])
                                }
                                if (obj.type == "type_calltask_start") {
                                    console.log('server start url:', ntv.serverUrl(), obj);
                                }
                            }, true);

                            var serverURL = pNative.path.appDataHomeDir() + '/server/www';

                            // 优先使用系统DataHome目录下面的服务器引擎文件
                            serverURL = pNative.path.pathIsExist(serverURL) ? serverURL : pNative.path.resource() + '/public/server/www';
                            serverURL = pNative.path.pathIsExist(serverURL) ? serverURL : pNative.path.resource() + '/public/www';
                            serverURL = pNative.path.pathIsExist(serverURL) ? serverURL : pNative.path.resource() + '/www';

                            if(false === pNative.path.pathIsExist(serverURL)){
                                console.error('not found www file');
                                return;
                            }

                            return RunTask('task', cb, [(new Date()).getTime(), [{
                                appPath:pNative.path.appPluginDirPath() + "/node",
                                command:[
                                    serverURL,
                                    ntv.serverPort().toString()
                                ],
                                mainThread:false
                            }]]);
                        }
                        console.error('init core fail!');
                    }), [true, []]);
                }
            }
        }
    };

    function RunTask(method, callbackName, args){
        pNative.window.execTask(JSON.stringify({
            useThread: true,
            passBack: callbackName,
            packageMode: 'bundle',
            taskToolPath: "/Plugins/extendLoader.bundle",
            bundleClassName: "LibCommonInterface",
            callMethod: method,
            arguments:args
        }));
    }

    ntv.socketUrl = function(_cb){
        return 'http://localhost:' + ntv.serverPort(_cb);
    };

    ntv.socketApi = function(socket, opts){
        var target= {},
            prefix= opts.prefix || ''
            ;

        jet.split('push remove clear play pause state pool', function(id, it){
            target[it] = function(){
                var args = arguments;
                [].unshift.call(args, prefix+it);
                socket.emit.apply(socket, args);
            };
        });

        jet.split('progress task state pool', function(id, it){
            var name = 'on'+jet.ucword(it);
            target[name] =  opts[name] || function(){}
            socket.on(prefix+it, function(){
                target[name] && target[name].apply(null, arguments);
            });
        });
        target.prefix = prefix;
        return target;
    };

    ntv.getUrlExt = function (val, _url){
        return (_url = String(val || '')
                .replace(/(\?.*)|(#.*)/,'')
                .match(/\.([a-zA-z0-9]+)$/i)
            ) ? _url[1] :'';
    };

    window.ntv = ntv;
    return ntv;
});
