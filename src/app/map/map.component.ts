import { MapService } from "./../map.service";
import { properties } from "ng-zorro-antd";
import { Component, OnInit, Input } from "@angular/core";
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
  @Input() selectedState: String;

  constructor(private http: HttpClient, private mapService: MapService) {}

  getDistrictURL = "http://localhost:8080/state/getDistrictData";

  IL = "Illinois";
  OH = "Ohio";
  OR = "Oregon";

  stateName;

  async loadDisctrictdata(year, stateName) {
    let url = this.getDistrictURL;
    let result = new Set();
    let params = new HttpParams()
      .set("year", year) // change back to year when backend updated
      .set("state", stateName.toUpperCase());
    await this.http.get(url, { params: params }).subscribe((json: any) => {
      Object.keys(json.result).forEach(index => {
        let info = {
          id: index,
          population: json.result[index].population,
          partyVotes: json.result[index].partyVotes
        };
        result.add(info);
      });
    });
    return result;
  }

  changeState(stateName) {
    this.mapService.changeState(stateName);
  }

  ngOnInit() {
    let changeState = stateName => {
      this.changeState(stateName);
    };
    this.mapService.selectedState.subscribe(stateName => {
      // console.log("user selected from dropdown: ", stateName);
      if (stateName == this.OH) {
        selectedState = OH;
        statesLayer.eachLayer(layer => {
          if (layer.feature.properties.name == stateName) {
            selectOHDistrict();
            map.flyToBounds(layer, { maxZoom: 6 });
          }
        });
      } else if (stateName == this.IL) {
        selectedState = IL;
        statesLayer.eachLayer(layer => {
          if (layer.feature.properties.name == stateName) {
            selectILDistrict();
            map.flyToBounds(layer, { maxZoom: 6 });
          }
        });
      } else if (stateName == this.OR) {
        selectedState = IL;
        statesLayer.eachLayer(layer => {
          if (layer.feature.properties.name == stateName) {
            selectORDistrict();
            map.flyToBounds(layer, { maxZoom: 6 });
          }
        });
      }
    });

    const IL = this.IL;
    const OH = this.OH;
    const OR = this.OR;

    enum StateID {
      ILLINOIS = 17,
      OHIO = 39,
      OREGON = 41
    }

    enum SelectedYear {
      CONGRESSION2016,
      CONGRESSION2018,
      PRESIDENTIANAL2016
    }

    enum Votes {
      DEMOCRATIC,
      OTHERS,
      REPUBLICAN
    }
    var map = L.map("map").setView([37.8, -96], 4);

    var selectedState;
    var ILState;
    var OHState;
    var ORState;
    var statesLayer;
    var ILDistrict;
    var ILPrecinct;
    var ORDistrict;
    var ORPrecinct;
    var OHDistrict;
    var OHPrecinct;

    var addedOHDistrict = false;
    var addedORDistrict = false;
    var addedILDistrict = false;
    var addedOHPrecinct = false;
    var addedORPrecinct = false;
    var addedILPrecinct = false;

    var colors = [
      "Aquamarine",
      "IndianRed",
      "DeepSkyBlue",
      "DarkSlateGray",
      "BlueViolet",
      "SlateGray",
      "YellowGreen",
      "Gray",
      "DimGray",
      "Silver",
      "MistyRose",
      "Azure",
      "Olive",
      "Peru",
      "SandyBrown",
      "Sienna",
      "Cornsilk",
      "Navy",
      "CadetBlue",
      "Gold",
      "Moccasin",
      "OrangeRed",
      "Indigo",
      "Fuchsia",
      "HotPink"
    ];

    function addOHDistrict() {
      if (addedOHPrecinct) {
        map.removeLayer(OHPrecinct);
        addedOHPrecinct = false;
      }
      if (!addedOHDistrict) {
        map.addLayer(OHDistrict);
        addedOHDistrict = true;
      }
    }

    function addORDistrict() {
      if (addedORPrecinct) {
        map.removeLayer(ORPrecinct);
        addedORPrecinct = false;
      }
      if (!addedORDistrict) {
        map.addLayer(ORDistrict);
        addedORDistrict = true;
      }
    }

    function addILDistrict() {
      if (addedILPrecinct) {
        map.removeLayer(ILPrecinct);
        addedILPrecinct = false;
      }
      if (!addedILDistrict) {
        map.addLayer(ILDistrict);
        addedILDistrict = true;
      }
    }

    function addOHPrecinct() {
      if (addedOHDistrict) {
        map.removeLayer(OHDistrict);
        addedOHDistrict = false;
      }
      if (!addedOHPrecinct) {
        map.addLayer(OHPrecinct);
        addedOHPrecinct = true;
      }
    }

    function addORPrecinct() {
      if (addedORDistrict) {
        map.removeLayer(ORDistrict);
        addedORDistrict = false;
      }
      if (!addedORPrecinct) {
        map.addLayer(ORPrecinct);
        addedORPrecinct = true;
      }
    }

    function addILPrecinct() {
      if (addedILDistrict) {
        map.removeLayer(ILDistrict);
        addedILDistrict = false;
      }
      if (!addedILPrecinct) {
        map.addLayer(ILPrecinct);
        addedILPrecinct = true;
      }
    }

    loadStates();

    loadILDistrict();
    loadILPrecinct();
    loadORDistrict();
    loadORPrecinct();
    loadOHDistrict();
    loadOHPrecinct();

    /*
    let year = "CONGRESSION_2016";
    const ORDistrictInfo = this.loadDisctrictdata(year, OR);
    console.log("test loaded data:", ORDistrict);*/

    async function loadStates() {
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
      //statesLayer.addLayer(ILState);
      //statesLayer.addLayer(OHState);
      //statesLayer.addLayer(ORState);
      //map.addLayer(statesLayer);
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
      OHPrecinct = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/OH_map_data.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
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

    map.on("zoomend", () => {
      console.log("zoom level :", map.getZoom());
      if (map.getZoom() > 6) {
        if (selectedState === OH) {
          addOHPrecinct();
        } else if (selectedState === OR) {
          addORPrecinct();
        } else if (selectedState === IL) {
          addILPrecinct();
        }
      } else {
        if (map.getZoom() <= 6 && map.getZoom() > 5) {
          if (selectedState === OH) {
            addOHDistrict();
          } else if (selectedState === OR) {
            addORDistrict();
          } else if (selectedState === IL) {
            addILDistrict();
          }
        } else if (map.getZoom() <= 5) {
          map.removeLayer(OHDistrict);
          addedOHDistrict = false;
          map.removeLayer(ORDistrict);
          addedORDistrict = false;
          map.removeLayer(ILDistrict);
          addedILDistrict = false;
          map.addLayer(OHState);
          map.addLayer(ORState);
          map.addLayer(ILState);
        }
      }
    });

    info.update = function(props) {
      let or = StateID.OREGON;
      let il = StateID.ILLINOIS;
      let oh = StateID.OHIO;
      let id = -1;

      let total = -1;
      let white = -1;
      let black = -1;
      let indian = -1;
      let asian = -1;
      let hawaiian = -1;
      let other = -1;
      let two_race = -1;
      let republic = -1;
      let democratic = -1;
      if (props != undefined) {
        let state = props.STATEFP;
        //console.log("props: ", props);
        id = props.CD116FP;
        if (id == undefined) {
          id = props.id;
        }
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
        props &&
        props.name != undefined &&
        (props.name == OH || props.name == IL || props.name == OR)
          ? "<b>" + props.name + "</b><br />"
          : "ID: " +
            (id == -1 ? "" : id) +
            "<br />" +
            "total population : " +
            (total == -1 ? "" : total) +
            "<br/>" +
            "White : " +
            (white == -1 ? "" : white) +
            "<br/>" +
            "Black & African American : " +
            (black == -1 ? "" : black) +
            "<br/>" +
            "American Indian: " +
            (indian == -1 ? "" : indian) +
            "<br/>" +
            "Asian : " +
            (asian == -1 ? "" : asian) +
            "<br/>" +
            "Native Hawaiian: " +
            (hawaiian == -1 ? "" : hawaiian) +
            "<br/>" +
            "Other : " +
            (other == -1 ? "" : other) +
            "<br/>" +
            "Mixed Race : " +
            (two_race == -1 ? "" : two_race) +
            "<br/>"
      }`;
    };

    info.addTo(map);

    function style(feature) {
      //console.log("color: ", feature);
      let state = feature.properties.STATEFP;
      let district = feature.properties.CD116FP;
      let color = "White";
      if (district !== undefined) {
        color = colors[district - 1];
      }
      /*
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
      }*/

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
      addedORDistrict = false;
      map.removeLayer(ORPrecinct);
      addedORPrecinct = false;
      map.removeLayer(OHDistrict);
      addedOHDistrict = false;
      map.removeLayer(OHPrecinct);
      addedOHPrecinct = false;

      map.addLayer(ILDistrict);
      addedILDistrict = true;
      map.addLayer(OHState);
      map.addLayer(ORState);
    }

    function selectORDistrict() {
      selectedState = "Oregon";
      map.removeLayer(ORState);
      map.removeLayer(ILDistrict);
      addedILDistrict = false;
      map.removeLayer(ILPrecinct);
      addedILPrecinct = false;
      map.removeLayer(OHDistrict);
      addedOHDistrict = false;
      map.removeLayer(OHPrecinct);
      addedOHPrecinct = false;

      map.addLayer(ORDistrict);
      addedORDistrict = true;
      map.addLayer(ILState);
      map.addLayer(OHState);
    }

    function selectOHDistrict() {
      selectedState = "Ohio";
      map.removeLayer(OHState);
      map.removeLayer(ORDistrict);
      addedORDistrict = false;
      map.removeLayer(ORPrecinct);
      addedORPrecinct = false;
      map.removeLayer(ILDistrict);
      addedILDistrict = false;
      map.removeLayer(ILPrecinct);
      addedILPrecinct = false;

      map.addLayer(OHDistrict);
      addedOHDistrict = true;
      map.addLayer(ORState);
      map.addLayer(ILState);
    }

    function zoomToFeature(e) {
      let name = e.target.feature.properties.name;
      if (name == "Illinois") {
        //loadILDistrict();
        changeState(IL);
        //selectILDistrict();
        map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
      } else if (name == "Oregon") {
        //loadORDistrict();
        changeState(OR);
        //selectORDistrict();
        map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
      } else if (name == "Ohio") {
        //loadOHDistrict();
        changeState(OH);
        //selectOHDistrict();
        map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
      } else if (name == undefined) {
        //distrcts doesn't have name, they only have id
        if (selectedState == "Illinois") {
          //loadILPrecinct();
          addILPrecinct();
          map.setZoom(7);
        } else if (selectedState == "Oregon") {
          //loadORPrecinct();
          addORPrecinct();
          map.setZoom(7);
        } else if (selectedState == "Ohio") {
          //loadOHPrecinct();
          addOHPrecinct();
          map.setZoom(7);
        }
      }
      //map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
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
