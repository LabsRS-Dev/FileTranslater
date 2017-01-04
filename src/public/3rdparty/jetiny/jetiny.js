(function(){

//!COMPATIBLE

/*
    json2.js
    2013-05-26
*/

/*jslint evil: true, regexp: true */

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : NULL;
        };
        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== UNDEFINED) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());

//!COMPATIBLE
//!COMPATIBLE
//-----------------------------------------------------------------------------compatible
(function(window){

function test_Set(o, method, func){
    if (func) 
        o[method] || (o[method] = func)
    else
        for(func in method) {
            o[func] || (o[func] = method[func])
        }
}

function test_setProto(o, method, func) {
    test_Set(o['prototype'], method, func);
}

// Array
test_setProto(Array, {
    "forEach" : function(fn,scope){
    	for (var i = 0, l = this.length >>> 0; i < l; i++){
    		if(i in this)
    			fn.call(scope, this[i], i, this);
    	}
    }
    ,"indexOf" : function(it,from){
    	for (var l = this.length >>> 0, i = (from < 0) ? Math.max(0, l + from) : from || 0; i < l; i++){
    		if (this[i] === it)
    			return i
    	}
    }
    ,"map" : function(fn,scope){
        for (var r = [],i = 0, l = this.length >>> 0; i < l; i++) {
            r.push(fn.call(scope, this[i], i, this))
        }
        return r
    }
})

//String
test_setProto(String, {
    "trim" : function(){
    	return (this || "").replace(/^\s+|\s+$/g, "")
    }
})

//window
test_Set(window, {
    // xhr
    "XMLHttpRequest" : function() {
        for(var _idx=0; _idx<3; _idx++){
            try {
                return new ActiveXObject(["Msxml2","Msxml3","Microsoft"][_idx]+".XMLHTTP")
            }catch(e){}
        }
    }
})

// console

})(window);

//!COMPATIBLE
//-----------------------------------------------------------------------------Global
var jet  = this.jet = moudle_use
  , root = jet['root'] = this
  , priv = jet['_p'] = {}
  
  , UNDEFINED = jet['UNDEFINED'] = void 0
  , TRUE   = jet['TRUE'] = !0
  , FALSE  = jet['FALSE']= !1
  , NULL   = jet['NULL']= null
  
  , document = root.document
  , location = root.location
  
  , s_object = "object"
  , s_prototype = 'prototype'
  , s_console = 'console'
  , s_undefined = 'undefined'
  , s_constructor = 'constructor'
  
  , ArrayProto = Array[s_prototype]
  , ObjProto = Object[s_prototype]
  
  , p_slice = ArrayProto.slice
  , toString = ObjProto.toString
  
  , isArray = Array.isArray || isType("Array")
  , isFunction = isType("Function")
  
  , _handles = priv._handles = {}
  , _configs = priv._configs ={
        baseUrl : location.href.match(/[^?#]*\//)[0],
        pkgs : {},
        maps : {},
        dataTypes:{
            css:"style",
            js:"script"
        },
        plugins : {}
    }
  ;
  
function noop() {
    
}

//-----------------------------------------------------------------------------Native Help
function isType(type) {
    return function(t) {
        return toString.call(t) === "[object " + type + "]";
    }
}

function isObject(val) {
    return val !== NULL && typeof val === s_object;
}

function isUndefined( val ) {
    return val === UNDEFINED ;
}

split("Boolean Number String Function RegExp Date File Blod", function(_, t){
    jet["is"+t] = isType(t);
});

function isPlainObject( obj ) {
	return obj && obj[s_constructor] === ObjProto[s_constructor];
}

function inArray(arr, it) {
    return arr && arr.indexOf(it) >=0;
}

function slice(args, startIndex) {
    return p_slice.call(args, startIndex || 0);
}

//-----------------------------------------------------------------------------Easy Method
function each(obj, iterator, context, _key, _length) {
    if (obj !== NULL) {
        _length = obj.length;
        if (_length === +_length ) {// array like
            for (_key = 0 ; _key < _length; _key++) {
                if (FALSE === iterator.call(context, _key, obj[_key])) {
                    return obj;
                }
            }
        } else { //object
            for (_key in obj) {
                if (obj.hasOwnProperty(_key)) {
                    if (FALSE ===iterator.call(context, _key, obj[_key])) {
                        return obj;
                    }
                }
            }
        }
    }
    return obj;
}

function extend() { // form jQuery & remove this
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = FALSE;
	if (jet.isBoolean(target)) {
		deep = target;
		target = arguments[ i ] || {};
		i++;
	}
	if ( !isObject(target) && !isFunction(target) ) {
		target = {};
	}
	for ( ; i < length; i++ ) {
		if ( (options = arguments[ i ]) != NULL ) {
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				if ( target !== copy ) {
    				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
    					if ( copyIsArray ) {
    						copyIsArray = FALSE;
    						clone = src && isArray(src) ? src : [];
    					} else {
    						clone = src && isPlainObject(src) ? src : {};
    					}
    					target[ name ] = extend( deep, clone, copy );
    				} else {
    					target[ name ] = copy;
    				}
				}
			}
		}
	}
	return target;
};

function split(arr, callback, chr, context) {
    return each(arr.split(chr || " "), callback , context);
}

//-----------------------------------------------------------------------------Functional Method
function ucword(s) {
    return s.replace(/[a-z]/,function(c){
        return c.toUpperCase()
    });
}

function randId() {
    return Math.round((new Date().getTime())+Math.random()*1000001);
}

//-----------------------------------------------------------------------------Callback
function onHandle(name, callback, _prev) {
    _prev = _handles[name];
    _handles[name] = callback;
    return _prev || noop;
}

function handle(name) {
    return _handles[name] && _handles[name].apply(NULL, jet.slice(arguments, 1));
}

//-----------------------------------------------------------------------------Debug & Exception

split("error warn debug log", function(_, t, _console){
    _console =  root[s_console]
    _ = _console && _console[t]
    onHandle('jet.' + t, function(args){
        _ && _.apply(_console, args);
    })
    jet[t] = function(){
        handle('jet.'+t, [arguments]);
    };
})

//-----------------------------------------------------------------------------Help function
function wrap( names, callback){
    each(names, function(_, name){
        names[_] = name in root ? root[name] : jet[name]
    });
    return callback.apply(root, names);
}
//-----------------------------------------------------------------------------Config read & write
function config(k, v, _argc) {
    if ( (_argc = arguments.length) == 1 ) {
    	if(isObject(k)){
    		_configs = extend(TRUE, _configs,k)
    	} else {
            var r = _configs;
            split(k, function(_, it){
                r = r && r[it];
            }, '.')
            return r;
        }
    } else if (_argc == 0){
    	return _configs
    } else if (isObject(v)) {
        _configs[k] = extend(TRUE, _configs[k] || {}, v)
    } else {
        _configs[k] = v
    }
}

//-----------------------------------------------------------------------------Export Base
extend(jet, {
  // Global
    "isArray" : isArray
  , "noop"    : noop
  
  // Native
  , "inArray" : inArray
  , "isUndefined" : isUndefined
  , "isObject" : isObject
  , "slice" : slice
  
  //Easy Method
  , "each" : each
  , "extend" : extend // form jQuery remove default this
  , "split" : split
  
  // Functional
  , "ucword" : ucword
  , "randId" : randId
  
  // Event
  , "onHandle" : onHandle
  , "handle" : handle
  
  // Config
  , "config" : config
  
  // Help
  , "wrap" : wrap
})

//!JET-URL

//jsuri https://code.google.com/r/jonhwendell-jsuri/

