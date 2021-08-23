const Benchmark = require('benchmark');
// cbor-x
const Cbor = require('..');
// notepack / msgpack
const msgpack = require('socket.io-msgpack-parser');

function test(parser, packet, deferred) {
    const encoder = new parser.Encoder();
    const encodedPackets = encoder.encode(packet);
    const decoder = new parser.Decoder();
    decoder.on('decoded', packet => {
        deferred.resolve();
    });
    for (const encodedPacket of encodedPackets) {
        decoder.add(encodedPacket);
    }
}

const dataObject = [{
    'a': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    'b': 'xxxyyyzzzalsdfalskdjfalksdjfalksdjfalksdjfjjfjfjfjjfjfjfj',
    'data': {
        'is': 'cool',
        'or': {
            'is': {
                'it': true
            }
        }
    }
}];
const bigArray = [];
for (let i = 0; i < 250; i++) {
    bigArray.push(dataObject);
}

const suite = new Benchmark.Suite();

suite
.add('cbor-x: small json parse', {
    defer: true,
    fn: deferred => {
        const packet = {
            type: Cbor.EVENT,
            nsp: 'bench',
            data: dataObject
        };
        test(Cbor, packet, deferred);
    }
})
.add('msgpack: small json parse', {
    defer: true,
    fn: deferred => {
        const packet = {
            type: Cbor.EVENT,
            nsp: 'bench',
            data: dataObject
        };
        test(msgpack, packet, deferred);
    }
})
.add('cbor-x: big json parse', {
    defer: true,
    fn: deferred => {
        const packet = {
            type: Cbor.EVENT,
            nsp: 'bench',
            data: bigArray
        };
        test(Cbor, packet, deferred);
    }
})
.add('msgpack: big json parse', {
    defer: true,
    fn: deferred => {
        const packet = {
            type: Cbor.EVENT,
            nsp: 'bench',
            data: bigArray
        };
        test(msgpack, packet, deferred);
    }
})
.add('cbor-x: json with small binary parse', {
    defer: true,
    fn: deferred => {
        const packet = {
            type: Cbor.BINARY_EVENT,
            nsp: '/bench',
            data: [{'a': [1, 2, 3], 'b': 'xxxyyyzzz', 'data': Buffer.allocUnsafe(1000)}]
        };
        test(Cbor, packet, deferred);
    }
})
.add('msgpack: json with small binary parse', {
    defer: true,
    fn: deferred => {
        const packet = {
            type: Cbor.EVENT,
            nsp: '/bench',
            data: [{'a': [1, 2, 3], 'b': 'xxxyyyzzz', 'data': Buffer.allocUnsafe(1000)}]
        };
        test(msgpack, packet, deferred);
    }
})
.add('cbor-x: json with big binary parse', {
    defer: true,
    fn: deferred => {
        const bigBinaryData = [{
            bin1: Buffer.allocUnsafe(10000),
            arr: bigArray,
            bin2: Buffer.allocUnsafe(10000),
            bin3: Buffer.allocUnsafe(10000)
        }];
        const packet = {
            type: Cbor.BINARY_EVENT,
            nsp: '/bench',
            data: bigBinaryData
        };
        test(Cbor, packet, deferred);
    }
})
.add('msgpack: json with big binary parse', {
    defer: true,
    fn: deferred => {
        const bigBinaryData = [{
            bin1: Buffer.allocUnsafe(10000),
            arr: bigArray,
            bin2: Buffer.allocUnsafe(10000),
            bin3: Buffer.allocUnsafe(10000)
        }];
        const packet = {
            type: Cbor.EVENT,
            nsp: '/bench',
            data: bigBinaryData
        };
        test(msgpack, packet, deferred);
    }
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({'async': true});
