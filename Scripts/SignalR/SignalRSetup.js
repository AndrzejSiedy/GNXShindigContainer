var SignalRSettings = {
    signalRHubUrl: null,
    hubName: null,
    roomId: null
};

$(document).ready(function () {
    var params = window.location.search.substring(1).split("&");

    // load signalR hub and all
    $.getScript(params[0].split('=')[1])
      .done(function (script, textStatus) {

          var signalR = new GnxSignalR();

          //signalRHubUrl, hubName
          SignalRSettings.signalRHubUrl = params[0].split('=')[1];
          SignalRSettings.hubName = params[1].split('=')[1];
          SignalRSettings.roomId = params[2].split('=')[1];

          signalR.initSignalR(SignalRSettings.signalRHubUrl, SignalRSettings.hubName, SignalRSettings.roomId);
      })
      .fail(function (jqxhr, settings, exception) {
          console.warn('failed to load SignalR Hubs js');
      });
});