/*

//@ source                          https://username:password@www.test.com:8080/path/index.html?this=that&some=thing#content
^
//@ protocol                        https
(
    ?:
    (
        ?![^:@]+:[^:@\/]*@
    )
    (
        [^:\/?#.]+
    )
    :
)
?
//@ //
(
    ?:\/\/
)
?
//@ authority                       username:password@www.test.com
(
    //@ userInfo                    username:password
    (
        ?:
        (
            //@user                 username
            (
                [^:@]*
            )
            //@ password            password
            (
                ?::
                (
                    [^:@]*
                )
            )
            ?
        )
        ?@
    )
    ?
    //@ host                        www.test.com
    (
        [^:\/?#]*
    )
    //@ port                        8080
    (
        ?::
        (
            \d*
        )
    )
    ?
)
//@ relative                        /path/index.html?this=that&some=thing#content
(
    //@ path                        /path/index.html
    (
        //@ directory               /path/
        (
            \/
            (
                ?:[^?#]
                (
                    ?![^?#\/]*\.[^?#\/.]+
                    (
                        ?:[?#]|$
                    )
                )
            )
            *\/?
        )
        ?
        //@ file                    index.html
        (
            [^?#\/]*
        )
    )
    //@ query                       ?this=that&some=thing
    (
        ?:\?
        (
            [^#]*
        )
    )
    ?
    //@ anchor                       content
    (
        ?:#
        (
            .*
        )
    )
    ?
)



*/

// https://username:password@www.test.com:8080/path/index.html?this=that&some=thing#content
var REKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"]
    ,QUERY_RE = /(?:^|&)([^&=]*)=?([^&]*)/g
    ,URL_RE = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    ,_decode = root.decodeURIComponent
    ,_encode = root.encodeURIComponent
    ;

function isValid(s){
    return (s != null && s != '');
}

function buildQuery( prefix, obj, add, _name) {
    if ( isArray( obj ) ) {// Serialize array item.
        each( obj, function( i, v ) {
            if (/\[\]$/.test( prefix ) ) {// scalar item
                add( prefix, v );
            } else { // Item is non-scalar (array or object), encode its numeric index.
                buildQuery( prefix + "[" + ( isObject(v) ? i : "" ) + "]", v, add );
            }
        });
    } else if ( isObject( obj )) {
        for ( _name in obj ) {
            buildQuery( prefix + "[" + _name + "]", obj[ _name ], add );
        }
    } else {// scalar item
        add( prefix, obj );
    }
}

function addQuery(query, name, value) {
    name = name.replace(/\+/g, ' ');
    if (value == null) {// same as undefined
        delete query[name];
    } else {
        if (jet.isString(value))
            value = value.replace(/\+/g, ' ')
        query[name] = value;
    }
}

function parseUrl(str, _uri, _m, _i) {
       _uri = {};
    _m = URL_RE.exec(str || '');
    _i = REKeys.length;
    while (_i--) {
        _uri[REKeys[_i]] = _m[_i] || "";
    }
    return _uri;
}

function toUrl(uri, _str, _tmp) {
    uri || (uri = {})
    _str = '';
    if (isValid(uri.protocol)) {
        _str += uri.protocol;
        if (uri.protocol.indexOf(':') != uri.protocol.length - 1) {
            _str += ':';
        }
        _str += '//';
    } else if ((uri.source || '').indexOf('//') != -1 && isValid(uri.host)){
        _str += '//';
    }
    if (isValid(uri.userInfo) && isValid(uri.host)) {
        _str += uri.userInfo;
        if (uri.userInfo.indexOf('@') != uri.userInfo.length - 1){
            _str += '@';
        }
    }
    if (isValid(uri.host)) {
        _str += uri.host;
        if (isValid(uri.port))
            _str += ':' + uri.port;
    }
    if (isValid(uri.path)) {
        _str += uri.path;
    } else if (isValid(uri.host) && (isValid(uri.query) || isValid(uri.anchor))){
        _str += '/';
    }
    if (isValid(uri.query)) {
        if (isObject(uri.query)){
            if (_tmp = toQuery(uri.query)){
                _str += '?' + _tmp;
            }
        } else {
            if (uri.query.indexOf('?') != 0)
                _str += '?';
        }
        _str += uri.query;
    }
    if (isValid(uri.anchor)) {
        if (uri.anchor.indexOf('#') != 0)
            _str += '#';
        _str += uri.anchor;
    }
    return _str;
}

//parseQuery # http://stackoverflow.com/questions/1131630/the-param-inverse-function-in-javascript-jquery
function parseQuery(str, _querys) { // a[b]=1&a[c]=2&d[]=3&d[]=4&d[2][e]=5 <=> { a: { b: 1, c: 2 }, d: [ 3, 4, { e: 5 } ] }
    _querys = {};
    _decode(str || '')
        .replace(/\+/g, ' ')
        .replace(QUERY_RE, function ($0, _name, _value, _path, _acc, _nextAcc, _ref) {
            if (_name) {
                (_path = []).unshift(_name = _name.replace(/\[([^\]]*)\]/g, function($0, _k) {
                    _path.push(_k);
                    return "";
                }));
                _ref = _querys;
                for (var j=0; j<_path.length-1; j++) {
                    _acc = _path[j];
                    _nextAcc = _path[j+1];
                    if (!_ref[_acc]) {
                        _ref[_acc] = ((_nextAcc == "") || (/^[0-9]+$/.test(_nextAcc))) ? [] : {};
                    }
                    _ref = _ref[_acc];
                }
                ("" == (_acc = _path[_path.length-1])) ? _ref.push(_value) : _ref[_acc] = _value;
            }
        });
    return _querys;
}

//toQuery # http://api.jquery.com/jQuery.param
function toQuery(query, _str, _add) {
    query || (query = {})
    _add = function( key, value ) {
        // If value is a function, invoke it and return its value
        value = isFunction( value ) ? value() : ( value == null ? "" : value );
        _str[ _str.length ] = _encode( key ) + "=" + _encode( value );
    }
    each(query,function(id, it){
        buildQuery(id, it, _add)
    },_str = []);
    return _str.join( "&" ).replace(/%20/g,'+');
}

function replaceQuery(url, name, value, _uri, _query) {
    _query = parseQuery((_uri = parseUrl(url)).query);
    if (jet.isString(name)) {
        addQuery(_query, name, value)
    } else if(isObject(name)) {
        each(name, function(_name, value){
            addQuery(_query, _name, value)
        })
    }
    _uri.query = toQuery(_query);
    return toUrl(_uri);
}

function isCrossUrl(url, compare) {
    if (/^([\w-]+:)?\/\/([^\/]+)/.test(url)){
        return RegExp.$2 != (compare || location.host)
    }
}

extend(jet,{
    "isCrossUrl":isCrossUrl,
    "replaceQuery":replaceQuery,
    "toQuery":toQuery,
    "parseQuery":parseQuery,
    "toUrl":toUrl,
    "parseUrl":parseUrl
});

//!JET-URL
//!JET-AJAX
var pajax = priv.ajax = {}
    ,ajaxId = 0
    ,ajax_prefix = 'ajax_'
    ,s_json = 'json'
    ,s_xml = 'xml'
    ,s_ajax = 'ajax'
    ;
split('transport converter', function(_, _type, _handle, _filter, _find) {
    _handle = pajax[_type +'_h']  = {};
    _filter = pajax[_type + '_f']  = [];
    _find = function (name, _r){
        each(_filter, function(id, it){
            if (name = it[0]){
                _r = it[1]
                return FALSE;
            }
        })
        return _r;
    }
    //register
    jet[ 'ajax' + ucword(_type) ] = function(name, filter, handle) {
        if (handle) {
            handle.name = name;
            _handle[name] = handle;
        }
        _filter.unshift([name, filter]);
    };
    pajax[_type] = function(opts, _r){
        each(_filter, function(id, it){
            if (_r = it[1](opts, _find)){
                _r = _handle[_r];
                return FALSE;
            }
        })
        return _r;
    }
});

