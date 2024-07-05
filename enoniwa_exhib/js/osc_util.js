const capture = function () {
  const port = new osc.WebSocketPort({
    url: "ws://localhost:5500",
  });
  port.open();
  port.send({
    address: "/message",
    args: ["world"],
  });
  console.log("send");
};

export { capture };
