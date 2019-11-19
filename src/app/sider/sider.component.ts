import { Component, OnInit } from "@angular/core";

import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import $ from "jquery";

@Component({
  selector: "app-sider",
  templateUrl: "./sider.component.html",
  styleUrls: ["./sider.component.css"]
})
export class SiderComponent implements OnInit {
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

  openSetting = false;
  showSettings() {
    console.log("show setting");
    this.openSetting = true;
  }
  closeSettings() {
    this.openSetting = false;
  }

  showTables() {
    console.log("show tables");
  }

  onClickApply() {
    console.log("apply clicked");
    this.sendMessage("test");
    console.log("send messgae call");
  }

  //constructor() {}

  ngOnInit() {}
}