var _reg_transport = jet.ajaxTransport,
    _reg_converter = jet.ajaxConverter
    ;
// xhr
(function(_X_Requested_With, _xhrSuccessStatus, _accepts, _name,  _cors, _xhrSupported) {
    _cors = !!(_xhrSupported = createXhr()) && ( "withCredentials" in _xhrSupported );
    _xhrSupported = !!_xhrSupported;
    
    _reg_transport(
        _name,
        function(opts, _find){
            if ( _cors || _xhrSupported && !opts.crossDomain ) {
                return _name;
            }
        },
        function(opts, _callback, _xhr){
            return {
                name:_name
                ,send : function(complete, _headers, _xhrFields, _i, _cc) {
                    _headers = opts.headers || {};
                    _xhr = createXhr();
                    _xhr.id = opts.ajaxId ;
                    _xhr.open( opts.type, opts.url, opts.async, opts.username, opts.password );
                    for ( _i in (_xhrFields = opts.xhrFields || {}) ) {
                        _xhr[ _i ] = _xhrFields[ _i ];
                    }
                    _xhr.setRequestHeader('Accept', opts.mimeType || _accepts[opts.dataType] || '*/*')
                    if ( !opts.crossDomain && !_headers[_X_Requested_With] ) {
                        _headers[_X_Requested_With] = "XMLHttpRequest";
                    }
                    for ( _i in _headers ) {
                        _xhr.setRequestHeader( _i, _headers[ _i ] );
                    }
                    // callback
                    _cc = function( type ) {
                        return function() {
                            if ( _callback ) {
                                _callback = _xhr.onload = _xhr.onerror = NULL;
                                if ( type === "abort" ) {
                                    _xhr.abort();
                                } else if ( type === "error" ) {
                                    complete (
                                        _xhr.status,
                                        _xhr.statusText
                                    );
                                } else {
                                    complete (
                                        _xhrSuccessStatus[ _xhr.status ] || _xhr.status,
                                        _xhr.statusText,
                                        typeof _xhr.responseText === "string" ? _xhr.responseText: UNDEFINED
                                    );
                                }
                            }
                        };
                    };
                    // Listen to events
                    _xhr.onload  = _cc();
                    _xhr.onerror = _cc("error");
                    _callback    = _cc("abort");
                    try {
                        _xhr.send( opts.hasContent && opts.data || NULL );
                    } catch ( e ) {
                        if ( _callback ) {
                            throw e;
                        }
                    }
                }
                , abort : function() {
                    if (_callback) {
                        _callback();
                    }
                }
            }
        }
    );
    
    function createXhr(_idx){
        for(_idx=0; _idx<4; _idx++){
            try {
                return _idx ? new ActiveXObject([,"Msxml2","Msxml3","Microsoft"/*IE5-IE6*/][_idx]+".XMLHTTP"): new XMLHttpRequest
            }catch(e){}
        }
    }
    
})
    ("X-Requested-With", {
        // file protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE9
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    }, { // MIME types mapping
        "script"  : 'text/javascript, application/javascript, application/x-javascript',
        "style" : 'text/css',
        "json": 'application/json',
        "xml" : 'application/xml, text/xml',
        "html": 'text/html',
        "text": 'text/plain'
    }, 'xhr');

