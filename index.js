#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');

function Node(name) {
    this.name = name;
    this.value = 0;
    this.children = {};
}

Node.prototype.add = function(frames, value) {
  this.value += value;
  if(frames && frames.length > 0) {
    var head = frames[0];
    var child = this.children[head];
    if(!child) {
      child = new Node(head);
      this.children[head] = child;
    }
    frames.splice(0, 1);
    child.add(frames, value);
  }
}

program
  .version('0.1.0')
  .option('-i, --input <filename>', 'Select input file.', null)
  .option('-o, --output <filename>', 'Select output file.', null)
  .parse(process.argv);

if (!program.input) program.help(function(t) {
  return '\n  Error: -i --input <filename> is required.\n' + t;
});

fs.readFile(program.input, 'utf8', function (err, data) {
  if (err) throw err;
  var root = new Node('root');
  data.split("\n").map(function (val) {
    var regex = /(.*) (.*)/g;
    var matches = regex.exec(val);
    if(matches) root.add(matches[1].split(";"), parseInt(matches[2]));
  });
  console.log(JSON.stringify(root, null, 2));
});
