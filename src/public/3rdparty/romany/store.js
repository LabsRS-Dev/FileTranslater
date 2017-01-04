def(function(){
    var bundle = jet.config('app.bundle')+'.'
        ,_localStorage = localStorage
        ,_JSON = JSON
        ;
    return {
        get:function(key, _item){
        	return (_item = _localStorage.getItem(bundle+key)) && _JSON.parse(_item);
        },
        set:function(key, value){
        	_localStorage.setItem(bundle+key, _JSON.stringify(value))
        },
        getString:function(key, _item){
        	return (_item = _localStorage.getItem(bundle+key));
        },
        setString:function(key, value){
        	_localStorage.setItem(bundle+key, value)
        },
        remove: function(key){
            _localStorage.removeItem(bundle+key)
        }
    }
})