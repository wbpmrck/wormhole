/**
 * Really only need 1 example...
 */


// Server
var
    wormhole = require('../lib/wormhole'),
    net = require('net'),
    stdin = process.stdin;
var dump = require('sys').inspect;

net.createServer(function(conn) {
    wormhole(conn, function(msg) {
        console.log("SERVER: Got message: ", dump(msg));
        conn.write({result: parseInt(msg.input) + 10});
    });
}).listen(function() {
  console.log("Server listening");
  
  // Client
  var client = net.createConnection(this.address().port)
  client.on('connect', function() {
    console.log("Client connected to server");
    wormhole(client, function(msg) {
      console.log("CLIENT: Got message: ", dump(msg));
      console.log("Server responded to client with: ", msg.result);
    });
    
    process.stdin.resume();
    process.stdin.on('data', function (data) {
      data = data.toString().trim();
      console.log("asking server to do 10 + " + data);
      client.write({    
        input: data
      })
    });
  });
});
