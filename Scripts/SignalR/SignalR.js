function GnxSignalR() {
    this.chat = null;
    this.roomId = null;
    this.clientName = null;
}




GnxSignalR.prototype.initSignalR = function (signalRHubUrl, hubName, roomId) {

    

    if (signalRHubUrl) {
        this.signalRHubUrl = signalRHubUrl;
    }
    if (hubName) {
        this.hubName = hubName;
    }

    if (roomId) {
        this.roomId = roomId;
    }

    var self = this;

    // set url to SignalR hub
    $.connection.hub.url = this.signalRHubUrl;

    // Declare a proxy to reference the hub. 
    // Hub name read from global variable

    this.chat = $.connection[this.hubName];


    // method called from "JoinRoom" Hub class
    this.chat.client.joinedRoom = this.joinedRoom;

    this.chat.client.userLoggedInSuccess = this.userLoggedInSuccess;

    this.chat.client.userLoggedOffSuccess = this.userLoggedOffSuccess;

    this.chat.client.gadgetDropped = this.gadgetDropped;

    $.connection.logging = true;

    $.connection.hub.start().done(function () {
        self.chat.server.joinRoom(self.roomId, self.clientName);
    });
}

GnxSignalR.prototype.joinedRoom = function (data) {
}

GnxSignalR.prototype.userLoggedInSuccess = function () {
}

GnxSignalR.prototype.userLoggedOffSuccess = function () {
}

GnxSignalR.prototype.gadgetDropped = function (evtName, evtData) {

    console.warn('gadgetDroped', evtData.data);

    if (evtData.data.GadgetUrl && evtData.data.GadgetUrl.length > 0) {
        gadgetManager.addGadget(evtData.data);
    }


    // create and load gadget
    //var gadgetUrl = "http://localhost:8088/gadgets/sample-pubsub-2-subscriber.xml";
    //CommonContainer.preloadGadget(gadgetUrl, function (result) {
    //    for (var gadgetURL in result) {
    //        if (!result[gadgetURL].error) {
    //            window.buildGadget(result, gadgetURL);
    //            curId++;
    //        }
    //    }
    //});

    //// create and load gadget
    //var gadgetUrl = "http://localhost:8088/gadgets/TestGeoLoc.xml";
    ////var gadgetUrl = "http://www.labpixies.com/campaigns/todo/todo.xml";
    //CommonContainer.preloadGadget(gadgetUrl, function (result) {
    //    for (var gadgetURL in result) {
    //        if (!result[gadgetURL].error) {
    //            window.buildGadget(result, gadgetURL);
    //            curId++;
    //        }
    //    }
    //});

    //$('#gadgetUrl').val('http://localhost:8088/gadgets/TestGeoLoc.xml');
    //$('#preloadAndAddGadget').click();

    //$('#gadgetUrl').val('http://localhost:8088/gadgets/sample-pubsub-2-subscriber.xml');
    //$('#preloadAndAddGadget').click();

    //$('#gadgetUrl').val('http://localhost:8088/gadgets/sample-pubsub-2-publisher.xml');
    //$('#preloadAndAddGadget').click();

    
    //gadgetManager.addGadget('http://www.labpixies.com/campaigns/todo/todo.xml');
    //gadgetManager.addGadget('http://localhost:8088/gadgets/TestGeoLoc.xml');
    //gadgetManager.addGadget('http://localhost:8088/gadgets/TestGeoLocGrid.xml');


    //gadgetManager.addGadget('http://localhost:8088/gadgets/sample-pubsub-2-subscriber.xml');
    //gadgetManager.addGadget('http://localhost:8088/gadgets/sample-pubsub-2-publisher.xml');

    //gadgetManager.addGadget('http://edulifeline.com/includes/stocks_widget/widget.xml');

    //gadgetManager.addGadget('http://localhost:8088/gadgets/Hello.xml');
    
}


