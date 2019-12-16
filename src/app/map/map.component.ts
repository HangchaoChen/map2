import { StateInfo } from "./../state.info";
import { Color } from "./../colors";
import { MapService } from "./../map.service";
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as L from "leaflet";
import "leaflet-ajax";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  @Input() selectedState: String;

  constructor(private http: HttpClient, private mapService: MapService) {}

  IL = "Illinois";
  OH = "Ohio";
  OR = "Oregon";
  state_info = new StateInfo();
  state_voting_data = this.state_info.get_voting_data();

  stateName;
  selected_year;
  p1Data;
  p2Data;
  id_map = new Map();

  load_voting_data(data) {
    let url =
      "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/States_Voting_Data.json";
    this.http.get(url).subscribe((json: any) => {
      data = json;
      // console.log("state data loaded: ", data["Illinois"]);
    });
  }

  load_p1_data(data) {
    let url =
      // "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/newdatap1.json";
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/newdatap1.json";
    this.http.get(url).subscribe((json: any) => {
      data = json.result.clusters;
      this.p1Data = json.result.clusters;
      console.log("data loaded", this.p1Data);
      console.log(typeof this.p1Data);
      let x;
      for (var key of Object.keys(this.p1Data)) {
        x = this.stringToColour(key);
        for (let i = 0; i < this.p1Data[key].length; i++) {
          this.id_map.set(this.p1Data[key][i], x);
        }
      }
    });
  }

  changeState(stateName) {
    this.mapService.changeState(stateName);
  }

  stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  }

  ngOnInit() {
    var p1_data;
    var selectedState;
    var selected_year = this.selected_year;
    var id_map = this.id_map;
    this.mapService.changeYear("CONGRESSIONAL_2018");
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
    var overlayMaps = {};
    var baseLayer;
    var color_generator = new Color();
    var state_voting_data = this.state_voting_data;
    var first_p1 = true;

    var addedOHDistrict = false;
    var addedORDistrict = false;
    var addedILDistrict = false;
    var addedOHPrecinct = false;
    var addedORPrecinct = false;
    var addedILPrecinct = false;

    var map = L.map("map").setView([37.8, -96], 4);

    var baseLayer = L.control
      .layers(null, overlayMaps, { position: "bottomleft" })
      .addTo(map);

    var colors;

    // var colors = [
    //   "Aquamarine",
    //   "IndianRed",
    //   "DeepSkyBlue",
    //   "DarkSlateGray",
    //   "BlueViolet",
    //   "SlateGray",
    //   "YellowGreen",
    //   "Gray",
    //   "DimGray",
    //   "Silver",
    //   "MistyRose",
    //   "Azure",
    //   "Olive",
    //   "Peru",
    //   "SandyBrown",
    //   "Sienna",
    //   "Cornsilk",
    //   "Navy",
    //   "CadetBlue",
    //   "Gold",
    //   "Moccasin",
    //   "OrangeRed",
    //   "Indigo",
    //   "Fuchsia",
    //   "HotPink"
    // ];

    //this.load_p1_data(p1_data);

    let changeState = stateName => {
      this.changeState(stateName);
    };

    let update_map = (data, layer) => {
      let done = data["result"].isFinal;
      //console.log("is it done?: ", done);

      // if (first_p1) {
      //   this.p1Data = data["result"].clusters;
      //   first_p1 = false;
      // } else {
      this.p1Data = data.result.clusters;
      //}

      for (var key of Object.keys(this.p1Data)) {
        let x = Math.floor(Math.random() * Math.floor(18)); // change color
        //console.log("x: ", x);
        for (let i = 0; i < this.p1Data[key].length; i++) {
          this.id_map.set(this.p1Data[key][i], colors[x]); // change color
        }
      }

      id_map = this.id_map;
      layer.eachLayer(layers => {
        let id = layers.feature.properties.id;
        if (this.id_map.has(id)) {
          layers.setStyle({
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.7,
            color: id_map.get(id),
            fillColor: id_map.get(id)
          });
        }
      });

      //change properties if it's done
      // if (done) {
      //   let i = 0;
      //   let cluster_id_to_district_id = new Map();
      //   for (var key of Object.keys(this.p1Data)) {
      //     for (let i = 0; i < this.p1Data[key].length; i++) {
      //       cluster_id_to_district_id.set(this.p1Data[key][i], i); // change color
      //     }
      //     i++;
      //   }
      //   layer.eachLayer(layers => {
      //     let id = layers.feature.properties.id;
      //     layers.feature.properties.id = cluster_id_to_district_id.get(id);
      //   });
      // }

      this.mapService.change_p1_status(done);
      this.mapService.change_p1_color_status(true);
    };

    let update_map_p2 = (data, layer) => {
      let done = data["result"].isFinal;

      // if (first_p1) {
      //   this.p1Data = data["result"].clusters;
      //   first_p1 = false;
      // } else {
      this.p2Data = data.result.clusters;
      //}

      for (var key of Object.keys(this.p1Data)) {
        let x = "#" + color_generator.get_random_color(key);
        //console.log("x: ", x);
        for (let i = 0; i < this.p2Data[key].length; i++) {
          this.id_map.set(this.p2Data[key][i], x);
        }
      }
      id_map = this.id_map;
      layer.eachLayer(layers => {
        let id = layers.feature.properties.id;
        if (this.id_map.has(id)) {
          layers.setStyle({
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.7,
            color: id_map.get(id),
            fillColor: id_map.get(id)
          });
        }
      });
      this.mapService.change_p2_status(done);
      this.mapService.change_p2_color_status(true);
    };

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

    async function loadStates() {
      ILState = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/State%20GeoJSON/IL_State.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
      map.addLayer(ILState);
      OHState = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/State%20GeoJSON/OH_State.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
      map.addLayer(OHState);
      ORState = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/State%20GeoJSON/OR_State.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
      map.addLayer(ORState);

      statesLayer = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/States.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadILDistrict() {
      ILDistrict = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/District%20GeoJSON/IL_District.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    //geojson updated
    function loadILPrecinct() {
      ILPrecinct = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/Precinct%20GeoJSON/IL_Precinct.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    //done
    function loadORDistrict() {
      ORDistrict = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/District%20GeoJSON/OR_District.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    function loadORPrecinct() {
      ORPrecinct = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/Precinct%20GeoJSON/OR_Precinct.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    //done
    function loadOHDistrict() {
      OHDistrict = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/District%20GeoJSON/OH_District.json",
        {
          style: style,
          onEachFeature: onEachFeature
        }
      );
    }

    //geojson updated
    function loadOHPrecinct() {
      OHPrecinct = L.geoJson.ajax(
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/Precinct%20GeoJSON/OH_Precinct.json",
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

    map.on("zoomend", () => {
      //console.log("zoom level :", map.getZoom());
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
          map.removeLayer(OHPrecinct);
          addedOHDistrict = false;
          addedOHPrecinct = false;
          map.removeLayer(ORDistrict);
          map.removeLayer(ORPrecinct);
          addedORDistrict = false;
          addedORPrecinct = false;
          map.removeLayer(ILDistrict);
          map.removeLayer(ILPrecinct);
          addedILPrecinct = false;
          addedILDistrict = false;
          map.addLayer(OHState);
          map.addLayer(ORState);
          map.addLayer(ILState);
          baseLayer.removeLayer(OHDistrict);
          baseLayer.removeLayer(OHPrecinct);
          baseLayer.removeLayer(ORDistrict);
          baseLayer.removeLayer(ORPrecinct);
          baseLayer.removeLayer(OHDistrict);
          baseLayer.removeLayer(OHPrecinct);
        }
      }
    });

    info.update = function(props) {
      //console.log(props);
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
      let others = -1;
      let winner = "";
      let vote = "vote_" + selected_year;
      if (props != undefined) {
        let state = props.STATEFP;
        id = props.id;
        // if (id == undefined) {
        //   id = props.CD116FP == undefined ? -1 : props.props.CD116FP;
        // }
        total = parseInt(props.demographic["Total"]);
        white = parseInt(props.demographic["White"]);
        black = parseInt(props.demographic["Black or African American"]);
        indian = parseInt(
          props.demographic["American Indian and Alaska Native"]
        );
        asian = parseInt(props.demographic["Asian"]);
        other = parseInt(props.demographic["Some Other Race"]);
        two_race = parseInt(props.demographic["Two or more races"]);
        republic = parseInt(props[vote].Republican);
        democratic = parseInt(props[vote].Democratic);
        others = parseInt(props[vote].Others);
        winner = props[vote].winner;
        //winner = winner.charAt(0).toUpperCase() + winner.slice(1);
      } else if (selectedState) {
        id = state_voting_data[selectedState].name;
        total = parseInt(
          state_voting_data["" + selectedState].demographic["Total"]
        );
        white = parseInt(
          state_voting_data["" + selectedState].demographic["White"]
        );
        black = parseInt(
          state_voting_data["" + selectedState].demographic[
            "Black or African American"
          ]
        );
        indian = parseInt(
          state_voting_data["" + selectedState].demographic[
            "American Indian and Alaska Native"
          ]
        );
        asian = parseInt(
          state_voting_data["" + selectedState].demographic["Asian"]
        );
        other = parseInt(
          state_voting_data["" + selectedState].demographic["Some Other Race"]
        );
        two_race = parseInt(
          state_voting_data["" + selectedState].demographic["Two or more races"]
        );
        republic = parseInt(
          state_voting_data["" + selectedState][vote].republican
        );
        democratic = parseInt(
          state_voting_data["" + selectedState][vote].democratic
        );
        others = parseInt(state_voting_data["" + selectedState][vote].others);
        winner = state_voting_data["" + selectedState][vote].winner;
        winner = winner.charAt(0).toUpperCase() + winner.slice(1);
      }

      this._div.innerHTML = `<h4>Demographic Data</h4> ${
        props &&
        props.name != undefined &&
        (props.name == OH || props.name == IL || props.name == OR)
          ? "<b>" +
            props.name +
            "</b><br />" +
            "Total Population : " +
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
            "Mixed Race : " +
            (two_race == -1 ? "" : two_race) +
            "<br/>" +
            "Others : " +
            (other == -1 ? "" : other) +
            "<br/>" +
            "<br/>" +
            "<h4>Voting data</h4>" +
            "Republican : " +
            (republic == -1 ? "" : republic) +
            "<br/>" +
            "Democratic : " +
            (democratic == -1 ? "" : democratic) +
            "<br/>" +
            "Winner Party : " +
            (winner == "" ? "" : winner) +
            "<br/>"
          : "ID: " +
            (id == -1 ? "" : id) +
            "<br />" +
            "Total Population : " +
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
            "Mixed Race : " +
            (two_race == -1 ? "" : two_race) +
            "<br/>" +
            "Others : " +
            (other == -1 ? "" : other) +
            "<br/>" +
            "<br/>" +
            "<h4>Voting data</h4>" +
            "Republican : " +
            (republic == -1 ? "" : republic) +
            "<br/>" +
            "Democratic : " +
            (democratic == -1 ? "" : democratic) +
            "<br/>" +
            "Winner Party : " +
            (winner == "" ? "" : winner) +
            "<br/>"
      }`;
    };

    info.addTo(map);

    function style(feature) {
      //console.log("color: ", feature);
      let district = feature.properties.NAMELSAD;
      let id = feature.properties.id;
      // console.log("id: ", id);
      let color = "White";
      if (district !== undefined) {
        color = colors[id - 1];
      }
      //console.log("feature: ", feature);

      return {
        weight: 1,
        opacity: 0.7,
        color: color,
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
      let id = e.target.feature.properties.id;
      // console.log("id: ", id);
      // console.log("id map: ", id_map);
      //console.log("e.target: ", e.target.feature.properties.id);
      if (id_map.has(id)) {
        e.target.setStyle({
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.7,
          color: id_map.get(id),
          fillColor: id_map.get(id)
        });
      }
      info.update();
    }

    function selectILDistrict() {
      selectedState = IL;
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
      baseLayer.addBaseLayer(ILDistrict, "Original");
      baseLayer.addBaseLayer(ILPrecinct, "Current");
    }

    function selectORDistrict() {
      selectedState = OR;
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
      baseLayer.addBaseLayer(ORDistrict, "Original");
      baseLayer.addBaseLayer(ORPrecinct, "Current");
    }

    function selectOHDistrict() {
      selectedState = OH;
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
      baseLayer.addBaseLayer(OHDistrict, "Original");
      baseLayer.addBaseLayer(OHPrecinct, "Current");
    }

    function zoomToFeature(e) {
      let name = e.target.feature.properties.name;
      //console.log("name: ", e.target.feature);
      if (name == "Illinois") {
        changeState(IL);
        map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
      } else if (name == "Oregon") {
        changeState(OR);
        map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
      } else if (name == "Ohio") {
        changeState(OH);
        map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
      } else {
        //distrcts doesn't have name, they only have id
        if (selectedState == "Illinois") {
          addILPrecinct();
        } else if (selectedState == "Oregon") {
          addORPrecinct();
        } else if (selectedState == "Ohio") {
          addOHPrecinct();
        }
        map.fitBounds(e.target.getBounds());
      }
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

    this.mapService.selectedState.subscribe(stateName => {
      //console.log("changing state name: ", stateName);
      if (stateName == this.OH) {
        selectedState = OH;
        this.stateName = selectedState;
        statesLayer.eachLayer(layer => {
          if (layer.feature.properties.name == stateName) {
            selectOHDistrict();
            map.flyToBounds(layer, { maxZoom: 6 });
            info.update(layer.feature.properties);
          }
        });
        // OHPrecinct.eachLayer(layer => {
        //   //console.log("~~~~~~coloring precinct level~~~~~~~~");
        //   let id = layer.feature.properties.id;
        //   if (id_map.has(id)) {
        //     layer.setStyle({
        //       weight: 1,
        //       opacity: 0.7,
        //       fillOpacity: 0.7,
        //       color: id_map.get(id),
        //       fillColor: id_map.get(id)
        //     });
        //   }
        //   console.log("~~~~~~~~~~~~coloring done~~~~~~~~~");
        // });
        baseLayer.removeLayer(ORDistrict);
        baseLayer.removeLayer(ORPrecinct);
        baseLayer.removeLayer(ILDistrict);
        baseLayer.removeLayer(ILPrecinct);
      } else if (stateName == this.IL) {
        selectedState = IL;
        this.stateName = selectedState;
        statesLayer.eachLayer(layer => {
          if (layer.feature.properties.name == stateName) {
            selectILDistrict();
            map.flyToBounds(layer, { maxZoom: 6 });
            info.update(layer.feature.properties);
          }
        });
        baseLayer.removeLayer(ORDistrict);
        baseLayer.removeLayer(ORPrecinct);
        baseLayer.removeLayer(OHDistrict);
        baseLayer.removeLayer(OHPrecinct);
      } else if (stateName == this.OR) {
        selectedState = OR;
        this.stateName = selectedState;
        statesLayer.eachLayer(layer => {
          if (layer.feature.properties.name == stateName) {
            selectORDistrict();
            map.flyToBounds(layer, { maxZoom: 6 });
            info.update(layer.feature.properties);
          }
        });
        baseLayer.removeLayer(OHDistrict);
        baseLayer.removeLayer(OHPrecinct);
        baseLayer.removeLayer(ILDistrict);
        baseLayer.removeLayer(ILPrecinct);
      }
    });
    this.mapService.selectedYear.subscribe(year => {
      this.selected_year = year;
      selected_year = this.selected_year;
      statesLayer.eachLayer(layer => {
        // console.log("t1: ", layer.feature.properties.name);
        // console.log("t2: ", this.stateName);
        if (layer.feature.properties.name == this.stateName) {
          // console.log("update?: ", this.stateName);
          info.update(layer.feature.properties);
        }
      });
      this.id_map.clear();
      id_map.clear();
      id_map = this.id_map;
    });
    this.mapService.p2_data.subscribe(data => {
      if (selectedState == this.OH) {
        update_map_p2(data, OHPrecinct);
      } else if (selectedState == this.IL) {
        update_map_p2(data, ILPrecinct);
      } else if (selectedState == this.OR) {
        update_map_p2(data, ORPrecinct);
      }
    });

    this.mapService.p1_data.subscribe(data => {
      if (selectedState == this.OH) {
        update_map(data, OHPrecinct);
        // let done = data["result"].isFinal;
        // this.p1Data = data["result"].clusters;
        // for (var key of Object.keys(this.p1Data)) {
        //   let x = this.stringToColour(key);
        //   for (let i = 0; i < this.p1Data[key].length; i++) {
        //     this.id_map.set(this.p1Data[key][i], x);
        //   }
        // }
        // id_map = this.id_map;
        // OHPrecinct.eachLayer(layer => {
        //   let id = layer.feature.properties.id;
        //   if (this.id_map.has(id)) {
        //     layer.setStyle({
        //       weight: 1,
        //       opacity: 0.7,
        //       fillOpacity: 0.7,
        //       color: id_map.get(id),
        //       fillColor: id_map.get(id)
        //     });
        //   }
        // });
        // this.mapService.change_p1_status(done);
        // this.mapService.change_p1_color_status(true);
      } else if (selectedState == this.IL) {
        update_map(data, ILPrecinct);
      } else if (selectedState == this.OR) {
        update_map(data, ORPrecinct);
      }
    });

    function update_theme_color(data_layer) {
      let new_color = "";
      data_layer.eachLayer(layer => {
        let id = layer.feature.properties.id;
        new_color = colors[id - 1];
        layer.setStyle({
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.7,
          color: new_color,
          fillColor: new_color
        });
      });
    }
    this.mapService.color_theme.subscribe(color => {
      colors = color_generator.get_theme_color(color);
      // console.log("color changed: ", color);
      // console.log(colors);
      update_theme_color(ILDistrict);
      update_theme_color(OHDistrict);
      update_theme_color(ORDistrict);
    });
  }
}
