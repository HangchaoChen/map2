import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MapService } from "../map.service";

@Component({
  selector: "app-phase-zero-setting",
  templateUrl: "./phase-zero-setting.component.html",
  styleUrls: ["./phase-zero-setting.component.css"]
})
export class PhaseZeroSettingComponent implements OnInit {
  constructor(private http: HttpClient, private mapService: MapService) {}

  showTable = false;
  showDistrictTable = false;
  stateName: string;
  IL = "Illinois";
  OH = "Ohio";
  OR = "Oregon";
  selectedYear = "";
  polulationThreshold = 0;
  listOfData;
  District_Voting_Incumbents;
  districtData;
  partyThreshold = 0;
  state_summary: string;
  onTableOpen(): void {
    this.showTable = true;
  }

  onTableClose(): void {
    this.showTable = false;
  }

  onDistrictTableOpen(): void {
    this.showDistrictTable = true;
  }

  onDistrictTableClose(): void {
    this.showDistrictTable = false;
  }

  change_year() {
    console.log("year changed in p0: ", this.selectedYear);
    this.mapService.changeYear(this.selectedYear);
  }

  formatterPercent = (value: number) => `${value} %`;

  loadP0data() {
    let url =
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/ohio_p0.json";
    this.http.get(url).subscribe((json: any) => {
      this.listOfData = json.result["Eligible Blocs"];
      // console.log("p0 data: ", this.listOfData);
    });
  }

  loadVotingIncumbents() {
    let url =
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/representatives_data_2018.json";
    this.http.get(url).subscribe((json: any) => {
      this.District_Voting_Incumbents = json;
    });
  }

  onClickApply() {
    console.log("state name: ", this.stateName.toLowerCase());
    console.log("year", this.selectedYear);
    console.log("poluation t ", this.polulationThreshold / 100);
    console.log(" party t ", this.partyThreshold / 100);
    console.log("calling post ");
    let url = "http://localhost:8080/setting/phase0";
    let header = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    let params = new HttpParams()
      .set("stateName", this.stateName.toLowerCase())
      .set("election", this.selectedYear)
      .set("populationThreshold", "" + this.polulationThreshold / 100)
      .set("blocThreshold", "" + this.partyThreshold / 100);
    console.log("params", params);
    this.http.post(url, params, { headers: header }).subscribe((json: any) => {
      console.log("done: ", json);
      this.listOfData = json.result["Eligible Blocs"];
    });
  }

  ngOnInit() {
    this.loadP0data();
    this.loadVotingIncumbents();
    // console.log("dis: ", this.districtData);
    this.mapService.selectedState.subscribe(stateName => {
      this.stateName = stateName;
      if (
        stateName == this.IL ||
        stateName == this.OH ||
        stateName == this.OR
      ) {
        console.log("state name:~~", stateName);
        this.districtData = this.District_Voting_Incumbents[stateName];
        let summary = stateName + "_Summary";
        this.state_summary = this.District_Voting_Incumbents[summary];
      }
    });
    this.mapService.selectedYear.subscribe(year => {
      console.log("year changed (p0): ", year);
      this.selectedYear = year;
    });
  }
}
