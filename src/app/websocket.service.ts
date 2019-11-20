import { Injectable } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import $ from "jquery";

@Injectable({
  providedIn: "root"
})
export class WebsocketService {
  private serverUrl = "http://localhost:8080/socket";
  private stompClient;

  constructor() {
    this.initializeWebSocketConnection();
  }
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
}
