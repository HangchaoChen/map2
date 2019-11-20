import { Component, OnInit } from "@angular/core";
//test
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import $ from "jquery";
//

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.css"]
})
export class SettingComponent implements OnInit {
  selectedYear;

  numberOfDistrict;

  weight1 = 1;

  weight2 = 2;

  weight3 = 3;

  updateBehavior = false;

  onClickSwitch() {
    console.log("update switch");
    this.updateBehavior = !this.updateBehavior;
  }
  onClickApply() {
    console.log("year: ", this.selectedYear);
    console.log("numberOfDistrict: ", this.numberOfDistrict);
    console.log("w1: ", this.weight1);
    console.log("w2: ", this.weight2);
    console.log("w3: ", this.weight3);
    console.log("update: ", this.updateBehavior);
    this.sendMessage("test"); //test
  }

  constructor() {
    this.initializeWebSocketConnection();
  }

  private serverUrl = "http://localhost:8080/socket";
  private stompClient;

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/chat", message => {
        console.log("subscribed: ");
        if (message.body) {
          //$(".chat").append("<div class='message'>" + message.body + "</div>");
          console.log("message.body :", message.body);
        }
      });
    });
  }

  sendMessage(message) {
    this.stompClient.send("/app/send/message", {}, message);
    $("#input").val("");
  }

  ngOnInit() {}
}
