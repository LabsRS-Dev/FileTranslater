(function(){
    function getNativeLang(_ntv, _lang){
        if (_ntv = (typeof maccocojs !== 'undefined') && (maccocojs)){
            _lang = _ntv.app.curAppleLanguage();
            if ("en fr de ja es it nl ko pt da fi sv ru pl tr ar th cs hu ca hr el ro sk uk id ms vi".split(' ').indexOf(_lang) == -1){
                _lang = {
                 'es-MX':'es',
                 'pt-PT':'pt',
                 "zh-Hans":'zh-CN',
                 "zh-Hant":'zh-TW',
                 "nb":'no',
                 "he":'iw',
               }[_lang]
            }
        }
        return _lang || 'en';
    }
    //app config
    var app  = {
        'bundle':'romany.bft',
        'name':'Batch File Translater',
    };
    jet.config({
        'app':app,
        'lang': localStorage[app.bundle+'.lang'] || getNativeLang()
    });
    // styles
    jet([
        '3rdparty/nprogress/nprogress.css',
        '3rdparty/bootstrap/css/bootstrap.css',
        '3rdparty/font-awesome/css/font-awesome.css',
        '3rdparty/bootstrap-tagsinput/bootstrap-tagsinput.css',
        '3rdparty/romany/base.css',
        'app/css/app.css',
    ]);
    // progress
    jet(['nprogress'], function(NProgress){
        var prev = jet.onHandle('jet.loading', function(percent, current, totle){
            if (totle) {
                NProgress.start();
            } else if (percent == 100) {
                NProgress.done();
            } else {
                NProgress.set(percent/100); 
            }
            prev(percent, current, totle);
        });
    });
    
    jet([
        'common',
        'vue',
        'store',
        'lang',
        'native',
        'bs',
        'util',
        'bootstrap',
        'bootstrap-tagsinput',
        'socket.io',
        '{!L}app/bfc/bfc_{lang}.json'
    ], function($, Vue, store, lang, ntv){
        
        var b$ = BS.b$;

        var defaultOptions = {
            dist:'',
            specSrcLanguage:'AUTO',
            override: true
        }
        
        function getOptions(){
            return jet.extend(true,{}, defaultOptions, store.get('options'));
        }
        
        function getLanguages(){
            return jet.extend(true,{}, lang.lists, store.get('languages'));
        }
        
        var codecs = ['txt','json','xml','csv','ini','plist','properties'];
        
        Vue.filter('codecIcon', function(codec){
            if (codec == 'properties')
                return 'prop';
            return codec;
        });
        
        function getCodecs(){
            return jet.extend(true,$.map(codecs, function(it){
                return {
                    codec:it,
                    extensions:''
                }
            }), store.get('codecs'));
        }
        
        function splitExtensions(str){
            return str.replace(/,{2,}/g,'')
                      .replace(/^,/,'')
                      .replace(/,$/,'')
                      .split(',');
        }
        
        function getExtensions(){
            return splitExtensions(codecs.join(',') +','+ (store.get('extensions')|| []).join(',') )
        }
        
        function beautyLang(a, b){
            //return a + (new Array(30 - a.length)).join('\u00a0')+ '|'+b;
            return a+'\u00a0\u00a0('+b+')';
        }
        
        var specSourceLangageLocals = $.objClone(lang.local);
        specSourceLangageLocals["AUTO"] = jet.tr("text.specSourceLangageLocals_AUTO") || "AUTO";
        
        Vue.filter('displayLang', function(abbr){
            return beautyLang(lang.lang[abbr], lang.local[abbr]);
        });
        
        Vue.filter('displaySourceLang', function(abbr){
            if(abbr in lang.lang){
                return beautyLang(lang.lang[abbr], lang.local[abbr]);
            }
            return specSourceLangageLocals[abbr];
        });
        
        Vue.filter('trLocal', function(abbr){
            return lang.local[abbr];
        });
        Vue.filter('trLang', function(abbr){
            return lang.lang[abbr];
        })
        
        var ivm = window.ivm = new Vue({
            el:'#app',
            data:{
                taskList:[],
                active:true,
                curLang: jet.config('lang'),
                locals: lang.local,
                options:getOptions(),
                languages:getLanguages(),
                srcLanguageLocals: specSourceLangageLocals,
                distLanguages:null,
                distLanguagesLength:0,
                codecs:getCodecs(),
                extensions:getExtensions(),
                errorList:[],
                currentTab:'',
                prefix:'/translate/',
                invert:false,
                updating:false,
            },
            methods:{
                selectDistDir:function(){
                    ntv.selectDir($.proxy(this.setDistDir, this),{},function(cb){
                        if($.RTYWebHelper.isMacOS()){
                            cb(null, '/Users/Ian/Documents/bfc');
                        }else if($.RTYWebHelper.isWinOS()){
                            cb(null, 'D:/TestResource/FileTranslater/dist');
                        }
                    })
                },
                setDistDir:function(err, path){
                    if (err) {
                        alertify.log(err.message);
                        return ;
                    }
                    if (path.length) {
                        if (path.match(/(\\|\/)$/)){
                            path = path.substr(0, path.length-1);
                        }
                    }
                    this.options.dist = path;
                },
                locationDistDir:function(){
                    ntv.revealInFinder(this.options.dist, function(){
                        console.log('locationDistDir:')
                    });
                },
                revealInFinder:function(dist){
                    ntv.revealInFinder(dist, function(){
                        console.log('revealInFinder', dist)
                    });
                },
                importFiles:function(){
                    ntv.importFile(ImportHandle.callback, {
                        types: this.extensions
                    }, function(cb){
                        [
                            'template.md',
                            'template.csv',
                            'template.ini',
                            'template.txt',
                            'template.json',
                            'template.xml',
                            'template.plist',
                            'lang/bfc.json',
                            'template.properties',
                            'lang/app.json',
                            ].forEach(function(it){
                                if($.RTYWebHelper.isMacOS()){
                                    cb(null, {
                                        filePath:'/Volumes/DiskShareUser/Users/ian/TestResource/FileTranslater_Test/'+it,
                                        fileName:it,
                                        extension: ntv.getUrlExt(it)
                                    });
                                }else if($.RTYWebHelper.isWinOS()){
                                    cb(null, {
                                        filePath:'D:/TestResource/FileTranslater/res/'+it,
                                        fileName:it,
                                        extension: ntv.getUrlExt(it)
                                    });
                                }

                        })
                    })
                },
                playAction:function(){
                    api.play();
                },
                pauseAction:function(){
                    api.pause();
                },
                removeTask:function(idx){
                    var it = this.findTask('id', idx, true);
                    if ( it ){
                        switch(it[1].status){
                            case 'import':
                            case 'done':
                                this.taskList.$remove(it[0]);
                                break;
                            case 'queue':
                            case 'active':
                                api.remove(it[1].tid);
                                break;
                            default:
                                break;
                        }
                    }
                },
                clearAction:function(){
                    for(var i= this.taskList.length; --i >=0;){
                        var it = this.taskList[i];
                        if (!(it.status == 'queue' || it.status == 'active')){
                            this.taskList.$remove(i);
                        }
                    }
                    api.clear();
                },
                checkInput:function(){
                    if (!this.options.dist || (false == ntv.isDirCanWriteable(this.options.dist))){
                        $.switchTab('general');
                        alert('Please select a  writeable destination folder.');
                        return false;
                    }
                    if (!this.distLanguagesLength){
                        $.switchTab('languages');
                        alert('Please select the target language.');
                        return false;
                    }
                    return true;
                },
                queueTaskAction:function(task){
                    if (task) {
                        api.push({
                            id: task.id,
                            codec: task.codec,
                            srcFile: task.srcFile,
                            srcFileName: task.srcFileName,
                            srcFileExtension: task.srcFileExtension,
                            distDir: this.options.dist,
                            override: this.options.override,
                        }, {
                            languages:this.distLanguages,
                            specLanugae: this.options.specSrcLanguage
                        });
                    }
                },
                queueTask:function(id){
                    if (!this.checkInput())
                        return
                    this.queueTaskAction(this.findTask('id', id));
                },
                queueTasks:function(repeat){
                    if (!this.checkInput())
                        return
                    for(var i=0, l= this.taskList.length; i< l; i++){
                        var task = this.taskList[i];
                        var push;
                        if (repeat == 'all') {
                            push = (task.status == 'done') ||(task.status == 'import');
                        } else {
                            push = task.status == (repeat ? 'done' : 'import') 
                        }
                        if (push) {
                            this.queueTaskAction(task);
                        }
                    }
                },
                onTask: function(task){
                    var it;
                    if (task.status == 'remove') {
                        var it = this.findTask('id', task.id, true);
                        if ( it ){
                            this.taskList.$remove(it[0]);
                        }
                    } else if (it = this.findTask('id', task.id)){
                        if (task.status == "queue") {
                            it.percent = 0;
                            it.error = null;
                            it.status = task.status;
                            it.tid = task.tid;
                        } else if (task.status == "active") {
                            it.status = task.status;
                        } else if (task.status == "done") {
                            if (task.error){
                                var error = task.error;
                                var err = ntv.ErrorItem(error.msg,
                                    error.detail,
                                    error.stack);
                                err.task = $.extend(true, {}, it);
                                this.errorList.push(err);
                                it.error = err;
                            }
                            it.status  = task.status;
                            it.distDir = task.distDir;
                        } else if (task.status == "progress") {
                            it.percent = parseInt(task.percent * 100);
                        }
                    }
                },
                onProgress:function(arg){
                    //console.log(arg);
                },
                onState : function(active){
                    this.active = active;
                },
                findTask: function(key, value, returnId){
                    for(var i=0, l= this.taskList.length; i< l; i++){
                        if (this.taskList[i][key] == value){
                            return returnId ? [i, this.taskList[i]] : this.taskList[i];
                        }
                    }
                },
                invertCheckLang:function(){
                    this.checkLang('invert');
                },
                checkAllLang:function(){
                    this.checkLang(true);
                },
                uncheckAllLang:function(){
                    this.checkLang(false);
                },
                checkLang:function(select){
                    this.updating = true;
                    if (select == 'invert'){
                        for (var x in this.languages){
                            this.languages[x].select = !this.languages[x].select;
                        }
                        this.invert = !this.invert;
                    } else {
                        for (var x in this.languages){
                            this.languages[x].select = select;
                        }
                    }
                    this.updating = false;
                    store.set('languages', this.languages);
                    this.calcLanguages();
                },
                calcLanguages:function(){
                    var langs = {}, len = 0;
                    for (var x in this.languages){
                        var it = this.languages[x];
                        if (it.select){
                            len++;
                            langs[it.abbr] = it.value || '';
                        }
                    }
                    this.distLanguagesLength = len;
                    this.distLanguages  = langs;
                },
                
                findCodec:function(extension){
                    if (codecs.indexOf(extension) >=0)
                        return extension;
                    extension +=',';
                    for(var x in this.codecs){
                        if ((this.codecs[x].extensions+',').indexOf(extension) >=0 ){
                            return this.codecs[x].codec;
                        }
                    }
                },
                calcExtensions:function(){
                    var str=',';
                    for(var x in this.codecs){
                        str += this.codecs[x].extensions+',';
                    }
                    this.extensions = splitExtensions(codecs.join(',') + str );
                },
                clearError:function(){
                    this.errorList = [];
                }
            },
            computed:{
            },
            compiled:function(){
                var that = this;
                
                $(document)
                    .on('switchTab', function(e, name){
                        that.currentTab = name
                    })
                    ;
                $('#app').show();
                $.switchTab('tasks');
                
                this.$watch('curLang', function(val){
                    store.setString('lang', val);
                    jet.config('lang', val);
                    if (!that.taskList.length){
                        location.reload();
                    }
                });
                this.$watch('options', function(val){
                    store.set('options', that.options);
                }, true);
                
                that.calcLanguages();
                this.$watch('languages', function(val){
                    if (that.updating)
                        return
                    store.set('languages', that.languages);
                    that.calcLanguages();
                }, true);
                
                this.$watch('codecs', function(val){
                    store.set('codecs', that.codecs);
                    that.calcExtensions();
                    store.set('extensions', that.extensions);
                }, true);
                $("[input-codec]").on('change', function(event) {
                    that.codecs[$(this).attr('codec-index')].extensions = $(this).val();
                }).tagsinput({
                    trimValue: true,
                    textTransform:'lowercase',
                });
            }
        });
        var taksId = 0;
        var ImportHandle = {
            callback:function(err, it){
                if (err) {
                    ivm.errorList.push(err);
                } else {
                    var task = {
                        srcFile: it.filePath,
                        srcFileName: it.fileName,
                        srcFileExtension: it.extension,
                        id:taksId++,
                        tid:null,
                        status:'import',
                        distDir:'',
                        error:null,
                        percent:0,
                    };
                    if (ivm.extensions.indexOf(task.srcFileExtension) >=0) {
                        task.codec = ivm.findCodec(task.srcFileExtension);
                        ivm.taskList.push(task);
                    } else {
                        ivm.errorList.push(ntv.ErrorItem('err.unknown_input_format', it.filePath));
                    }
                }
            }
        }
        var socket = window.socket= io(ntv.socketUrl());
        var api = window.api = ntv.socketApi(socket, ivm);
        socket.on('connect', function(){
            console.log('======server client connected=======');
            api.state(ivm.active);
        });
        
        ntv.init({
            dragdrop:ImportHandle
        });
    });
})();
