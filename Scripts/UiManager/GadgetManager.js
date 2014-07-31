function GnxGadgetManager() {
    this.chat = null;
    this.roomId = null;
    this.clientName = null;

    this.modulesContainers = [];

    this.cols = 4;

    this.sizeFactor = null;

    var me = this;


    this.gridsterOptions = {
        avoid_overlapped_widgets: false,
        autogrow_cols: true,
        widget_base_dimensions: [100, 100],
        widget_margins: [2, 2],
        helper: 'clone',
        draggable: {
            start: function (e, ui, $widget) {

                me.hideAll();

                //var frameId = ui.$player.contents().find("iframe")[0].id;
                //var iframe = $('#' + frameId);
                //iframe.hide();
                //log.innerHTML = 'START position: ' + ui.position.top +' '+ ui.position.left + "<br >" + log.innerHTML;
            },
            //drag: function (e, ui) {
            //    console.warn('drag drag', arguments);
            //    //log.innerHTML = 'DRAG offset: ' + ui.pointer.diff_top +' '+ ui.pointer.diff_left + "<br >" + log.innerHTML;
            //},
            stop: function (e, ui) {
                me.showAll();
                //var frameId = ui.$player.contents().find("iframe")[0].id;
                //var iframe = $('#' + frameId);
                //iframe.show();
                //log.innerHTML = 'STOP position: ' + ui.position.top +' '+ ui.position.left + "<br >" + log.innerHTML;
            }
        },
        resize: {
            enabled: true,
            //max_size: [4, 3],
            min_size: [1, 1],
            max_size: [Infinity, Infinity],
            //max_cols: 2,
            start: function (e, ui, $widget) {

                me.hideAll();

                //var frameId = $widget.contents().find("iframe")[0].id;
                //var iframe = $('#' + frameId);
                //iframe.hide();
                //console.warn('resize start?', e, ui, $widget);
            },
            stop: function (e, ui, $widget) {

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

                //iframe.show();

                me.showAll();
            }
        }
    }

    //this.gridsterOptions = {
    //    //max_size_x: true,
    //    //max_size_y: true,
    //    autogrow_cols: true, //allow for infinite x axis grow
    //    avoid_overlapped_widgets: true,
    //    widget_base_dimensions: [100, 100],
    //    widget_margins: [2, 2],
    //    helper: 'clone',
    //    max_cols: 2,
    //    axes: ['x', 'y'],
    //    //extra_rows: 1,
    //    //extra_cols: 1,
    //    draggable: {
    //        start: function (e, ui, $widget) {

    //            gadgetManager.hideAll();

    //            //var frameId = ui.$player.contents().find("iframe")[0].id;
    //            //var iframe = $('#' + frameId);
    //            //iframe.hide();
    //            //log.innerHTML = 'START position: ' + ui.position.top +' '+ ui.position.left + "<br >" + log.innerHTML;
    //        },
    //        //drag: function (e, ui) {
    //        //    console.warn('drag drag', arguments);
    //        //    //log.innerHTML = 'DRAG offset: ' + ui.pointer.diff_top +' '+ ui.pointer.diff_left + "<br >" + log.innerHTML;
    //        //},
    //        stop: function (e, ui) {
    //            gadgetManager.showAll();
    //            //var frameId = ui.$player.contents().find("iframe")[0].id;
    //            //var iframe = $('#' + frameId);
    //            //iframe.show();
    //            //log.innerHTML = 'STOP position: ' + ui.position.top +' '+ ui.position.left + "<br >" + log.innerHTML;
    //        }
    //    },
    //    resize: {
    //        enabled: true,
    //        //max_size: [4, 3],
    //        min_size: [1, 1],
    //        max_cols: 2,
    //        start: function (e, ui, $widget) {

    //            gadgetManager.hideAll();

    //            //var frameId = $widget.contents().find("iframe")[0].id;
    //            //var iframe = $('#' + frameId);
    //            //iframe.hide();
    //            //console.warn('resize start?', e, ui, $widget);
    //        },
    //        stop: function (e, ui, $widget) {
                
    //            var newHeight = this.resize_coords.data.height;
    //            var newWidth = this.resize_coords.data.width;

    //            // get title
    //            var titleHeight = 0;
    //            $widget.find('.portlet-header')
    //              .each(function () {
    //                  titleHeight = $(this).height();
    //              });

    //            var footerHeight = 0;
    //            $widget.find('.gs-resize-handle')
    //            .each(function () {
    //                footerHeight = $(this).height();
    //            });

    //            var afterResizeHeight = newHeight - titleHeight - footerHeight;

    //            var frameId = $widget.contents().find("iframe")[0].id;
    //            var iframe = $('#' + frameId);
    //            iframe.height(afterResizeHeight);

    //            //iframe.show();

    //            gadgetManager.showAll();
    //        }
    //    }
    //};

}

GnxGadgetManager.prototype.addGadget = function (gadgetUrl) {

    var gridster = $(".gridster > ul").gridster(this.gridsterOptions).data('gridster');
    var sizeFactor = 2;

    var divId = this.generateUUID();
    var widget = ['<li id=' + divId + '></li>', sizeFactor, sizeFactor];

    gridster.add_widget.apply(gridster, widget)

    var w = this.gridsterOptions.widget_base_dimensions[0] * sizeFactor;
    var h = this.gridsterOptions.widget_base_dimensions[1] * sizeFactor;

    var urlParams = '?';
    for (var e in SignalRSettings) {
        urlParams += '&' + e + '=' + SignalRSettings[e];
    }


    gadgetUrl += urlParams;
    window.gnxPreloadAndAddGadget(gadgetUrl, divId, w, h);

    gridster.set_dom_grid_width();
    gridster.set_dom_grid_height();

    console.warn('gridster', gridster);

    //var gridster = $(".gridster ul").gridster().data('gridster');
    //gridster.options.min_cols = 1; // Not necessarily required because of the following size changes, but I did it for clarity
    ////gridster.options.widget_base_dimensions = [100, 100];
    ////gridster.options.min_widget_width = 100;

    //// This section was for existing widgets. Apparently the code for drawing the droppable zones is based on the data stored in the widgets at creation time
    //for (var i = 0; i < gridster.$widgets.length; i++) {
    //    gridster.resize_widget($(gridster.$widgets[i]), 1, 1);
    //}

    //gridster.generate_grid_and_stylesheet();
    //gadgetManager

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

GnxGadgetManager.prototype.showAll = function(){
    //gadgetManager

    for(var i = 0; i < gadgetManager.modulesContainers.length; i++){
        gadgetManager.modulesContainers[i].show();
    }

}

GnxGadgetManager.prototype.hideAll = function () {
    //gadgetManager

    for (var i = 0; i < gadgetManager.modulesContainers.length; i++) {
        gadgetManager.modulesContainers[i].hide();
    }

}



// Global variable
var gadgetManager = new GnxGadgetManager();