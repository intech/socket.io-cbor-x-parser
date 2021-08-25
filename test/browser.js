/* eslint-env mocha */

const customParser = require("..");
const expect = require("expect.js");
const ioc = require("socket.io-client");
const PORT = 54000;
let client = null;
describe("parser", () => {
  it("allows connection", (done) => {
    client = ioc("ws://localhost:" + PORT, {
      parser: customParser,
      reconnection: false,
      perMessageDeflate: false,
    });
    client.on("connect", () => {
      console.log("client connected!");
      done();
    });
  });

  it("supports binary", (done) => {
    const buf = new Uint8Array([116, 101, 115, 116]);
    client.emit("binary", buf, (check) => {
      expect(check).to.eql(buf);
      done();
    });
  });

  it("supports acknowledgements", (done) => {
    client.emit("ack", "question", (answer) => {
      expect(answer).to.eql(42);
      done();
    });
  });

  it("supports broadcasting", (done) => {
    client.on("hey", (arg1) => {
      expect(arg1).to.eql("you");
      done();
    });
    client.emit("test");
  });

  it("close connection", (done) => {
    // debugger;
    client.compress(false).emit("bye");
    client.disconnect();
    done();
  });
});
