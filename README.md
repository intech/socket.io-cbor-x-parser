# socket.io-cbor-x-parser

An alternative to the default [socket.io-parser](https://github.com/socketio/socket.io-parser), encoding and decoding packets with [cbor-x](https://github.com/kriszyp/cbor-x).

With that parser, the browser build will be a bit heavier (an additional 7.5 KB minified, 3.0 KB gzipped), but each message will be smaller (sent as binary).

Please note that you MUST use the parser on both sides (server & client).

See also:

- the default parser: https://github.com/socketio/socket.io-parser
- a parser based on JSON.stringify/parse: https://github.com/darrachequesne/socket.io-json-parser
- a parser based on Notepack (msgpack): https://github.com/socketio/socket.io-msgpack-parser

## Usage

```js
const io = require('socket.io');
const ioc = require('socket.io-client');
const customParser = require('socket.io-cbor-x-parser');

const server = io(PORT, {
  parser: customParser
});

const socket = ioc('ws://localhost:' + PORT, {
  parser: customParser
});

socket.on('connect', () => {
  socket.emit('hello');
});
```

### Benchmarks
```coffeescript
cbor-x: small json parse x 43,066 ops/sec ±3.39% (77 runs sampled)
msgpack: small json parse x 31,431 ops/sec ±4.18% (52 runs sampled)
cbor-x: big json parse x 1,280 ops/sec ±2.11% (84 runs sampled)
msgpack: big json parse x 521 ops/sec ±1.60% (83 runs sampled)
cbor-x: json with small binary parse x 48,137 ops/sec ±3.10% (78 runs sampled)
msgpack: json with small binary parse x 42,144 ops/sec ±2.74% (71 runs sampled)
cbor-x: json with big binary parse x 1,240 ops/sec ±1.38% (85 runs sampled)
msgpack: json with big binary parse x 514 ops/sec ±1.90% (84 runs sampled)
Fastest is cbor-x: json with small binary parse
```

Benchmark source [here](https://github.com/intech/socket.io-cbor-x-parser/tree/master/bench).
