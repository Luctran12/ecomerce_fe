import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const storeId = localStorage.getItem("storeId"); // Lấy storeId từ localStorage

const StoreNotification = () => {
  const stompClientRef = useRef(null); // Dùng useRef để giữ stompClient giữa các lần render

  useEffect(() => {
    if (!storeId) {
      console.warn("Không tìm thấy storeId, không thể đăng ký nhận thông báo!");
      return;
    }

    const socket = new SockJS("http://localhost:8389/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu bị ngắt
      onConnect: () => {
        console.log("Kết nối WebSocket thành công!");
        client.subscribe(`/topic/store/${storeId}`, (message) => {
          alert(`🔔 Thông báo: ${message.body}`);
        });
      },
      onStompError: (frame) => {
        console.error("Lỗi STOMP: ", frame.headers["message"]);
      },
    });

    client.activate(); // Kích hoạt WebSocket
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  return null;
};

export default StoreNotification;
