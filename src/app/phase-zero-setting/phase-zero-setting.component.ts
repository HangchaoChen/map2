import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-phase-zero-setting",
  templateUrl: "./phase-zero-setting.component.html",
  styleUrls: ["./phase-zero-setting.component.css"]
})
export class PhaseZeroSettingComponent implements OnInit {
  constructor(private http: HttpClient) {}

  showTable = false;

  onTableOpen(): void {
    this.showTable = true;
  }

  onTableClose(): void {
    this.showTable = false;
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
    console.log(this.selectedYear);
    console.log(this.polulationThreshold);
    console.log(this.partyThreshold);
    console.log("calling post ");
    let url = "http://localhost:8080/setting/phase0";
    let params = new HttpParams()
      .set("stateName", "ohio")
      .set("election", "CONGRESSION_2018") // change back to year when backend updated
      .set("populationThreshold", "0.3")
      .set("blocThreshold", "0.2");
    this.http.get(url, { params: params }).subscribe((json: any) => {
      console.log("done: ", json);
    });
  }

  ngOnInit() {
    this.loadP0data();
  }
}
