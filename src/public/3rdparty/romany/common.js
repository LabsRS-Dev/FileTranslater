def([
    '$',
    'vue',
    'store',
], function($, Vue, store){
    // init Vue
    Vue.filter('tr', function(str, module){
        return module ? jet.tr(module, str) : jet.tr(str);
    })
    Vue.filter('trAbbr', function(str){
        if (str == 'auto') {
            return jet.tr('auto', jet.config('lang'));
        } else if (str != '') {
            return jet.tr('lang', str);
        } else {
            return jet.tr('content', 'target_lang');
        }
    })
    function fileSize(len) {
        len = +len; // coerce to number
        if (len <= 1024) {
            return len.toFixed(0)  + " B";
        }
        len /= 1024;
        if (len <= 1024) {
            return len.toFixed(1) + " KB"
        }
        len /= 1024;
        if (len <= 1024) {
            return len.toFixed(2) + " MB";
        }
        len /= 1024;
        return len.toFixed(3) + " GB";
    }
    Vue.filter('filesize', function(val){
        return fileSize(val);
    });
    
    // init title
    $(function(){
        document.title = jet.config('app.name');
    });
    
    // components
    $.switchTab = function(name){
        var $tab = $('[tab-nav='+name+']'),
            $group = $tab.closest('[tab-group]'),
            group = $group.attr('tab-group'),
            $container = $('[tab-container='+group+']');
        $group.find('[tab-nav]').removeClass('active');
        $tab.addClass('active');
        
        $container.find('[tab-content]').removeClass('active');
        $container.find('[tab-content='+name+']').addClass('active');
        $tab.trigger('switchTab', name);
    }
    $(document)
        .on('click', '[tab-nav]', function(){
            $.switchTab($(this).attr('tab-nav'));
        })
        ;
    return $;
});