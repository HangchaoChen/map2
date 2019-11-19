import { Component } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import $ from "jquery";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor() {
    this.initializeWebSocketConnection();
  }

  isCollapsed = true;
  title = "map2";

  private serverUrl = "http://192.168.1.57:8080/state";
  private stompClient;

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/precinct", message => {
        console.log("subscribed: ");
        if (message.body) {
          //$(".chat").append("<div class='message'>" + message.body + "</div>");
          console.log("message.body :", message.body);
        }
      });
    });
  }

  sendMessage(message) {
    this.stompClient.send("/state/state/getDistrictGeoJSON", {}, message);
    $("#input").val("");
  }
}
