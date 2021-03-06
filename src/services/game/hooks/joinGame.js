'use strict';

// src/services/game/hooks/joinGame.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const errors = require('feathers-errors');
const isGameFull = require('../isGameFull');

module.exports = function(options) {
  return function(hook) {
    return hook.app.service('games').get(hook.id)
      .then((game) => {
        console.log(hook.data)
        if(hook.data.PlayerInput !== undefined) return
        if (hook.data.joinGame === false) {
          throw new errors.Forbidden('No JoinGame Info');
        }

        // See Feathers code for available error types
        // https://github.com/feathersjs/feathers-errors/blob/master/src/index.js

        if (isGameFull(game)) {
          throw new errors.Unprocessable('Sorry, this game is full!');
        }

        console.log("I got here")

        const action = hook.data.joinGame ? '$addToSet' : '$pull';
        let data = {};
        data[action] = { playerIds: hook.params.user._id };
        hook.data = data;
      })
  }
}
