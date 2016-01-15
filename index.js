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
  }

  if(children.length > 0) res['children'] = children;

  return res;
}

function Profile() {
  this.samples = new Node('root');
  this.stack = null;
  this.name = null;
}

Profile.prototype.openStack = function (name) {
  this.stack = [];
  this.name = name;
}

Profile.prototype.addFrame = function(func, mod) {
  var re = /^\(/g; // Skip process names
  if (!re.test(func)) {
    func = func.replace(';', ':') // replace ; with :
    func = func.replace('<', '') // remove '<'
    func = func.replace('>', '') // remove '>'
    func = func.replace('\'', '') // remove '\''
    func = func.replace('"', '') // remove '"'
    if(func.indexOf('(') !== -1) {
      func = func.substring(0, func.indexOf('(')); // delete everything after '('
    }
    this.stack.unshift(func);
  }
}

Profile.prototype.closeStack = function() {
  this.stack.unshift(this.name);
  this.samples.add(this.stack, 1);
  this.stack = null;
  this.name = null;
}

function Recording() {
  this.profiles = {};
}

Recording.prototype.getProfile = function(timestamp) {
  var profile = this.profiles[timestamp];
  if (!profile) {
    profile = new Profile();
    this.profiles[timestamp] = profile;
  }
  return profile;
}

Recording.prototype.serialize = function () {
  var res = {};
  for(var key in this.profiles) {
    res[key] = this.profiles[key].samples.serialize();
  }
  return res;
}

function raw(filename, live) {
  var recording = new Recording();

  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    var lines = data.split("\n"),
        profile,
        matches,
        re;

    if (!live) {
      profile = new Profile();
    }

    for (var i = 0; i < lines.length; i++) {
      re = /^(\S+\s*?\S*?)\s+(\d+)[\/]?(\d*)\s+\[(\d+)\]\s+(\d+).(\d+)/g;
      matches = re.exec(lines[i]);
      if (matches) {
        if (live) {
          profile = recording.getProfile(matches[5]);
        }
        profile.openStack(matches[1]);
      } else {
        re = /^\s*(\w+)\s*(.+) \((\S*)\)/g;
        matches = re.exec(lines[i]);
        if (matches) {
          profile.addFrame(matches[2], matches[3]);
        } else {
          re = /^$/g;
          matches = re.exec(lines[i]);
          if (matches) {
            profile.closeStack();
          } else {
            re = /^#/g;
            matches = re.exec(lines[i]);
            if (matches) {
              // Comment line. Do nothing.
            } else {
              console.log("Don't know what to do with this: " + lines[i]);
            }
          }
        }
      }
    };
    if (live) {
      res = recording.serialize();
    } else {
      res = profile.samples.serialize();
    }
    console.log(JSON.stringify(res, null, 2));
  });
}

function folded(filename) {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    var root = new Node('root');
    data.split("\n").map(function (val) {
      var regex = /(.*) (.*)/g;
      var matches = regex.exec(val);
      if (matches) root.add(matches[1].split(";"), parseInt(matches[2]));
    });
    console.log(JSON.stringify(root.serialize(), null, 2));
  });
}

program
  .version('0.3.2')
  .arguments('<filename>')
  .option('-f, --folded', 'Input is a folded stack.')
  .option('-l, --live', 'Output includes a timestamp dimension for live flame graphs.')
  .action(function(filename, options) {
    if(options.folded) {
      folded(filename);
    } else if (options.live) {
      raw(filename, true);
    } else {
      raw(filename, false);
    }
  });

program.parse(process.argv);

if(program.args.length < 1) program.help();
