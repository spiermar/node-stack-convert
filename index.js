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

Node.prototype.serialize = function() {
  var res = {
    'name': this.name,
    'value': this.value
  }

  var children = []

  for(var key in this.children) {
    children.push(this.children[key].serialize());
  };

  if(children.length > 0) res['children'] = children;

  return res;
}

function convert(filename, options) {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    var root = new Node('root');
    data.split("\n").map(function (val) {
      var regex = /(.*) (.*)/g;
      var matches = regex.exec(val);
      if(matches) root.add(matches[1].split(";"), parseInt(matches[2]));
    });
    var json = JSON.stringify(root.serialize(), null, 2);
    if(options.output) {
      fs.writeFile(options.output, json, function(err) {
        if (err) throw err;
      });
    } else {
      console.log(json);
    }
  });
}

program
  .version('0.2.0')
  .arguments('<filename>')
  .option('-o, --output <filename>', 'Save output to <filename>.')
  .action(convert);

program.parse(process.argv);

if(program.args.length < 1) program.help();
