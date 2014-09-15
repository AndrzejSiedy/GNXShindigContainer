function GnxGadgetManager() {
    this.chat = null;
    this.roomId = null;
    this.clientName = null;

    this.modulesContainers = [];

    this.cols = 4;

    this.sizeFactor = null;

    var me = this;


    this.gridsterOptions = {
        avoid_overlapped_widgets: true,
        widget_base_dimensions: [100, 100],
        widget_margins: [5, 5],
        autogrow_cols: true,
        draggable: {
            start: function (e, ui, $widget) {
                me.hideAll();
            },
            //drag: function (e, ui) {
            //},
            stop: function (e, ui) {
                me.showAll();
            }
        },
        resize: {
            enabled: true,
            start: function (e, ui, $widget) {
                // this is to prevent mouse events being disturbed
                me.hideAll();
            },
            stop: function (e, ui, $widget) {
                // NOTE: 
                // After widget gets resized, we need to tell internal iframe to set new size too
                $widget.contents().find("iframe").height($widget.find('.gnx-widget-center').height());
                me.showAll();
            }
        }
    }
}

GnxGadgetManager.prototype.addGadget = function (data) {

    var gridster = $(".gridster > ul").gridster(this.gridsterOptions).data('gridster');
    var sizeFactor = 2;

    var divId = this.generateUUID();
    var contentId = this.generateUUID();

    var t = '<div class="gnx-widget-header gnx-widget-font">' +
                        '<i class="icon-cancel-2 pull-right" style="font-weight: lighter !important;padding-right: 10px; width: 15px; height:15px; margin-left: 0px; padding-top: 2px; margin-top: -5px; margin-right: 5px;"></i>' +
                        '<i class="icon-window pull-right" style="padding-right: 10px; width: 15px; height:15px; margin-left: 0px; padding-top: 3px; margin-top: -5px; margin-right: 5px;"></i>' +
                        '<i class="icon-minus-2 pull-right" style="padding-right: 10px; width: 15px; height:15px; margin-left: 0px; padding-top: 5px; margin-top: -5px; margin-right: 5px;"></i>' +
                        '<div class="title"></div>' + 
            '</div>' +
            '<div class="gnx-widget-center gnx-widget-font" id=' + contentId + '>' +
            '</div>' +
            '<div class="gnx-widget-footer gnx-widget-font">' +
                    'Footer' +
            '</div>';


    var widget = ['<li id=' + divId + '>' + t + '</li>'
        , sizeFactor, sizeFactor];

    var newGridsterWidget = gridster.add_widget.apply(gridster, widget);

    // get width, height for gnx-widget-center
    var w = $('#' + contentId).width();
    var h = $('#' + contentId).height();

    var urlParams = '?';
    for (var e in SignalRSettings) {
        urlParams += '&' + e + '=' + SignalRSettings[e];
    }
    
    window.gnxPreloadAndAddGadget(data.GadgetUrl + urlParams, contentId, data);

    gridster.set_dom_grid_width();
    gridster.set_dom_grid_height();

}


GnxGadgetManager.prototype.removeGadget = function (idToRemove) {
    var gridster = $(".gridster > ul").gridster(this.gridsterOptions).data('gridster');

    // get widget with given id
    var widGetEl = $('#' + idToRemove);
    gridster.remove_widget(widGetEl[0]);
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