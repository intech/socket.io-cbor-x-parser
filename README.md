# socket.io-cbor-x-parser

An alternative to the default [socket.io-parser](https://github.com/socketio/socket.io-parser), encoding and decoding packets with [cbor-x](https://github.com/kriszyp/cbor-x).

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

| Test                          | MsgPack (Notepack.io)                   | CBOR-X                                  |
|-------------------------------| --------------------------------------- | --------------------------------------- |
| small json parse              | 31,431 ops/sec ±4.18% (52 runs sampled) | **43,066 ops/sec ±3.39% (77 runs sampled)** |
| big json parse                | 521 ops/sec ±1.60% (83 runs sampled)    | 1,280 ops/sec ±2.11% (84 runs sampled)  |
| json with small binary parse  | 42,144 ops/sec ±2.74% (71 runs sampled) | 48,137 ops/sec ±3.10% (78 runs sampled) |
| json with big binary parse    | 514 ops/sec ±1.90% (84 runs sampled)    | 1,240 ops/sec ±1.38% (85 runs sampled)  |


Benchmark source [here](https://github.com/intech/socket.io-cbor-x-parser/tree/master/bench).
