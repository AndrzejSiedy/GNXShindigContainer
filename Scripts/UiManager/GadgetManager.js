function GnxGadgetManager() {
    this.chat = null;
    this.roomId = null;
    this.clientName = null;

    this.modulesContainers = [];

    var me = this;

    this.gridsterOptions = {
        //max_size_x: true,
        //max_size_y: true,
        autogrow_cols: true, //allow for infinite x axis grow
        avoid_overlapped_widgets: true,
        widget_base_dimensions: [100, 100],
        widget_margins: [2, 2],
        helper: 'clone',
        //extra_rows: 1,
        //extra_cols: 1,
        resize: {
            enabled: true,
            //max_size: [4, 3],
            min_size: [1, 1],
            max_cols: 2,
            start: function (e, ui, $widget) {

                var frameId = $widget.contents().find("iframe")[0].id;
                var iframe = $('#' + frameId);
                iframe.hide();
                console.warn('resize start?', e, ui, $widget);
            },
            stop: function (e, ui, $widget) {
                console.warn('resize end?', e, ui, $widget);
                var newHeight = this.resize_coords.data.height;
                var newWidth = this.resize_coords.data.width;

                // get title
                var titleHeight = 0;
                $widget.find('.portlet-header')
                  .each(function () {
                      titleHeight = $(this).height();
                  });

                var footerHeight = 0;
                $widget.find('.gs-resize-handle')
                .each(function () {
                    footerHeight = $(this).height();
                });

                var afterResizeHeight = newHeight - titleHeight - footerHeight;

                var frameId = $widget.contents().find("iframe")[0].id;
                var iframe = $('#' + frameId);
                iframe.height(afterResizeHeight);

                iframe.show();
            }
        }
    };

}

GnxGadgetManager.prototype.addGadget = function (gadgetUrl) {

    var gridster = $(".gridster > ul").gridster(this.gridsterOptions).data('gridster');

    var sizeFactor = 2;

    var divId = this.generateUUID();
    var widget = ['<li id=' + divId + '></li>', sizeFactor, sizeFactor];

    var gster = gridster.add_widget.apply(gridster, widget)

    var w = this.gridsterOptions.widget_base_dimensions[0] * sizeFactor;
    var h = this.gridsterOptions.widget_base_dimensions[1] * sizeFactor;
    window.gnxPreloadAndAddGadget(gadgetUrl, divId, w, h);

}

GnxGadgetManager.prototype.generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
}

GnxGadgetManager.prototype.initGridster = function () {
    var gridster = $(".gridster ul").gridster(this.gridsterOptions).data('gridster');
}





