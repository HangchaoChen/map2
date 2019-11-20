//import { environment } from "./../../environments/environment.prod";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
//import * as mapboxgl from "mapbox-gl";
import "leaflet-ajax";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    var map = L.map("map").setView([37.8, -96], 4);
    var selectedState;
    var IL_state = L.geoJson.ajax(
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/9f6e99027ae9af858c8135cbe21da3f0fa3d11bf/IL_state",
      {
        style: style,
        onEachFeature: onEachFeature
      }
    );
    map.addLayer(IL_state);
    var OH_state = L.geoJson.ajax(
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/OH_state",
      {
        style: style,
        onEachFeature: onEachFeature
      }
    );
    map.addLayer(OH_state);

    var statesLayer = L.geoJson.ajax(
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/states_GeoJSON",
      {
        style: style,
        onEachFeature: onEachFeature
      }
    );
    //map.addLayer(statesLayer);

    var OR_state = L.geoJson.ajax("", {
      style: style,
      onEachFeature: onEachFeature
    });

    var IL_district = L.geoJson.ajax(
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Illinois_congressional_geo.json",
      {
        style: style,
        onEachFeature: onEachFeature
      }
    );
    var OR_district = L.geoJson.ajax(
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Oregon_geo_precinct.json",
      {
        style: style,
        onEachFeature: onEachFeature
      }
    );
    var OH_district = L.geoJson.ajax(
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Ohio_congressional_geo.json",
      {
        style: style,
        onEachFeature: onEachFeature
      }
    );
    var IL_precinct;
    var OR_precinct;
    var OH_precinct;

    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
      {
        maxZoom: 18,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox.light",
        accessToken:
          "pk.eyJ1IjoicGlnZW9uZ3UiLCJhIjoiY2szNWZreTh6MDkzMDNjbXlyeDU5NzNjNyJ9.nG5xl3rGGzmLGDDhexrtZA"
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
        fillColor: "green",
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

    //var geojson;

    function resetHighlight(e) {
      statesLayer.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e) {
      let name = e.target.feature.properties.name;
      console.log("name:  ", name);
      let test = e.target.feature.properties.CD116FP;
      console.log("test", test);

      if (name === "Illinois") {
        selectedState = "Illinois";
        map.removeLayer(IL_state);
        map.addLayer(IL_district);
      } else if (name == "Oregon") {
        selectedState = "Oregon";
      } else if (name == "Ohio") {
        selectedState = "Ohio";
        map.removeLayer(OH_state);
      } else if (name == undefined) {
        if (selectedState == "Illinois") {
          let url = "";
        }
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

    /*
    geojson = L.geoJson
      .ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/states_GeoJSON",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      )
      .addTo(map);*/

    map.attributionControl.addAttribution(
      'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
    );
  }
}
