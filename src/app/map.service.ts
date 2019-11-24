import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MapService {
  private userSelectedState = new BehaviorSubject("");
  selectedState = this.userSelectedState.asObservable();

  constructor() {}

  changeState(stateName: string) {
    this.userSelectedState.next(stateName);
  }
}
