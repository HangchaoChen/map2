import { HttpClient, HttpParams } from "@angular/common/http";
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

  selectedYear = "";
  polulationThreshold = 0;
  partyThreshold = 0;
  formatterPercent = (value: number) => `${value} %`;

  loadP0data() {
    let url =
      "https://raw.githubusercontent.com/HangchaoChen/States_GeoJSON/master/ohio_p0.json";
    this.http.get(url).subscribe((json: any) => {
      //console.log(json.result["Eligible Blocs"]);
      this.listOfData = json.result["Eligible Blocs"];
    });
  }

  listOfData;

  onClickApply() {
    // console.log("year", this.selectedYear);
    // console.log("poluation t ", this.polulationThreshold / 100);
    // console.log(" party t ", this.partyThreshold / 100);
    // console.log("state name: ", this.stateName.toLowerCase());
    // console.log("calling post ");
    let url = "http://localhost:8080/setting/phase0";
    let params = new HttpParams()
      .set("stateName", this.stateName.toLowerCase())
      .set("election", this.selectedYear)
      .set("populationThreshold", "" + this.polulationThreshold / 100)
      .set("blocThreshold", "" + this.partyThreshold / 100);
    this.http.get(url, { params: params }).subscribe((json: any) => {
      //console.log("done: ", json);
      this.listOfData = json.result["Eligible Blocs"];
    });
  }

  ngOnInit() {
    this.loadP0data();

    this.mapService.selectedState.subscribe(stateName => {
      this.stateName = stateName;
    });
  }
}
