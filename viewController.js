/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

$(function () {

    // Input field that contains gadget urls added by the user manually
    var newGadgetUrl = $('#gadgetUrl');

    // Input fields that contains EE gadget URL and EE context
    var eeUrl = $('#eeUrl');
    var eecontextPayload = $('#eecontextPayload');
    var eeHeight = $('#eeHeight');
    var eeWidth = $('#eeWidth');

    //  Input fields for container event testing
    var newEventTopic = $('#eventTopic');
    var newEventPayload = $('#eventPayload');

    // Base html template that is used for the gadget wrapper and site
    var gadgetTemplate = '<div class="portlet">' +
				                '<div id="gadget-site" class="portlet-content"></div>' +
	                     '</div>';



    //variable to keep track of gadget current view for collapse and expand gadget actions.
    var currentView = 'default';

    // ID used to associate gadget site
    var curId = 0;

    //  Load the default collections stored and update the options with the collection name
    //$.ajax({
    //    url: './gadgetCollections.json',
    //    dataType: 'json',
    //    success: function (data) {
    //        $.each(data.collections, function (i, data) {
    //            var optionVal = [];
    //            $.each(data.apps, function (i, data) {
    //                if (data.url.indexOf('http') < 0 && data.url.indexOf('/') == 0) {
    //                    optionVal.push(urlBase + data.url);
    //                } else {
    //                    optionVal.push(data.url);
    //                }
    //            });
    //            $('#gadgetCollection').append('<option value="' + optionVal.toString() + '">' + data.name + '</option>');
    //        });
    //    }
    //});

    //$.ajax({
    //    url: './viewsMenu.json',
    //    dataType: 'json',
    //    success: function (data) {
    //        $.each(data.views, function (i, selection) {
    //            $('#viewOptions').append('<option value="' + selection.value + '">' + selection.name + '</option>');
    //        });
    //    }
    //});

    //navigate to the new view and save it as current view
    navigateView = function (gadgetSite, gadgetURL, toView) {
        //save the current view for collapse, expand gadget
        currentView = toView;
        CommonContainer.navigateView(gadgetSite, gadgetURL, toView);
    };

    //handle gadget collapse, expand, and remove gadget actions
    handleNavigateAction = function (portlet, gadgetSite, gadgetURL, actionId, parentConteinerId) {

        //remove button was click, remove the portlet/gadget
        if (typeof gadgetSite !== 'undefined') {
            if (actionId === 'remove') {

                if (confirm('This gadget will be removed, ok?')) {

                    CommonContainer.closeGadget(gadgetSite);
                    portlet.remove();
                    delete siteToTitleMap[gadgetSite.getId()];

                    // remove gridster widget
                    gadgetManager.removeGadget(parentConteinerId);
                }


            } else if (actionId === 'expand') {
                //navigate to currentView prior to colapse gadget
                CommonContainer.navigateView(gadgetSite, gadgetURL, currentView);
            } else if (actionId === 'collapse') {
                CommonContainer.collapseGadget(gadgetSite);
            }
        }
    };

    removeWidget = function (evt) {
        var portlet = evt.data.portlet;
        var gadgetSite = evt.data.gadgetSite;
        var listId = evt.data.listId;

        //remove button was click, remove the portlet/gadget
        if (typeof gadgetSite !== 'undefined') {

            // Show nice confirmation dialog
            $.ConfirmationDialog({
                title: '<div class="fg-orange">Question</div>',
                message: 'This gadget will be removed, ok?',
                width: 250,
                height: 150,
                onOk: function (evt) {
                    CommonContainer.closeGadget(gadgetSite);
                    portlet.remove();
                    delete siteToTitleMap[gadgetSite.getId()];

                    // remove gridster widget
                    gadgetManager.removeGadget(listId);
                },
                onCancel: function (evt) {
                    //console.warn('cancel', evt.data)
                }
            });
        }
    }

    //RPC handler for the set-title feature
    window.setTitleHandler = function (rpcArgs, title) {
        var titleId = siteToTitleMap[rpcArgs.gs.id_];
        $('#' + titleId).text(title);
    };



    window.getNewGadgetElement = function (result, gadgetURL, injectDivId, data) {

        result[gadgetURL] = result[gadgetURL] || {};
        var gadgetSiteString = "$(this).closest(\'.portlet\').find(\'.portlet-content\').data(\'gadgetSite\')";
        var viewItems = '';
        var gadgetViews = result[gadgetURL].views || {};
        var newGadgetSite = gadgetTemplate;
        newGadgetSite = newGadgetSite.replace(/(gadget-site)/g, '$1-' + curId);
        siteToTitleMap['gadget-site-' + curId] = 'gadget-title-' + curId;
        var gadgetTitle = (result[gadgetURL] && result[gadgetURL]['modulePrefs'] && result[gadgetURL]['modulePrefs'].title) || 'Title not set';

        if (!injectDivId) {
            injectDivId = 'gadgetArea';
        }

        $('#' + injectDivId).parent().find('.title').text(data.Name);

        $(newGadgetSite).appendTo($('#' + injectDivId));

        return $('#gadget-site-' + curId).get([0]);
    }

    window.getNewGadgetElementOriginal = function (result, gadgetURL, injectDivId) {
      //  result[gadgetURL] = result[gadgetURL] || {};
      //  var gadgetSiteString = "$(this).closest(\'.portlet\').find(\'.portlet-content\').data(\'gadgetSite\')";
      //  var viewItems = '';
      //  var gadgetViews = result[gadgetURL].views || {};
      //  for (var aView in gadgetViews) {
      //      viewItems = viewItems + '<li><a href="#" onclick="navigateView(' + gadgetSiteString + ',' + '\'' + gadgetURL + '\'' + ',' + '\'' + aView + '\'' + '); return false;">' + aView + '</a></li>';
      //  }
      //  var newGadgetSite = gadgetTemplate;
      //  newGadgetSite = newGadgetSite.replace(/(gadget-site)/g, '$1-' + curId);
      //  siteToTitleMap['gadget-site-' + curId] = 'gadget-title-' + curId;
      //  var gadgetTitle = (result[gadgetURL] && result[gadgetURL]['modulePrefs'] && result[gadgetURL]['modulePrefs'].title) || 'Title not set';

      //  if (!injectDivId) {
      //      injectDivId = 'gadgetArea';
      //  }


      //  $(newGadgetSite).appendTo($('#' + injectDivId)).addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
      //.find('.portlet-header')
      //.addClass('ui-widget-header ui-corner-all')
      //.text('')
      //.append('<span id="gadget-title-' + curId + '">' + gadgetTitle + '</span>' +
      //        '<ul id="viewsDropdown">' +
      //       '<li class="li-header">' +
      //         '<a href="#" class="hidden"><span id="dropdownIcon" class="ui-icon ui-icon-triangle-1-s"></span></a>' +
      //       '<ul>' +
      //         viewItems +
      //       '</ul>' +
      //        '</li>' +
      //         '</ul>')
      //  .append('<span id="remove" class="ui-icon ui-icon-closethick"></span>')
      //  .append('<span id="expand" class="ui-icon ui-icon-plusthick"></span>')
      //  .append('<span id="collapse" class="ui-icon ui-icon-minusthick"></span>');

      //  return $('#gadget-site-' + curId).get([0]);
    }

    //create a gadget with navigation tool bar header enabling gadget collapse, expand, remove, navigate to view actions.
    window.buildGadget = function (result, gadgetURL, injectDivId, data) {

        result = result || {};
        var element = window.getNewGadgetElement(result, gadgetURL, injectDivId, data);

        $(element).data('gadgetSite', CommonContainer.renderGadget(gadgetURL, curId));

        //determine which button was click and handle the appropriate event.
        //$('.portlet-header .ui-icon').click(function() {
        //    handleNavigateAction($(this).closest('.portlet'), $(this).closest('.portlet').find('.portlet-content').data('gadgetSite'), gadgetURL, this.id, injectDivId);
        //});


        var gridsterWidget = $('#' + injectDivId).parent();
        var btnMin = $(gridsterWidget).find('.btn-min') || null;
        var btnMax = $(gridsterWidget).find('.btn-max') || null;
        var btnClose = $(gridsterWidget).find('.btn-close') || null;

        var portlet = $('#' + injectDivId).find('.portlet');
        var gadgetSite = portlet.find('.portlet-content').data('gadgetSite');


        // NOTE: manage load masks
        // at this point we can show load mask
        $('#' + injectDivId).showLoadMask();
        // this is callback to gadget being rendered
        // so we use it to hide load mask wil bit of timeout
        gadgetSite.onRender = function () {
            // a bit delayed mask remove
            setTimeout(function () {
                $('#' + injectDivId).hideLoadMask();
            }, 2000)
        }

        

        if (btnMin) {
            $(btnMin).click(function (element) { console.warn('btnMin clicked'); });
        }
        if (btnMax) {
            $(btnMax).click(function (element) { console.warn('btnMax clicked'); });
        }
        if (btnClose) {

            $(btnClose).click(
                  { // pass parameter for click callback alert(event.data.param1);
                      portlet: portlet,
                      gadgetSite: gadgetSite,
                      listId: $('#' + injectDivId).parent().parent().parent()[0].id
                  },
                  removeWidget
              );
        }


        $('#' + $(element).find('iframe')[0].id).height($('#' + injectDivId).height());

    };

    window.gnxPreloadAndAddGadget = function (url, divId, data) {

        CommonContainer.preloadGadget(url, function (result) {
            for (var gadgetURL in result) {
                if (!result[gadgetURL].error) {
                    window.buildGadget(result, gadgetURL, divId, data);
                    curId++;
                }
                else {
                    gadgetManager.removeGadget($('#' + divId).parent().parent().parent().attr('id'));
                    $.InfoDialog({
                        title: 'Info',
                        height: 150,
                        width: 200,
                        resizable: false,
                        icon: '',
                        message: 'Given module did not load, information will be passed to the module owner',
                        onOk: function (evt) {
                            console.warn('ok', evt.data);
                        },
                        onCancel: function (evt) {
                            console.warn('cancel', evt.data)
                        }
                    });
                }
            }
        });

    };

});
