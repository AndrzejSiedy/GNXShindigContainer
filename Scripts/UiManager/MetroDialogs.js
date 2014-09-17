$.ConfirmationDialog = function (config) {

    var t = '<div class="gnx-center">{message}</div>' +
            '<div class="gnx-bottom">' +
                '<button class="info CANCEL pull-right">Cancel</button>' +
                '<button class="primary OK pull-right">&#160;&#160;Ok&#160;&#160;&#160;</button>' +
            '</div>';

    var html = t
            .replace("{message}", config.message)
            .replace("null", '');

    var defaultConfig = {
        shadow: true,
        overlay: true,
        flat: true,
        title: 'title',
        draggable: true,
        resizable: true,
        width: 200,
        height: 150,
        padding: 5,
        onOk: function(){
            console.warn('clicked ok')
        },
        onCancel: function () {
            console.warn('clicked cancel')
        },
        content: html
    };

    $.extend(defaultConfig, config);

    var d = $.Dialog(defaultConfig);

    // recalculate components positions on resize
    if (defaultConfig.resizable) {
        $(d).resizable();
        $(d).resize(function () {
            setSize(d);
        });
    }
    else {
        $(d).css('max-width', defaultConfig.width);
        $(d).css('max-height', defaultConfig.height);
    }

    var calCenter = function (parent) {
        var pH = $(parent).height();
        var bH = $(parent).find('.gnx-bottom').height();
        var cH = 37; //$(parent).find('.caption').height();

        var height = pH - (bH + cH);
        $(parent).find('.gnx-center').css('height', height);
    }

    var calBottom = function (parent) {
        var pH = $(parent).height();
        var bH = $(parent).find('.gnx-bottom').height();
        var cH = $(parent).find('.caption').height();
        var top = pH - bH;
        
        $(parent).find('.gnx-bottom').css('top', top);
    }

    var setSize = function (parent) {
        calBottom(parent);
        calCenter(parent);
    }

    // set some constraints to width/height - they seems to not be forced by Metro UI lib
    $(d).css('width', defaultConfig.width);
    $(d).css('height', defaultConfig.height);
    
    setSize(d);

    $(d).find('.OK').click({ dialog: d }, function (evt) {
        defaultConfig.onOk(evt);
        $.Dialog.close();
    });
    
    $(d).find('.CANCEL').click({dialog: d}, function (evt) {
        defaultConfig.onCancel(evt);
        $.Dialog.close();
    });

}