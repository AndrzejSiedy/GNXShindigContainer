function GnxGadgetManager() {
    this.chat = null;
    this.roomId = null;
    this.clientName = null;

    this.moduleContainers = [];

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

    var divId = $.getUuid();
    var contentId = $.getUuid();

    // old template
    //var t = '<div class="gnx-widget-header gnx-widget-font">' +
    //                '<div class="caption"><button class="btn-close"></button><div class="title">Bloody title</div></div>' +
    //                    '<i class="icon-cancel-2 pull-right" style="font-weight: lighter !important;padding-right: 10px; width: 15px; height:15px; margin-left: 0px; padding-top: 2px; margin-top: -5px; margin-right: 5px;"></i>' +
    //                    '<i class="icon-window pull-right" style="padding-right: 10px; width: 15px; height:15px; margin-left: 0px; padding-top: 3px; margin-top: -5px; margin-right: 5px;"></i>' +
    //                    '<i class="icon-minus-2 pull-right" style="padding-right: 10px; width: 15px; height:15px; margin-left: 0px; padding-top: 5px; margin-top: -5px; margin-right: 5px;"></i>' +
    //                    '<div class="title"></div>' + 
    //        '</div>' +
    //        '<div class="gnx-widget-center gnx-widget-font" id=' + contentId + '>' +
    //        '</div>' +
    //        '<div class="gnx-widget-footer gnx-widget-font">' +
    //                'Footer' +
    //        '</div>';


    // new template is a variation of Metro UI window to show nice buttons
    var t =
        '<div class="metro" style="position:absolute !important; width: 100%;height:100%;">' +
            '<div class="window flat" style="overflow: hidden; position: relative; width: 100%; height: 100%;">' +
                '<div class="caption gnx-widget-header">' +
                    //'<button class="btn-min"></button>' +
                    //'<button class="btn-max"></button>' +
                    '<button class="btn-close"></button>' +
                    '<div class="title"></div>' +
                '</div>' +
                '<div id=' + contentId + ' class="content gnx-widget-center" style="height: calc(100% - (57px)) !important;padding: 0px !important;">' +
                '</div>' +
                '<div class="gnx-widget-footer gnx-widget-font">' +
                '</div>'
    '</div>' +
'</div>';

    var widget = ['<li id=' + divId + '>' + t + '</li>'
        , sizeFactor, sizeFactor];

    var newGridsterWidget = gridster.add_widget.apply(gridster, widget);

    this.curentDOMWidgetId = divId;

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

    // store info about gadget container - used to show/hide load mask while gadget is being prepared
    this.moduleContainers.push({
        containerId: divId,
        data: data
    });

    console.warn('registered modules count', this.moduleContainers.length);


}


GnxGadgetManager.prototype.removeGadget = function (idToRemove) {
    var gridster = $(".gridster > ul").gridster(this.gridsterOptions).data('gridster');
    // get widget with given id
    var widGetEl = $('#' + idToRemove);
    gridster.remove_widget(widGetEl[0]);


    //// remove widget from array after its being removed from system
    //var items = $.grep(this.moduleContainers, function (item) {
    //    return item.containerId != idToRemove;
    //});

    for (var i = 0; i < this.moduleContainers.length; i++) {
        var item = this.moduleContainers[i];
        if (item.containerId == idToRemove) {
            this.moduleContainers.splice(i, 1);
            break;
        }
    }

}

GnxGadgetManager.prototype.getWidgetByGadgetUrl = function (gadgetUrl) {
    for (var i = 0; i < this.moduleContainers.length; i++) {
        var gUrlPure = gadgetUrl.split('?')[0];
        if (this.moduleContainers[i].data.GadgetUrl == gUrlPure) return this.moduleContainers[i];
    }
    return null;
}

GnxGadgetManager.prototype.initGridster = function () {
    var gridster = $(".gridster ul").gridster(this.gridsterOptions).data('gridster');
}

GnxGadgetManager.prototype.showAll = function () {
    //gadgetManager

    for (var i = 0; i < this.moduleContainers.length; i++) {
        $('#' + this.moduleContainers[i].containerId).find('.gnx-widget-center').show();
    }

}

GnxGadgetManager.prototype.hideAll = function () {
    //gadgetManager

    for (var i = 0; i < this.moduleContainers.length; i++) {
        $('#' + this.moduleContainers[i].containerId).find('.gnx-widget-center').hide();
    }

}

//GnxGadgetManager.prototype.onBeforeRender = function (url) {
//    $('#' + this.getWidgetByGadgetUrl(url).containerId).showLoadMask();
//}

//GnxGadgetManager.prototype.onRender = function (url) {
//    $('#' + this.getWidgetByGadgetUrl(url).containerId).hideLoadMask();
//}


// Global variable
var gadgetManager = new GnxGadgetManager();

