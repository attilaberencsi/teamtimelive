sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.vbm.AnalyticMap} AnalyticMap
   * @param {typeof sap.ui.model.json.JSONModel} JSONModel
   * @param {typeof sap.ui.Device} Device
   * @param {typeof sap.m.MessageToast} MessageToast
   */
  function (Controller, AnalyticMap, JSONModel, Device, MessageToast) {
    "use strict";

    // Configure countries/regions source file
    AnalyticMap.GeoJSONURL = "model/L0.json";

    // How often to refresh time on the screen
    const REFRESH_INTERVAL = 20000;

    return Controller.extend("com.sapdev.teamTime.controller.MainView", {

      /**
       * Setup map data and schedule a function to recalculate the current time on the map
       */
      onInit: function () {
        this._oModel = new JSONModel("model/Buddies.json");
        this.getView().setModel(this._oModel);

        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.getView().setModel(oDeviceModel, "device");

        this._oModel.attachRequestCompleted(this.onRecalcTime.bind(this));
        const fnCalcTime = this.onRecalcTime.bind(this);
        setInterval(fnCalcTime, REFRESH_INTERVAL);
      },


      /**
       * User click on a country in the map, show the code for the selected country
       * 
       * @param {*} oEvent
       */
      onRegionClick: function (oEvent) {
        MessageToast.show("Country / Region: " + oEvent.getParameter("code"));
      },

      /**
       * In case You want to get know more about Your colleagues, click on their name
       *
       * @param {*} oEvent
       */
      onClickItem: function (oEvent) {
        MessageToast.show("We need a coffe !!!!");
      },


      /**
       * Time is tickin at every REFRESH_INTERVAL millis.
       * Update clock labels on the map. Trick is the usage of toLocaleTimeString function, which then
       * updates the map through the binding of the JSON Model we update here. 
       */
      onRecalcTime: function () {
        var aLocations = this._oModel.getProperty("/Spots");

        for (let index = 0; index < aLocations.length; index++) {
          var oLocation = aLocations[index];

          let date = new Date;

          let strTime = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: oLocation.timeZoneJS
          });

          oLocation.time = strTime;

        }

        this._oModel.setProperty("/Spots", aLocations);
      }

    });
  }
);