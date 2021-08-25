const browsers = require("socket.io-browsers");

const io = require("socket.io");
const customParser = require(".");
const PORT = 54000;
const server = io(PORT, {
    parser: customParser,
    cors: "*",
});
server.engine.binaryType = "arraybuffer";

server.on("connect", (socket) => {
    socket.on("bye", () => {
        console.log("server bye");
        server.disconnectSockets(true);
        server.close();
    });
    socket.on("test", () => {
        console.log("server on test");
        server.emit("hey", "you");
        console.log("server emit hey you");
    });
    socket.on("ack", (arg1, callback) => {
        console.log("server on ack");
        callback(42);
        console.log("server callback 42");
    });
    socket.on("binary", (buf, callback) => {
        callback(buf);
    });
});

const zuulConfig = module.exports = {
    ui: 'mocha-bdd',

    // test on localhost by default
    local: true,
    open: true,

    concurrency: 2, // ngrok only accepts two tunnels by default
    // if browser does not sends output in 120s since last output:
    // stop testing, something is wrong
    browser_output_timeout: 120 * 1000,
    browser_open_timeout: 60 * 4 * 1000,
    // we want to be notified something is wrong asap, so no retry
    browser_retries: 1,
};

if (process.env.CI === 'true') {
    zuulConfig.local = false;
    zuulConfig.tunnel = {
        type: 'ngrok',
        bind_tls: true
    };
    zuulConfig.browserify = [
        {
            transform: {
                name: "babelify",
                presets: ["@babel/preset-env"]
            }
        }
    ]
}

const isPullRequest = process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST !== 'false';
zuulConfig.browsers = isPullRequest ? browsers.pullRequest : browsers.all;