// node
(function(){
    var _header  = document.getElementsByTagName("head")[0] || document.documentElement
        ,isOldWebKit = Number(root.navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1")) < 536
        ;
    function pollCss(node, callback, timeout) {//@TODO timeout error
    	var sheet = node.sheet ,isLoaded ;
    	// for WebKit < 536
    	if (isOldWebKit) {
    		if (sheet)
    			isLoaded = TRUE
    	} else if (sheet) {// for Firefox < 9.0
    		try {
    			if (sheet.cssRules)
    				isLoaded = TRUE
    		} catch (ex) {
    			// The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
    			// to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
    			// in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
    			if (ex.name === "NS_ERROR_DOM_SECURITY_ERR")
    				isLoaded = TRUE
    		}
    	}
        if ((timeout -= 20) < 0) {
            callback({type:"error"})
            return;
        }
    	setTimeout(function() {
    		if (isLoaded) {// Place callback here to give time for style rendering
    			callback({type:1})
    		} else {
    			pollCss(node, callback, timeout)
    		}
    	}, 20)
    }
    split('style script', function(_, _type) {
        _reg_transport(
            _type,
            function(opts, _find){
                if (opts.type =='GET' && !!opts.async) {
                    if (opts.dataType == _type) {
                        return _type;
                    }
                }
            },
            function (opts, _callback) {
                return {
                     name:_type
                    ,send : function(complete, _node, _iScript, _cssPoll) {
                        _node = document.createElement( (_iScript = _type === 'script') ? _type : 'link');
                        _node[ _iScript ? 'src' : 'href' ] = opts.url;
                        _callback = function( evt ) {
                            _node.onload = _node.onerror = NULL;
                            _callback = NULL;
                            if ( evt ) {
                                complete( evt.type === "error" ? 404 : 200, evt.type );
                            }
                            _iScript && _node.parentNode.removeChild(_node);
                            _node = NULL;
                        }
                        extend(_node,{
                            async : TRUE
                           ,id : opts.ajaxId
                        }, _iScript || {
                            rel : 'stylesheet'
                        }, opts.charset && {
                            charset: opts.charset
                        });
                        
                        if ((!_iScript) && (isOldWebKit || !('onload' in _node)) ){ // for Old Safari < 536 and Old Firefox < 9.0
                            setTimeout(function() {
                    			pollCss(_node, function(r){
                                    _callback && _callback(r);
                                },3000)
                    		}, 1); // Begin after node insertion
                        } else {
                            _node.onload = _node.onerror = _callback;
                        }
                        ((_iScript && document.body) ||  _header).appendChild(_node);
                    }
                    ,abort : function() {
                        if ( _callback ) {
                            _callback();
                        }
                    }
                }
            }
        )
    });
})();

(function(_json, _xml, _jsonp, _jsonHandle, _xmlHandle, _jsonPId){
    if (_jsonHandle) {
        jet.parseJSON = function(text){
            try {
                return _jsonHandle.parse(text)
            }catch(e){
                jet.error("Invalid JSON: " + text )
            }
        }
    }
    if (_xmlHandle) {
        jet.parseXML = function(text){
            try {
                return (new _xmlHandle()).parseFromString(text, "text/xml" );
            }catch(e){
                jet.error("Invalid XML: " + text )
            }
        }
    }
    
    _reg_converter(_json, function(opts, _find){
        if (_jsonHandle && opts.dataType == _json){
            return _json;
        }
    }, jet.parseJSON)
    _reg_converter(_xml, function(opts, _find){
        if (_xmlHandle && opts.dataType == _xml){
            return _xml;
        }
    }, jet.parseXML)
    
    _reg_transport(_jsonp, function(opts, _find, _data, _jsonpName, _jsonc, _iString){
        if ((opts.dataType == _jsonp) && opts.jsonc) {
            opts._jsonp = TRUE;
            _data = opts.data || (opts.data = {});
            _jsonpName = opts.jsonp || 'callback';
            _jsonc = (_iString = jet.isString(opts.jsonc)) ? opts.jsonc : (ajax_prefix + _jsonPId++);
            _data[_jsonpName] = _jsonc;
            if (_jsonc != opts.jsonc) {//new jsonp
                opts._jsonc = _jsonc;
                var cbold = root[ _jsonc ];
                opts._complete = function() {
                    root[_jsonc] = cbold;
                }
                root[ _jsonc ] = _iString ? opts.jsonc : function() {
                    return opts.jsonc.apply(NULL, arguments);
                };
            }
            return opts.dataType = 'script';
        }
    })
})('json','xml','jsonp', root.JSON, root.DOMParser, randId());

jet.ajaxSettings = {
    crossDomain : FALSE,
    timeout: 0
}

jet.ajax = function (options, _opts, _transport, _done_flag, _timeoutTimer, _done) {
    _opts = pajax.request(options);
    _done = function ( errorCode, errorMsg, text, _converter, _recv) {
    	if (!_done_flag) {
    		_done_flag = TRUE;
    		_timeoutTimer && clearTimeout( _timeoutTimer );
    		if ( errorCode >= 200 && errorCode < 300 || errorCode === 304 ) {
                    errorCode = 0;
    		} else {
                    if (errorMsg instanceof Error) {
                        errorMsg.stack && jet.warn(errorMsg.stack);
                        errorMsg = errorMsg.message
                    }
                    errorMsg || (errorMsg = 'error')
    		}
            _recv = {};
            if (!errorCode){
                _recv.text = text;
                _recv.data = (text && (_converter = pajax.converter(_opts))) ?  _converter(text) : text;
            }
            _recv.error = errorCode;
            _recv.msg = errorMsg;
            pajax.trigger('complete', _opts, _recv);
    	}
    }
    
    if (_transport = pajax.transport(_opts)) {
        _transport = _transport(_opts);
        _opts.transport = _transport.name ;
    }
    if ( !_transport ) {
    	_done( -1, "No Transport" );
    } else if (FALSE === pajax.trigger('perpare', _opts)){
        _transport.abort();
        _done( -2, "abort" );
    } else {
        if (!_opts.hasContent) {
            if (isObject(_opts.data)) {
                _opts.url = replaceQuery(_opts.url, _opts.data);
            }
            delete _opts.data ;
        }
    	if ( _opts.async && _opts.timeout > 0 ) {
    		_timeoutTimer = setTimeout(function() {
                _transport.abort();
                _done( -3, "timeout" );
    		}, _opts.timeout );
    	}
    	try {
    		_transport.send(_done);
    	} catch ( e ) {
    		if (!_done_flag) {
    			_done( -4, e );
    		} else {
    			throw e;
    		}
    	}
    }
}

pajax.request = function (options, _idx, _opts) {
    _opts = extend(TRUE, {
        type: 'GET',
        url:'',
        context: NULL,
        async : TRUE
    },jet.ajaxSettings, options);
    _opts.type = (_opts.method || _opts.type).toUpperCase();
    _opts.hasContent = (_opts.type != 'GET');
    _opts.crossDomain || (_opts.crossDomain = isCrossUrl(_opts.url));
    _opts.dataType = (_opts.dataType || '*').toLowerCase();
    _opts.ajaxId || ( _opts.ajaxId = ajax_prefix + (++ajaxId));
    return _opts;
}

pajax.trigger = function(evtName, opts, data) {
    try {
        var _cb
            ,args = data ? [data, opts] : [opts]
            ;
        if (_cb = opts['_'+evtName]){ // inner hack
            if (FALSE === _cb.apply(opts.context, args)){
                return FALSE;
            }
        }
        if (_cb = opts[evtName]){
            if (FALSE === _cb.apply(opts.context, args)){
                return FALSE;
            }
        }
    }catch (e){
        jet.error(e);
    }
}

split('get post', function(_, _type) {
    jet[ _type ] = function(url, data, callback, dataType) {
    	return jet.ajax({
    		url: url,
    		type: _type,
    		dataType: dataType,
    		data: data,
    		complete: callback
    	});
    };
});

function ajax_wrap(method, _type){
    jet[ method + ucword(_type) ] = function( url, data, callback) {
        callback || (isFunction(data) && (data = (callback = data, NULL)));
        return jet[method](url, data, callback, _type);
    };
}

split('json xml', function(_, _type) {
    ajax_wrap('get', _type);
    ajax_wrap('post', _type);
})

split('script style html text', function(_, _type) {
    ajax_wrap('get', _type);
})
//!JET-AJAX
//!STORAGE

//---------------------------------------------// storage
var _JSON = root.JSON
    ,_localStorage = root.localStorage
    ,_storage_enabled = _JSON && _localStorage
    ;

function storage_enable(){
	return _storage_enabled && _configs.enableStorage
}

function setJSON(key, value){
	if (storage_enable()) {
		try {
			_localStorage.setItem(key, _JSON.stringify(value))
		} catch (e) {}
	}
}

function getJSON(key, _item){
	if (storage_enable()) {
		try {
			return (_item = _localStorage.getItem(key)) && _JSON.parse(_item);
		} catch (e) {}
	}
}

function storage_removeItem(key){
	storage_enable() && _localStorage.removeItem(key)
}

function getLinkCssText(id, _stylesheet, _text, _i, _sheet, _node, _rules, _ruleSize, _j, _s, _tmp) {
//获取link的css内容(TODO:失效的样式是不是被浏览器忽略了？)
	_stylesheet = document.styleSheets;
	_text = '';
	for (_i = 0; _i < _stylesheet.length; _i++) {
		_sheet = _stylesheet.item(_i);
		_node = _sheet.ownerNode || _sheet.owningElement;
		if (_node.id == id) {
			_rules = _sheet.rules || _sheet.cssRules;
			_ruleSize = _rules && _rules.length;
			for (_j = 0; _j < _ruleSize; _j++) {
				_s = _rules[_j].cssText;
				if(isUndefined(_s)){
					_tmp = _rules[_j].style.cssText;
					_s = _rules[_j].selectorText + '{' + _tmp + '}';
				}
				_text += _s;
			}
			break;
		}
	}
	return _text;
}

function cssReplaceUrl(data,url){ // 将css中的url替换为绝对路径
	return data.replace(/(url([ ]*)\()([ ]*)(\S+)([ ]*)(\))/g,function(a, bb, bx, c, dd, e, ff){
		var u = (dd || '').trim().replace(/\"/g,'').replace(/\'/g,'');
		if(!u.match(/^([a-zA-z]+)(:\/\/)/)){
			//css文件中的img使用相对路径，且未被浏览器解析成绝对路径(ie 或ajax获取)
			var path= url.match(/[^?#]*\//);
			u = (path ? path[0] : '') + u;
		}
		return bb+'"'+u+'"'+ff;
	});
}

function importStyle(cssText, _element) {
	try {
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(_element = document.createElement('style'))
		if (_element.styleSheet) {
			_element.styleSheet.cssText = cssText
		}else {
			_element.appendChild(document.createTextNode(cssText))
		}
        return TRUE;
	} catch (e) {
        return FALSE;
    }
}

var packageDatas = priv.packages =  {} //包缓存数据

function packageEqual(opkg,npkg){//
	return opkg[FLAG_URL] === npkg[FLAG_URL];
}

function getPackageData(id,mod){//获取包数据
	if(UNDEFINED !== packageDatas[id])
		return packageDatas[id] ;
	var got = FALSE
		,opkg = getJSON(id)
		;
	if(isObject(opkg)){
		if(!packageEqual(opkg,mod)){//compare url & ver
			storage_removeItem(id) //remove if version not match
			return packageDatas[id] = FALSE
		}
		if(!isUndefined(opkg[FLAG_DATA])){
			got = TRUE;
		}
		packageDatas[id] = got ? opkg : FALSE
	}
	return got;
}

function bridge_storage_fetch_css(nodeId,url,success,fail){
	var data = getLinkCssText(nodeId);
	if(data){
		success.apply(NULL,[cssReplaceUrl(data,url)])
	} else {
        fail()
    }
}

function bridge_storage_execute_css(mod){
	if(packageDatas[mod[FLAG_ID]] !== UNDEFINED){//执行导入
        return mod[FLAG_DATA] && importStyle(mod[FLAG_DATA]);
	}
}

function bridge_storage_mod_create(mod,id){
    if(storage_enable() && getPackageData(id,mod)){
    	var t = mod[FLAG_TYPE];
    	var spkg = packageDatas[id]
    	extend(TRUE, mod[FALG_DEPS], spkg[FALG_DEPS])
    	var sdata = {}
    		,_noerr = TRUE
    		,sourceDebug = _configs.enableSourceUrl
    		;
            sdata[FLAG_TYPE] = mod[FLAG_TYPE]
            sdata[FALG_DEPS] = mod[FALG_DEPS]
            sdata[FLAG_DATA] = spkg[FLAG_DATA]
    	if(t == 'js'){
    		var fu = '(function(){ return '+ spkg[FLAG_DATA] + '})()' + (sourceDebug ? '\r\n//# sourceURL='+mod[FLAG_URL] : '');
    		try{
    			sdata[FLAG_DATA] = eval(fu)
    		} catch (e) {
                jet.error('storage_eval_js',e,fu);
    			_noerr = FALSE
    		}
    	}else if(t == 'css'){
    		sourceDebug && (sdata[FLAG_DATA] += '\r\n/*# sourceURL='+mod[FLAG_URL]+'*/');
    	}
    	spkg[FLAG_DATA] = UNDEFINED; //?减少内存消耗
    	_noerr && module_save(id,sdata);
    }
}

function bridge_storage_mod_save(mod,id,data) {
    if(!storage_enable())
	    return
    if(!packageDatas[id] && data){
    	var t = {}
            t[FLAG_URL] = mod[FLAG_URL]
            t[FALG_DEPS] = mod[FALG_DEPS]
    	var type = mod[FLAG_TYPE];
    	if(type == 'js'){
    		t[FLAG_DATA] = isFunction(data) ? data.toString() : _JSON.stringify(data);
    	}else{
    		t[FLAG_DATA] = data;
    	}
    	setJSON(id,t)
    	packageDatas[id] = TRUE
    }
}

//!STORAGE


//---------------------------------------------// module
var cachedModules = priv.modules = {}
	,curModule
    ,gLoadingTotle = 0
    ,gLoadedCurrent = 0
    //module status
    ,STATUS_INIT = 0
	,STATUS_FETCHING = 1
	,STATUS_SAVED = 2
	,STATUS_LOADED = 3
	,STATUS_EXECUTING = 4
	,STATUS_EXECUTED = 5
    //inner flags
    ,FLAG_STATUS      = '#s' // status flag
    ,FLAG_FETCHING    = '#fi'// is fetching
    ,FLAG_FETCHED     = '#f' // is fetched
    ,FLAG_DIRECT_DEF  = '#d' // use def to export direct (uncacheable)
    ,FLAG_PLUGINS     = '#p' // module url plugin
    //module data (not setable)
    ,FLAG_DATA        = 'data'   // module data
    ,FALG_EXPORTS     = 'exports'// module exports
    ,FLAG_ID          = 'id'     // module id
    //module configs (standard)
    ,FLAG_URL         = 'url'    // module url
    ,FLAG_TYPE        = 'type'   // module type
    ,FALG_DEPS        = 'deps'   // module deps array
    ,FLAG_VER         = 'ver'    // module ver
    ,FLAG_CBN         = 'jsonpName'    // module jsonp callback name
    ,FLAG_CBD         = 'jsonpValue'    // module jsonp callback value is random or 'def'
    //module external flags
    ,FLAG_HAND_EXP    = 'factory'  // custom export function or string (property of window) (uncacheable)
    ,FLAG_DEF_IS_OPEN = 'open'     // def function can not wrap full module source (uncacheable)
	;

function getModule(id){
	var t = cachedModules[id];
	if(!t){
		t = cachedModules[id] = {};
        t[FLAG_ID] = id
        t[FALG_DEPS] = []
        t[FLAG_STATUS] = STATUS_INIT
        t[FLAG_PLUGINS] = []
		package_ModuleCreate(t);
	}
	return t;
}

function getModules(ids){
	var ret = [];
	ids = ids || [];
	for (var i = 0; i < ids.length; i++) {
		ret.push(getModule(ids[i]));
	}
	return ret;
}

function getUnloadedModule(ids) {
	var ret = [];
	ids = ids || [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		if (id && getModule(id)[FLAG_STATUS] < STATUS_LOADED) {
			ret.push(id);
		}
	}
	return ret
}

function getExport(id){
	var mod  = getModule(id);
	if (mod[FLAG_STATUS] == STATUS_EXECUTED) {
		return mod[FALG_EXPORTS];
	}
	if(mod[FLAG_STATUS] < STATUS_LOADED){
		throw 'module '+ mod.id + ' unloaded ';
	}
    mod[FLAG_STATUS] = STATUS_EXECUTING;
	if(!package_ModuleExecute(mod)){
    	var factory = mod[FLAG_DATA];
        var deps = getExports(mod[FALG_DEPS]);
    	mod[FALG_EXPORTS] = jet.isFunction(factory) ? factory.apply(NULL, deps) : factory;
    }
	mod[FLAG_STATUS] = STATUS_EXECUTED;
	mod[FLAG_DATA] = UNDEFINED; //释放这部分内存
	return mod[FALG_EXPORTS];
}

function getExports(ids){//获取导出数据
	var items = isArray(ids) ? ids.slice() : [ids]
	var exports = [];
	for (var i = 0; i < items.length; i++) {
		exports[i] = getExport(items[i]);
	}
	return exports;
}

function module_save(id,data){//保存模型数据
	var mod = getModule(id);
	extend(mod, data);
	mod[FLAG_STATUS] = STATUS_SAVED;
	package_ModuleSave(mod);
    package_ModuleDefine(mod,id);
}

function module_define(id,deps,factory){//定义
	var argc = arguments.length
	if (argc === 1) {
		factory = id
		id = UNDEFINED
		deps = []
	}else if(argc === 2){
		factory = deps
		if(isArray(id)){
			deps = id
			id = UNDEFINED
		}else{
			deps = []
		}
	}
	var mod = {}
    mod[FALG_DEPS] = deps;
    mod[FLAG_DATA] = factory;
    if(id){
        if(!cachedModules[id]){
    		var it = getModule(id)
    		it[FLAG_DIRECT_DEF] = TRUE
    	}
        module_save(id,mod);
    }
	curModule = id ? UNDEFINED : mod;
}

function module_need_order(mod, _r) {
    each(getUnloadedModule(mod[FALG_DEPS]), function(id, it){
        if (getModule(it)[FLAG_HAND_EXP]){
            _r = TRUE;
            return FALSE;
        }
    }, _r = FALSE);
    return _r;
}

function module_load(ids,callback){//加载模型
	var unloadedModules = getUnloadedModule(ids)
	if (unloadedModules.length === 0) {
		callback()
        return
	}
	var remain = unloadedModules.length
    if (remain) {
        gLoadingTotle += remain;
        gLoadedCurrent+= remain;
        module_loading();
    }
	for (var i = 0, len = remain; i < len; i++) {
		(function(id) {
			var mod = getModule(id);
            if (module_need_order(mod)) {
                loadWaitings(function(){
                    module_fetch(id, loadWaitings)
                })
            } else {
                if(mod[FLAG_STATUS] < STATUS_SAVED){
    				module_fetch(id, loadWaitings)
    			}else if(mod[FLAG_STATUS] < STATUS_LOADED){
    				loadWaitings(done)
    			}
            }
			function loadWaitings(cb) {
				cb || (cb = done);
				var waitings = getUnloadedModule(mod[FALG_DEPS]);
				if (waitings.length === 0) {
					cb();
				} else {
					module_load(waitings, cb);
				}
			}
			function done() {
				if (mod[FLAG_STATUS] < STATUS_LOADED) {
					mod[FLAG_STATUS] = STATUS_LOADED;
				}
                --remain;
                if (!(--gLoadedCurrent)){
                    gLoadingTotle = gLoadedCurrent = 0;
                }
                module_loading();
				if (remain === 0) {
					callback();
				}
			}
			
		})(unloadedModules[i]);
	}
}

function module_loading(){
    handle('jet.loading', 
                    gLoadingTotle ? Math.floor(100*(gLoadingTotle-gLoadedCurrent)/gLoadingTotle) : 100,
                    gLoadedCurrent, gLoadingTotle);
}

function module_fetch(id,callback){//获取
	var it = cachedModules[id]
	if (it[FLAG_FETCHED] || it[FLAG_STATUS] >= STATUS_SAVED) {
		callback();
	}else if (it[FLAG_FETCHING]) {
		it._cbs.push(callback);
	}else {
        it[FLAG_STATUS] = STATUS_FETCHING;
		it[FLAG_FETCHING] = TRUE;
		it._cbs = []
		it._cbs.push(callback);
        var cb = function(success){
            return function(datas){
    			var item = cachedModules[id]
    			item[FLAG_FETCHED] = TRUE;
    			delete item[FLAG_FETCHING];
    			if(arguments.length === 1){// sync (how to define)
                    var _data = {}
                    _data[FLAG_DATA] = datas;
    				module_save(id, _data);
    			}else if(curModule){//unname module
    				module_save(id, curModule);
    				curModule = UNDEFINED;
    			}else if(item[FLAG_STATUS] < STATUS_SAVED){//module without define function (unsave)
    				module_define(id, [], UNDEFINED)
    			}else {// module call def function
                    
                }
    			var fn, fns = item._cbs;
    			delete item._cbs;
    			while ((fn = fns.shift())) fn();
    		}
        }
		package_ModuleFetch(it,cb(TRUE),cb(FALSE));
	}
}

function moudle_use(ids,callback) {
    var exports ,single
    isArray(ids) || (ids = (single = true,[ids]) )
    module_load( ids , function() {
    	exports = getExports(ids)
    	callback && callback.apply(NULL,exports)
    })
    if (exports) {
        return single ? exports[0] : exports;
    }
}

//global
extend(root,{
    "def":module_define
});
//---------------------------------------------// package
function getPackage(id){//获取包
	return _configs.pkgs[id];
}

function getUrlExt(val, _url){//获取url的后缀类型 js/css/...
    return (_url = String(val || '')
            .replace(/(\?.*)|(#.*)/,'')    //删除参数和锚点
            .match(/\.([a-zA-z0-9]+)$/i)   //匹配url后缀
           ) && _url[1]
}

function extractUrl(url,mod){
	return url.replace(/{!(\w+)(:{0,1}([\w\&\=]{0,}))}/g,function(_plugin,key,u1,value,_cb){
        if(_plugin = _configs.plugins[key]){
            var _opts = {}
            value.length && value.split('&').forEach(function(r){
                r = r.split('=')
                if (r.length === 2)
                    _opts[r[0]] = r[1]
            })
            mod[key] = _opts // add plugin option to module
            if (_cb = _plugin['init'])
                 _cb(mod,_opts)
            mod[FLAG_PLUGINS].push(key)
            if(_cb = _plugin['map'])
                return _cb(mod,_opts) || ''
        }
        return '';
    });
}

function resolveUrl(url, mod){
	return url.replace(/{([\w-]{1,})}/g, function(map, text){
        map = _configs.maps[text]
        return jet.isFunction(map) ? map(mod,text) : map || '';
    });
}

function Module_Init(mod){
	var url = extractUrl(mod[FLAG_URL],mod)
        ,type = mod[FLAG_TYPE] || getUrlExt(url) || 'js'
        ;
    url = resolveUrl(url);
    if(!url.match(/(^[\w]+:\/\/)|(^\/\/)/)){// http://* or //*
		url = _configs.baseUrl + url   // set to full url
	}
    (type == 'js' ) && (!getUrlExt(url)) && (url += '.js') //add .js suffix default
    mod[FLAG_VER] && ( url = replaceQuery(url,'v',mod[FLAG_VER]))
    
    mod[FLAG_URL]  = url;
    mod[FLAG_TYPE] = type;
}

function package_ModuleCreate(mod){//加载模块
	var id = mod[FLAG_ID];
    var pkg = getPackage(id);
    extend(TRUE, mod, pkg)
    mod[FLAG_URL] || (mod[FLAG_URL] = mod[FLAG_ID])
    Module_Init(mod)
//!STORAGE
    bridge_storage_mod_create(mod,id)
//!STORAGE
}

function package_ModuleFetch(mod, success, error){//获取模块
    var dataType = _configs.dataTypes[mod[FLAG_TYPE]] || mod[FLAG_TYPE];
    var opts = {
        url : mod[FLAG_URL],
        dataType : dataType, // js css 
        jsonp : mod[FLAG_CBN] ,
        jsonc : mod[FLAG_CBD] ,
        complete : function(rep, req) {
            if (rep.error) {
                error();
            } else {
//!STORAGE
    			if(req.dataType == 'style'){
                    return bridge_storage_fetch_css(req.ajaxId, mod[FLAG_URL], success, error)
    			}
//!STORAGE
                rep.data ? success(rep.data) : success();
            }
        }
    }
    if (dataType === 'jsonp'){ // fill default jsonp callback=def
        opts.jsonc || (opts.jsonc = 'def');
    }
    jet.ajax(opts);
}

function package_ModuleDefine(mod,id){//定义模块
	var pkg = getPackage(id)
	if(pkg){
		extend(TRUE, mod[FALG_DEPS], pkg[FALG_DEPS])
	}
    //@TODO 未使用def定义的模块在这里可以定义依赖项
}

function package_ModuleSave(mod){//保存模块
	var id = mod[FLAG_ID]
		,data = mod[FLAG_DATA]
		,_export = mod[FLAG_HAND_EXP]
	;
	if(mod[FLAG_DIRECT_DEF]){//是直接def的模块,不保存源码
		return
	}else if(_export){//手动导出
		if(data === UNDEFINED){// first time
			mod[FLAG_DATA] = jet.isFunction(_export) ? _export : eval('(function(){ return function(){ return '+_export+'} })()');
		}
		return
	}else if(mod[FLAG_DEF_IS_OPEN]){//define不支持全包
		return
	}
//!STORAGE
    bridge_storage_mod_save(mod,id,data)
//!STORAGE
}

function package_ModuleExecute(mod){//执行模块
//!STORAGE
	if(mod[FLAG_TYPE] === 'css'){//css
        if (bridge_storage_execute_css(mod))
            return TRUE;
	}
//!STORAGE
    var pls = mod[FLAG_PLUGINS]
        ,rs = UNDEFINED
    pls.forEach(function(pname,exc){
        if(exc = _configs.plugins[pname]['exec'] ){
            exc(mod) && (rs = TRUE)
            delete mod[pname]; // delete plugin options
        }
    })
    return rs;
}

config("plugins" , {
    'P' : {
        'init':function(mod,opts){
            extend(TRUE, mod, opts)
        }
    }
});

//!LANG
//-----------------------------------------------------------------------------lang
jet.wrap(['JSON','TRUE','FALSE','NULL'], function(JSON, TRUE, FALSE, NULL){
    var langDatas = {}
        ,unshift = [].unshift
        ;
    function tr(m, str) {
        var r = str ? langDatas[m] : langDatas;
        str = str || m;
        jet.split(str, function(_, it){
            r = r && r[it];
        }, '.')
        if (jet.isUndefined(r)){
            r = '['+(str==m ? str : m+'.'+str)+']' ;
        }
        return r;
    }
    function extend(){
        var args = arguments;
        unshift.call(args, TRUE);
        unshift.call(args, langDatas);
        jet.extend.apply(NULL ,args);
    }
    jet.tr = tr;
    jet.config({
        "maps":{
            "lang":function(){
                return jet.config('lang')
            }
        }
        ,"lang":'en'
        ,"plugins":{
            "L":{
                "exec":function(mod){ // lang
                    var data = mod['data'];
                    if(jet.isString(data)){
                        try{
                            data = JSON.parse(data)
                        } catch (e) {
                            jet.error('lang_parse',e,data);
                            data = FALSE;
                        }
                    }
                    extend(data)
                    mod['exports'] = data || {}
                    return TRUE;
                }
            }
        }
    })
    return tr;
})


//!LANG
//!TMPL
//-----------------------------------------------------------------------------tmpl
jet.wrap(['TRUE'], function(TRUE){
    
    var tmplVars = "print=function(s,e){_s+=e&&(s||'')||_e(s);},"
    	,tmplEncodeReg = /[<>&"'\x00]/g
    	,tmplEncodeMap = {
    		"<"   : "&lt;",
    		">"   : "&gt;",
    		"&"   : "&amp;",
    		"\""  : "&quot;",
    		"'"   : "&#39;"
    	}
    	;
    function tmpl_replace(str){
    	return str.replace(/([\s'\\])(?![^%]*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,function (s, p1, p2, p3, p4, p5) {
    		if (p1) { // whitespace, quote and backspace in interpolation context
    			return {
    				"\n": "\\n",
    				"\r": "\\r",
    				"\t": "\\t",
    				" " : " "
    			}[s] || "\\" + s;
    		}
    		if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
    			if (p2 === "=") {
    				return "'\r\n+_e(" + p3 + ")+'";
    			}
    			return "'\r\n+(" + p3 + ")+'";
    		}
    		if (p4) { // evaluation start tag: {%
    			return "';\r\n";
    		}
    		if (p5) { // evaluation end tag: %}
    			return "\r\n_s+='";
    		}
    	})
    }

    function tmpl_slash(s) {
    	return String(s).replace(tmplEncodeReg,function (c) {
    			return tmplEncodeMap[c] || "";
    		}
    	);
    }

    function jet_tmpl(str, url) {
    	try {
            var sourceDebug = url && jet.config('enableSourceUrl')
    		    ,f = 'var '+ tmplVars + "\r\n_s='';with(o){_s='"
    			+ tmpl_replace(str || '',sourceDebug)
    			+ "';}\r\nreturn _s;"
                + (sourceDebug ? ('\r\n//# sourceURL='+url) : '')
                ;
            f = new Function('o,_e', f)
    		return function (data) {
                try {
                    return f(data, tmpl_slash);
                } catch (e) {
                    jet.error('tmpl', e, sourceDebug ? url : f.toString())
                }
    		}
    	} catch (e) {
    		jet.error('tmpl', e, str, url)
    	}
    }

    jet_tmpl.inject = function(s){
    	tmplVars += s
    }

    jet.config({
        'plugins':{
            'T':{
                'exec':function(mod){
                    mod['exports'] = jet_tmpl(mod['data'], mod['url']);
                    return TRUE;
                }
            }
        }
    })
    jet.tmpl  =jet_tmpl;
});

//!TMPL
//!ROUTER
//-----------------------------------------------------------------------------router

jet.wrap(['NULL'], function(NULL){
    // from angularjs, it's simple & enough
    var RE_REPLACE = /([().])/g,
        RE_REPLACE2  = /([\/$\*])/g,
        RE_MATCH   = /(\/)?:(\w+)([\?\*])?/g
        ;
    function router_create (path, opts, _keys, _path) {
        opts || (opts = {})
        _keys = []
        if (_path = path
          .replace(RE_REPLACE, '\\$1')
          .replace(RE_MATCH, function(_, slash, key, option){
            var optional = option === '?' ? option : NULL;
            var star = option === '*' ? option : NULL;
            _keys.push({ name: key, optional: !!optional });
            slash = slash || '';
            return ''
              + (optional ? '' : slash)
              + '(?:'
              + (optional ? slash : '')
              + (star && '(.+?)' || '([^/]+)')
              + (optional || '')
              + ')'
              + (optional || '');
          })
          .replace(RE_REPLACE2, '\\$1')
        ) {
            var cr = path[path.length-1];
            if (cr != '/' && cr != '*'){
                (_path += '(?:\\/)?') // in case no / at end
            }
        }
        var _regexp = new RegExp( '^' + _path + '$' , opts.caseInsensitive ? 'i' : ''),
            rt = {
                path   : path ,          // origin path
                regexp : _regexp,        // parse url
                url    : function(args){ // create Url (return false when miss required argument)
                    args || (args = {})
                    return path.replace(RE_MATCH, function(_, slash, key, option){
                          if (option === '?'){
                              return (args[key] && slash || '') + (args[key] || '');
                          } else {
                              return (slash || '') + (args[key] || '');
                          }
                    });
                },
                match  : function(uri, _matchs){  // match url
                    if (_matchs = _regexp.exec(uri)){
                        var args = {}
                        jet.each(jet.slice(_matchs, 1), function(id ,it){
                            args[_keys[id].name] = it || "";
                        })
                        return args;
                    }
                },
                keys   : _keys          // keys
            }
        return rt;
    }
    
    var routers = router.datas = {}
    
    function router(items, opts, _id){
        jet.each(items, function(path, it){
            _id  = jet.isString(it) ? it : it.id;
            routers[_id] = jet.extend(router_create(path, it.opts || opts), {
                id:_id,
                data:it
            })
        })
        return router;
    }
    
    return jet.router =  jet.extend(router,{
        "find" : function(id){
            return routers[id]
        },
        "match" : function(path, _id, _args){
            for (_id in routers) {
                if (_args = routers[_id].match(path)){
                    return {
                        id: _id,
                        args : _args,
                        router : routers[_id]
                    };
                }
            }
        },
        "url" : function(id, args){ // return undefined(no router) || (return false when miss required argument)
            return routers[id] && routers[id].url(args);
        }
        ,"create" : router_create
    });
    
});

//!ROUTER
//!NAV
//-----------------------------------------------------------------------------nav
jet.wrap(['window', 'history', 'location', 'document', 'TRUE', 'FALSE'], function(window, history, location, document, TRUE, FALSE) {
    var is_active   //是否已经启动
        ,is_hash    //使用hash事件
        ,is_push    //使用history事件
        ,is_redirect//支持push到hash的重定向
        ,is_file = location.origin ==='file://'
        ,s_hash = 'hash'
        ,s_push = 'push'
        ,cur_fragment //当前地址
        ,root_prefix  //地址前缀
        ,org_uri = jet.parseUrl(location.href)
        ;
    org_uri.query = '';
    
    function nav_reload(){
        nav(cur_fragment, TRUE)
    }
    
    function nav_get_fragment() {
        return nav_parse_url(location.href);
    }
    
    function nav_handle_event(e) {
        var fragment = nav_get_fragment();
        if (fragment === cur_fragment)
            return FALSE;
        if(is_push){
            cur_fragment = fragment;
            history.replaceState({}, document.title, nav_build_url(fragment));
            nav_notify(fragment)
        }else if(is_hash){
            cur_fragment = fragment;
            nav_notify(fragment)
        }
    }
    
    function nav(fragment, focus, _equal) {
    	if (fragment && (focus || !(_equal = cur_fragment === fragment))) {
    		if (is_push) {
    			cur_fragment = fragment;
    			history[_equal ? 'replaceState' : 'pushState']({}, document.title, nav_build_url(fragment) );
    			nav_notify(fragment)
    		} else if(is_hash) {
    			if (is_redirect && (nav_path_slash(location.pathname) != root_prefix)){ //reload from normal url to hash url
                    return location.replace(root_prefix + nav_build_url(fragment));
                }
                cur_fragment = fragment;
                location.hash = nav_build_url(fragment);
                nav_notify(fragment)
    		} else {
    			cur_fragment = fragment;
    			nav_notify(fragment)
    		}
    	}
    }
    
    function $on(element, eventName, callback) {
        (element.addEventListener && element.addEventListener(eventName, callback, FALSE))
        ||
        (element.attachEvent && element.attachEvent("on" + eventName, callback))
    }
    
    function nav_path_slash(s, _r){
        _r = ('/' + (s || '') + '/').replace(/\/+/g, '/');
        return _r.substr(0, _r.length -1)
    }
    
    function nav_start(opts){
        opts || (opts = {})
        var event  = opts.event;
        if (is_file) { // file protocol can not use history pushState
            is_push = FALSE;
        } else {
            if (event === s_push){
                (is_push = !!(history && history.pushState)) || ( event = s_hash) // push down to hash
            }
            is_redirect = opts.redirect;
        }
        is_hash = ('onhashchange' in window) && (event === s_hash) ;
        root_prefix = nav_path_slash(opts.prefix || ''); // prefix should not be end with /
        if (is_push) {
            $on(window, 'popstate', nav_handle_event)
        } else if (is_hash) {
            $on(window, 'hashchange', nav_handle_event)
        }
        is_active = 1
        nav(nav_get_fragment());
    }
    
    function nav_notify(fragment, _url){
        _url = jet.parseUrl(fragment);
        jet.handle('jet.nav',{
            fragment: fragment,
            path  : _url.path,
            query : _url.query && jet.parseQuery(_url.query),
            anchor: _url.anchor
        });
    }
    
    function nav_build_url(fragment){
        return (is_push ? root_prefix : '#!') + fragment
    }
    
    function startWith(str, tar) {
        return str.substr(0, tar.length) == tar
    }
    
    // localhost/path/dir/file*
    // /path/dir/file*
    // #!/path/dir/file*
    
    function nav_parse_url(url, _url, _loc, _ignore, _r){
        //! check cross domain
        _url = jet.parseUrl(url);
        _loc = jet.parseUrl(location.href);
        if (_url.host) {
            _url.protocol || (_url.protocol = _loc.protocol) // in case protocol is empty
            _url.port == "80" || (_url.port = "")            // in case prot 80 is empty
            jet.split("protocol host port", function(it){
                if ((_url[it] != _loc[it])) {
                    _ignore = true
                }
            })
        }
        
        //! check prefix
        if (!_ignore) {
            if (startWith(_url.anchor, '!/')) {//is vaild hash url (#!/)
                _url = jet.parseUrl(_url.anchor.substr(1));
            } else if (_url.path == ""){ // empty url change to /
                _url.path = '/'
            } else if(is_redirect || is_push){// hash support redirect | push
                if (startWith(_url.path, root_prefix)){ // cut abs url
                    _url.path = _url.path.substr(root_prefix.length) || '/';
                } else {
                    _ignore = TRUE;
                }
            } else if  (_loc.path == _url.path){// hash path is empty or equal to location.filename value /
                _url.path = '/'
            } else {
                _ignore = TRUE;
            }
        }
        
        //return full (path, query, anchor)
        return !_ignore && jet.toUrl({
            path  : _url.path,
            query : _url.query,
            anchor: _url.anchor
        });
    }
    
    return jet.nav = jet.extend(nav, {
        //action
        "start" :nav_start,
        "reload":nav_reload,
        //status
        "isActive": function(){
            return !!is_active;
        },
        "fragment": function(){
            return cur_fragment;
        },
        //parse url
        "parse":nav_parse_url,
        //make url
        "url": function(fragment, type, _path, _anchor) {
            if (is_redirect || is_push || type === s_push) {
                _path = root_prefix + fragment
                _anchor = '';
            } else {
                _path = location.pathname
                _anchor = '!'+fragment
            }
            return jet.toUrl(jet.extend(org_uri,{path:_path, anchor:_anchor}));
            //return ((is_redirect || is_push || type == s_push) ? root_prefix : (location.pathname + '#!') ) + fragment
        }
    })
})
//!NAV

//!BOOTSTRAP

//-----------------------------------------------------------------------------BOOTSTRAP
jet.wrap(['nav', 'router'], function(nav, router) {
    
    jet.extend(jet, {
        'bootstrap' : function(opts) {
            router(opts.routers);
            
            jet.handle('jet.start', opts);
            
            var prev = jet.onHandle('jet.nav', function(entry){
                var r = router.match(entry.path);
                if (r) {
                    entry.args = r.args;
                    entry.id = r.id;
                }
                jet.handle('jet.route', entry);
                prev(entry);
            })
            
            nav.start(opts.nav)
        }
    })
    
})

//!BOOTSTRAP
//!TINY
//-----------------------------------------------------------------------------jquery simple view render
jet.wrap(['window', 'document', 'TRUE', 'NULL'], function(window, document, TRUE, NULL){
    
    function query(selector){
        return document.querySelector(selector)
    }
    
    function hasClass(obj, cls) {  
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
    }  
    
    function addClass(obj, c) {
        jet.split(c || '', function (_, cls){
           if (!hasClass(obj, cls))
             obj.className += " " + cls;  
        })
    }  
    
    function removeClass(obj, c) {
        jet.split(c || '', function (_, cls){
           if (hasClass(obj, cls)) {  
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
                obj.className = obj.className.replace(reg, ' ');  
            }
        })
    } 
    
    function newElement(text){
        var div = document.createElement("div");
        div.innerHTML = text
        return div.firstChild;
    } 
    
    var settings = {
            // view options
            container:'.view-container',
            template:"<div class='view' />",
            active:'view-active',
            classes:'view-item'
        }
        ,jet_start = jet.onHandle('jet.start', function(opts){
            settings = jet.extend(TRUE, settings, opts);
            var jet_route = jet.onHandle('jet.route', function(entry){
                if (entry.id) {
                    // loading ?
                    jet(entry.id.split('|')[0], function(view){
                        if (view && view.render) {
                            view.render(entry, function(){
                                tiny.render(view);
                            })
                        } else {
                            tiny.miss(entry);
                        }
                    })
                } else {
                    tiny.miss(entry);
                }
                jet_route(entry);
            })
            jet_start(opts); 
        })
        ,pre = NULL
        ,_root = NULL
        ,tiny = {
            miss:function(entry){
                jet.error('miss ', entry);
            }
            ,el:function(){
                return _root || (_root = query(settings.container));
            }
            ,render: function(cur){
            	if(pre){
                    if (pre === cur) {
                        cur.enter(TRUE);
                        return ;
                    }
        			removeClass(pre.el(), settings.active);
                    pre.leave();
            	}
                addClass(cur.el(), settings.active);
                cur.enter();
                
                pre = cur;
            }
            ,view: function(opts){
                var tar = {
                    classes: settings.classes // classes name
                };
                return jet.extend(tar,{
                    render: function(entry, done){
                        done();
                    }
                    ,enter: function(re){}
                    ,leave: function(){}
                    ,el:function(){
                        return tar._el || (function(){
                			var _el = tar._el = newElement(settings.template);
                            addClass(_el, tar.classes);
                            tiny.el().appendChild(_el);
                			return _el;
                		})();
                    }
                }, opts);
            }
        }
        ;
    return window['tiny'] = tiny; //export to window
})
//!TINY
})()