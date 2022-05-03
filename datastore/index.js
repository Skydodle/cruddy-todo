const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, uniqueId) => {
    // create a new todo in its own file
    // fs.writeFile(file, data, options, callback)
    // https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback
    fs.writeFile(path.join(exports.dataDir, `${uniqueId}.txt`), text, (err) => {
      if (err) {
        console.error('no file found');
      } else {
        // server.js line 22 callback is invoked
        callback(null, { id: uniqueId, text: text });
      }
    });
  });
  // items[id] = text;
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.error('game over');
    } else {
      var data = _.map(files, (file) => {
        let id = path.basename(file, '.txt');
        return { id: id, text: id };
      });
      // console.log(data);
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  // id is a string that we can concatenate on *'.txt'
  let fileName = id + '.txt';
  fs.readFile(path.join(exports.dataDir, fileName), 'utf8', (err, todo) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: todo });
    }
  });
};

exports.update = (id, text, callback) => {
  let fileName = id + '.txt';
  fs.readFile(path.join(exports.dataDir, fileName), 'utf8', (err, todo) => {
    if (err) {
      callback(new Error(`Unable to edit ${id} at this time. So sorry. Here's a cookie🍪`));
    } else {
      fs.writeFile(path.join(exports.dataDir, fileName), text, 'utf8', (err, todo) => {
        callback(null, { id: id, text: text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  let fileName = id + '.txt';
  fs.unlink(path.join(exports.dataDir, fileName), err => {
    if (err) {
      // report an error if item not found
      callback(new Error(`Nothing to see here at ${id}`));
    } else {
      callback();
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
