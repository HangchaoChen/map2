import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import "leaflet-ajax";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    var map = L.map("map").setView([37.8, -96], 4);

    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
      {
        maxZoom: 18,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox.light"
      }
    ).addTo(map);

    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function(map) {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    info.update = function(props) {
      this._div.innerHTML =
        "<h4>Voting Data</h4>" +
        (props ? "<b>" + props.name + "</b><br />" : "Hover over a state");
    };

    info.addTo(map);

    function style(feature) {
      console.log("feature: ", feature);
      return {
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: "#FD8D3C"
      };
    }

    function stateStyle(feature) {
      return {
        fillColor: "white",
        weight: 2,
        opacity: 1,
        color: "white"
      };
    }

    function districtStyle(feature) {
      return {
        fillColor: feature.properties.COLOR,
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        color: "white"
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e) {
      let name = e.target.feature.properties.name;
      console.log(name);
      if (name === "Illinois") {
        geojson = L.geoJson
          .ajax(
            "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/IL_district_boundary.json",
            {
              style: style,
              onEachFeature: onEachFeature
            }
          )
          .addTo(map);
      }

      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }
    geojson = L.geoJson
      .ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/states_GeoJSON",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      )
      .addTo(map);

    map.attributionControl.addAttribution(
      'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
    );
  }
}
