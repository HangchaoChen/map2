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
  state_constitution;
  selected_theme;

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

  change_color_theme() {
    this.mapService.change_color_theme(this.selected_theme);
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

  loadVotingIncumbents(year) {
    let url;
    if (year == "CONGRESSIONAL_2016" || year == "PRESIDENTIAL_2016") {
      url =
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/Representative%20Summary/2016.json";
    } else {
      url =
        "https://raw.githubusercontent.com/HangchaoChen/CSE308_GeoJSON/master/Representative%20Summary/2018.json";
    }
    this.http.get(url).subscribe((json: any) => {
      this.District_Voting_Incumbents = json;
      console.log("voting data reloaded:", this.District_Voting_Incumbents);
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
    //this.loadP0data();
    this.loadVotingIncumbents("");
    // console.log("dis: ", this.districtData);
    this.mapService.selectedState.subscribe(stateName => {
      this.stateName = stateName;
      if (
        stateName == this.IL ||
        stateName == this.OH ||
        stateName == this.OR
      ) {
        //console.log("state name:~~", stateName);
        this.districtData = this.District_Voting_Incumbents[stateName];
        let summary = stateName + "_Summary";
        this.state_summary = this.District_Voting_Incumbents[summary];
        if (stateName == this.IL) {
          this.state_constitution =
            "Please read state constitution before continue: \n" +
            "http://www.ilga.gov/commission/lrb/conmain.htm";
        } else if (stateName == this.OH) {
          this.state_constitution =
            "Please read state constitution before continue: \n" +
            "https://www.legislature.ohio.gov/laws/ohio-constitution";
        } else if (stateName == this.OR) {
          this.state_constitution =
            "Please read state constitution before continue: \n" +
            "https://sos.oregon.gov/blue-book/Pages/state-constitution.aspx";
        } else {
          this.state_constitution = "Select a state to view more info";
        }
      }
    });
    this.mapService.selectedYear.subscribe(year => {
      console.log("year changed (p0): ", year);
      this.selectedYear = year;
    });
  }
}
