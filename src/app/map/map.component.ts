import { properties } from "ng-zorro-antd";
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as L from "leaflet";
import "leaflet-ajax";
import { WebsocketService } from "../websocket.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  constructor(private http: HttpClient, private socket: WebsocketService) {}

  ngOnInit() {
    var map = L.map("map").setView([37.8, -96], 4);
    const IL = "Illinois";
    const OH = "Ohio";
    const OR = "Oregon";

    enum SelectedYear {
      CONGRESSION2016,
      CONGRESSION2018,
      PRESIDENTIANAL2016
    }

    var selectedState;
    var ILState;
    var OHState;
    var ORState;
    var statesLayer;
    var ILDistrict;
    var ORDistrict;
    var OHDistrict;
    var ILPrecinct;
    var ORPrecinct;
    var OHPrecinct;

    loadStates();

    loadILDistrict();
    loadORDistrict();
    loadOHDistrict();
    loadILPrecinct();
    loadORPrecinct();

    function loadIllinoisDisctrict(year) {
      year = "CONGRESSION_2016";
      let url = "http://localhost:8080/getDistrictData";
      let params = new HttpParams().set("year", year).set("stateName", IL);
      this.HttpClient.get(url, { params: params }).subscribe((json: any) => {});
    }

    function loadStates() {
      ILState = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/9f6e99027ae9af858c8135cbe21da3f0fa3d11bf/IL_state",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
      map.addLayer(ILState);
      OHState = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/OH_state",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
      map.addLayer(OHState);
      ORState = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/OR_state",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
      map.addLayer(ORState);

      statesLayer = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/states_GeoJSON",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadILDistrict() {
      ILDistrict = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Illinois_congressional_geo.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadILPrecinct() {
      ILPrecinct = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Illinois_geo.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadORDistrict() {
      ORDistrict = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Oregon_congressional_geo_processed.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadORPrecinct() {
      ORPrecinct = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Oregon_geo_precinct_2016.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadOHDistrict() {
      OHDistrict = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/Ohio_congressional_geo.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadOHPrecinct() {
      console.log("load Ohio Precinct");
    }

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/pigeongu/ck36rswf038r61cqrqi7n8jeb/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGlnZW9uZ3UiLCJhIjoiY2szNWZreTh6MDkzMDNjbXlyeDU5NzNjNyJ9.nG5xl3rGGzmLGDDhexrtZA",
      {
        maxZoom: 15,
        minZoom: 2,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox.streets",
        accessToken:
          "pk.eyJ1IjoicGlnZW9uZ3UiLCJhIjoiY2szNWZreTh6MDkzMDNjbXlyeDU5NzNjNyJ9.nG5xl3rGGzmLGDDhexrtZA"
      }
    ).addTo(map);

    /*
    function removeAllState() {
      map.removeLayer(ILState);
      map.removeLayer(OHState);
      map.removeLayer(ORState);
    }

  
    map.on("zoomend", () => {
      if (map.getZoom() > 6) {
        if (selectedState == IL) {
          map.removeLayer();
          map.removeLayer();
          map.addLayer();
        } else if (selectedState == OH) {
          map.removeLayer();
          map.removeLayer();
          map.addLayer();
        } else if (selectedState === OR) {
          map.removeLayer();
          map.removeLayer();
          map.addLayer();
        }
        removeAllState();
      } else {
        map.removeLayer();
        map.removeLayer();
        map.removeLayer();
        map.addLayer();
      }
    });*/

    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function(map) {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    enum Info {
      Total,
      White,
      Black_or_African_American,
      American_Indian_and_Alaska_Native,
      Asian,
      Native_Hawaiian_and_Other_Pacific_Islander,
      Some_Other_Race,
      Two_or_more_races
    }

    var OR_district_info = [
      [858910, 682996, 18791, 5374, 69904, 4836, 33889, 43120],
      [831343, 752017, 5956, 15829, 10435, 1882, 15377, 29847],
      [841456, 665732, 42053, 7899, 66538, 5304, 12169, 41761],
      [814998, 708868, 5543, 10607, 21313, 1621, 24402, 42644],
      [844006, 705370, 9703, 9342, 22490, 5115, 52136, 39850]
    ];

    var OH_district_info = [
      [740979, 528785, 153148, 1049, 27695, 0, 6680, 23622],
      [734712, 626756, 71218, 1183, 14023, 1326, 2967, 17239],
      [812264, 435291, 276374, 2310, 37678, 68, 21435, 39108],
      [707219, 637111, 35888, 3610, 8129, 74, 4479, 17928],
      [717088, 654248, 18872, 1250, 9691, 857, 10590, 21580],
      [694694, 658447, 15368, 1304, 3887, 0, 2074, 13614],
      [734091, 677610, 28285, 1645, 4713, 0, 3780, 18058],
      [731637, 640979, 44808, 1248, 16544, 0, 6862, 21196],
      [716235, 533397, 112356, 3161, 10655, 503, 19485, 36678],
      [725301, 553451, 121710, 1847, 17383, 414, 5073, 25423],
      [678001, 269493, 355642, 1791, 17489, 327, 8207, 25052],
      [789634, 683722, 36840, 1594, 36877, 136, 3733, 26732],
      [707603, 580914, 82532, 977, 15332, 37, 5696, 22115],
      [720551, 649331, 35441, 569, 16156, 355, 4629, 14070],
      [759569, 679312, 36182, 1063, 19593, 86, 2709, 20624],
      [719864, 662093, 21642, 1071, 15917, 45, 3737, 15359]
    ];

    info.update = function(props) {
      let or = 41;
      let il = 17;
      let oh = 39;
      let id = 0;

      let total = 0;
      let white = 0;
      let black = 0;
      let indian = 0;
      let asian = 0;
      let hawaiian = 0;
      let other = 0;
      let two_race = 0;
      if (props != undefined) {
        // console.log("props: ", props.STATEFP);
        let state = props.STATEFP;
        id = props.CD116FP;
        //console.log("props id: ", props.CD116FP);
        if (state == or) {
          total = OR_district_info[id - 1][Info.Total];
          white = OR_district_info[id - 1][Info.White];
          black = OR_district_info[id - 1][Info.Black_or_African_American];
          indian =
            OR_district_info[id - 1][Info.American_Indian_and_Alaska_Native];
          asian =
            OR_district_info[id - 1][
              Info.Native_Hawaiian_and_Other_Pacific_Islander
            ];
          other = OR_district_info[id - 1][Info.Some_Other_Race];
          two_race = OR_district_info[id - 1][Info.Two_or_more_races];
        } else if (state == il) {
          //console.log("it's illinios");
        } else if (state == oh) {
          //console.log("it's ohio");
          total = OH_district_info[id - 1][Info.Total];
          white = OH_district_info[id - 1][Info.White];
          black = OH_district_info[id - 1][Info.Black_or_African_American];
          indian =
            OH_district_info[id - 1][Info.American_Indian_and_Alaska_Native];
          asian =
            OH_district_info[id - 1][
              Info.Native_Hawaiian_and_Other_Pacific_Islander
            ];
          other = OH_district_info[id - 1][Info.Some_Other_Race];
          two_race = OH_district_info[id - 1][Info.Two_or_more_races];
        }
      }

      this._div.innerHTML = `<h4>Population Data</h4> ${
        props && props.name != undefined
          ? "<b>" + props.name + "</b><br />"
          : "ID: " +
            (id == 0 ? "" : id) +
            "<br />" +
            "total population : " +
            (total == 0 ? "" : total) +
            "<br/>" +
            "White : " +
            (white == 0 ? "" : white) +
            "<br/>" +
            "Black & African American : " +
            (black == 0 ? "" : black) +
            "<br/>" +
            "American Indian: " +
            (indian == 0 ? "" : indian) +
            "<br/>" +
            "Asian : " +
            (asian == 0 ? "" : asian) +
            "<br/>" +
            "Native Hawaiian: " +
            (hawaiian == 0 ? "" : hawaiian) +
            "<br/>" +
            "Other : " +
            (other == 0 ? "" : other) +
            "<br/>" +
            "Mixed Race : " +
            (two_race == 0 ? "" : two_race) +
            "<br/>"
      }`;
    };

    info.addTo(map);

    enum StateID {
      ILLINOIS = 17,
      OHIO = 39,
      OREGON = 41
    }

    function style(feature) {
      //console.log("color: ", feature);
      let state = feature.properties.STATEFP;
      let color = "white";
      if (state == StateID.OREGON) {
        //console.log(color);
        color = feature.properties.votes.color;
      }
      //console.log("pp:", feature.properties);
      if (feature.properties.OROnly_P_1 == OR) {
        if (feature.properties.OBJECTID < 1000) {
          color = "red";
        } else {
          color = "blue";
        }
      }

      return {
        weight: 1,
        opacity: 1,
        color: "black",
        fillOpacity: 0.7,
        fillColor: color
        /*
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: "#FD8D3C"*/
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

    function resetHighlight(e) {
      statesLayer.resetStyle(e.target);
      info.update();
    }

    function selectILDistrict() {
      selectedState = "Illinois";
      map.removeLayer(ILState);
      map.removeLayer(ORDistrict);
      map.removeLayer(ORPrecinct);
      map.removeLayer(OHDistrict);

      map.addLayer(ILDistrict);
      map.addLayer(OHState);
      map.addLayer(ORState);
    }

    function selectORDistrict() {
      selectedState = "Oregon";
      map.removeLayer(ORState);
      map.removeLayer(ILDistrict);
      map.removeLayer(ILPrecinct);
      map.removeLayer(OHDistrict);
      //       map.removeLayer(OH_precinct);

      map.addLayer(ORDistrict);
      map.addLayer(ILState);
      map.addLayer(OHState);
    }

    function selectOHDistrict() {
      selectedState = "Ohio";
      map.removeLayer(OHState);
      map.removeLayer(ORDistrict);
      map.removeLayer(ORPrecinct);
      map.removeLayer(ILDistrict);
      map.removeLayer(ILPrecinct);

      map.addLayer(OHDistrict);
      map.addLayer(ORState);
      map.addLayer(ILState);
    }

    function zoomToFeature(e) {
      let name = e.target.feature.properties.name;
      if (name == "Illinois") {
        //loadILDistrict();
        selectILDistrict();
      } else if (name == "Oregon") {
        //loadORDistrict();
        selectORDistrict();
      } else if (name == "Ohio") {
        //loadOHDistrict();
        selectOHDistrict();
      } else if (name == undefined) {
        //distrcts doesn't have name, they only have id
        if (selectedState == "Illinois") {
          //loadILPrecinct();
          map.removeLayer(ILDistrict);
          map.addLayer(ILPrecinct);
        } else if (selectedState == "Oregon") {
          //loadORPrecinct();
          map.removeLayer(ORDistrict);
          map.addLayer(ORPrecinct);
        } else if (selectedState == "Ohio") {
          //loadOHPrecinct();
          map.removeLayer(OHDistrict);
          map.addLayer(OHPrecinct);
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

    map.attributionControl.addAttribution(
      'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
    );
  }
}
