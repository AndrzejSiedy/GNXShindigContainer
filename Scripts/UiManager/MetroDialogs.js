$.ConfirmationDialog = function (config) {

    var t = '<div style="width:100%;height:100%;position:absolute!important;">' +
            '<div class="tile-middle gnx-widget-font">{message}</div>' +
            '<div class="tile-bottom gnx-widget-font" style="height: 35px !important; bottom: 0px !important;">' +
                '<div style="position:relative!important; top: 45px !important;">' +
                    '<button class="warning CANCEL pull-right">Cancel</button>' +
                    '<button class="info OK pull-right">&#160;&#160;Ok&#160;&#160;&#160;</button>' +
                '</div>' +
            '</div>' +
        '</div>';

    var html = t
            .replace("{message}", config.message)
            .replace("null", '');

    var defaultConfig = {
        shadow: true,
        overlay: true,
        flat: true,
        title: 'title',
        draggable: false,
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

    $(d).find('.OK').click({ dialog: d }, function (evt) {
        defaultConfig.onOk(evt);
        $.Dialog.close();
    });


    $(d).find('.CANCEL').click({dialog: d}, function (evt) {
        defaultConfig.onCancel(evt);
        $.Dialog.close();
    });

}