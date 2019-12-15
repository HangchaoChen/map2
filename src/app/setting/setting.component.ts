import { StateInfo } from "./../state.info";
import { MapService } from "./../map.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.css"]
})
export class SettingComponent implements OnInit {
  constructor(private http: HttpClient, private mapService: MapService) {}

  stateName: string;
  IL = "Illinois";
  OH = "Ohio";
  OR = "Oregon";

  state_info = new StateInfo();

  weight_enum = this.state_info.get_weight_enum();

  selectedYear;

  numberOfDistrict;

  Reock_Compactness = 0;
  Convex_Hull_Compactness = 0;
  Edge_Compactness = 0;
  Gerrymander_Republican = 0;
  Gerrymander_Democrat = 0;
  Partisan_Fairness = 0;
  Efficiency_Gap = 0;
  Competitiveness = 0;
  Population_Homogeneity = 0;
  Population_Equality = 0;

  updateBehavior = false;

  show_next = false;

  done = false;

  apply_done = false;

  running_p1 = false;

  setting_has_error = false;

  weights = [
    this.Reock_Compactness,
    this.Convex_Hull_Compactness,
    this.Edge_Compactness,
    this.Gerrymander_Republican,
    this.Gerrymander_Democrat,
    this.Partisan_Fairness,
    this.Efficiency_Gap,
    this.Competitiveness,
    this.Population_Homogeneity,
    this.Population_Equality
  ];

  change_year() {
    this.mapService.changeYear(this.selectedYear);
    //console.log("changing selected year from setting: ", this.selectedYear);
  }

  onClickSwitch() {
    //console.log("update switch");
    this.updateBehavior = !this.updateBehavior;
  }
  onClickApply() {
    console.log("state name: ", this.stateName);
    console.log("year: ", this.selectedYear);
    console.log("numberOfDistrict: ", this.numberOfDistrict);
    console.log("update: ", this.updateBehavior);

    let w = new Map();
    this.weights = [
      this.Reock_Compactness,
      this.Convex_Hull_Compactness,
      this.Edge_Compactness,
      this.Gerrymander_Republican,
      this.Gerrymander_Democrat,
      this.Partisan_Fairness,
      this.Efficiency_Gap,
      this.Competitiveness,
      this.Population_Homogeneity,
      this.Population_Equality
    ];
    for (let i = 0; i < this.weights.length; i++) {
      if (this.weights[i] > 0) {
        // console.log(
        //   this.weight_enum[i].toString(),
        //   " is added, value is : ",
        //   this.weights[i]
        // );
        w.set(this.weight_enum[i].toString(), this.weights[i] / 100);
        // console.log("added to w", w);
      }
    }
    console.log("weights: ", w);
    // console.log("target group: ", this.listOfSelectedValue);
    // console.log("is combined: ", this.is_combined);
    // console.log("max :", this.max);
    // console.log("min ", this.min);

    let url = "http://localhost:8080/setting/phase1Param";

    let header = new HttpHeaders().set("Content-Type", "application/json");

    let body = {
      stateName: this.stateName,
      weights: w,
      targetDistricts: this.numberOfDistrict,
      updateDiscrete: true,
      election: this.selectedYear,
      targetMinorityPopulation: "AFRICAN_AMERICAN"
    };
    this.apply_done = true;
    this.http.post(url, body, { headers: header }).subscribe(
      (result: any) => {
        console.log("post request send: ", result);
        this.apply_done = false;
        this.setting_has_error = false;
      },
      err => {
        console.log("error?", err);
        this.apply_done = false;
        this.setting_has_error = true;
      }
    );
  }
  onClickRunP1() {
    console.log("run p1");
    let url = "http://localhost:8080/setting/phase1";

    let header = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    this.http.post(url, { headers: header }).subscribe((result: any) => {
      this.mapService.set_p1_data(result);
      let done = result["result"].isFinal;
    });
    //this.auto_run();
    if (this.updateBehavior) {
      this.show_next = true;
    }
  }

  onClickRunP2() {
    let url = "http://localhost:8080/setting/phase2";
    let header = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    var connection = this.http
      .post(url, { headers: header })
      .subscribe((result: any) => {
        this.mapService.set_p1_data(result);
        let done = result["result"].isFinal;
        connection.unsubscribe();
        return done;
      });
  }

  auto_run() {
    console.log("auto run");
    let url = "http://localhost:8080/setting/phase1";
    let header = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    var connection = this.http
      .post(url, { headers: header })
      .subscribe((result: any) => {
        this.mapService.set_p1_data(result);
        let done = result["result"].isFinal;
        connection.unsubscribe();
        return done;
      });
  }

  onClickNext() {
    let url = "http://localhost:8080/setting/phase1";

    let header = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    this.http.post(url, { headers: header }).subscribe((result: any) => {
      this.mapService.set_p1_data(result);
      console.log("next .set p1: ", result);
    });
  }

  ngOnInit() {
    this.mapService.selectedState.subscribe(stateName => {
      this.stateName = stateName;
      if (
        stateName == this.IL ||
        stateName == this.OH ||
        stateName == this.OR
      ) {
        //console.log("state name: ", stateName);
      }
    });
    this.mapService.selectedYear.subscribe(year => {
      this.selectedYear = year;
      //console.log("in setting, year change received: ", this.selectedYear);
    });

    this.mapService.p1_color_status.subscribe(status => {
      //console.log("test: ", status);
      if (status && !this.updateBehavior) {
        // if (!this.done) {
        this.auto_run();
        //   this.running_p1 = true;
        // } else {
        //   this.running_p1 = false;
        // }
      }
    });

    this.mapService.p1_status.subscribe(status => {
      //console.log("changing done");
      this.done = status;
    });
  }
}
