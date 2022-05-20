const uWS = require('uWebSockets.js');

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');


const field = [
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]];
const room = [];
let users = 0;
let rooms = -1;

const setTile = (row, col, title, field) => {
  field[row][col] = title;
  const res = checkVictory(field);
  return res;
}

const checkVictory = (field) => {
  let result = { flagVictory: false, line: null, startCol: null, startRow: null, finishCol: null, finishRow: null };
  const checkDiag1 = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (col + count_max < 20 && row + count_max < 20 && field[row + count_max][col + count_max] === titl) {
      count_max++;
    }
    if (count_max > 4)
      return true;

  }
  const checkDiag2 = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (col + count_max < 20 && row - count_max >= 0 && field[row - count_max][col + count_max] === titl) {
      count_max++;
    }
    if (count_max > 4)
      return true;

  }

  const checkHor = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (col + count_max < 20 && field[row][col + count_max] === titl) {
      count_max++;
    }
    if (count_max > 4)
      return true;
  }

  const checkVer = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (row + count_max < 20 && field[row + count_max][col] === titl) {
      count_max++;
    }
    if (count_max > 4)
      return true;

  }

  if (field.length > 0) {
    cicle: for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (field[i][j] === "X" || field[i][j] === "O") {
          if (checkHor(i, j)) {
            result = { flagVictory: true, line: 0, startCol: j, startRow: i, finishCol: j + 5, finishRow: i }
            break cicle;
          }
          if (checkVer(i, j)) {
            result = { flagVictory: true, line: 1, startCol: j, startRow: i, finishCol: j, finishRow: i + 5 }
            break cicle;
          }
          if (checkDiag1(i, j)) {
            result = { flagVictory: true, line: 2, startCol: j, startRow: i, finishCol: j + 5, finishRow: i + 5 }
            break cicle;
          }
          if (checkDiag2(i, j)) {
            result = { flagVictory: true, line: 3, startCol: j, startRow: i, finishCol: j + 5, finishRow: i - 5 }
            break cicle;
          }

        }
      }
    }
  }
  return result;
}


const app = uWS.App().ws('/*', {
  // handle messages from client
  message: (socket, message, isBinary) => {
    // parse JSON and perform the action
    let json = JSON.parse(decoder.write(Buffer.from(message)));
    switch (json.action) {
      case 'join': {
        users++;
        if (users % 2 == 1) {
          user = json.user === "Player" || json.user === "Player X" || json.user === "Player O" ? "Player X" : json.user;
          let fiel = field.map((item) => {
            return [...item]
          })
          rooms++;
          room.push({ s1: socket, s2: null, user1: user, room: rooms, field: fiel, step: 0, user2: "" })
          socket.subscribe(String(rooms));
          socket.send(JSON.stringify({ answer: "join", room: rooms, user: user }));
        }
        else {
          user = json.user === "Player" || json.user === "Player X" || json.user === "Player O" ? "Player O" : json.user;
          const r = room.length - 1;
          room[r].user2 = user;
          room[r].s2 = socket;

          socket.subscribe(String(rooms));
          socket.send(JSON.stringify({ answer: "join", room: rooms, user: user }));
          app.publish(String(rooms), JSON.stringify({ answer: "joinpub", u1: room[r].user1, u2: room[r].user2, nextUser: room[r].user1, field: room[r].field }));
        }
        break;
      }
      case 'step': {
        //find userroom 
        let numRoom = -1;
        room.forEach((el, idx) => {
          if (el.room === json.room)
            numRoom = idx;
        })
        if (numRoom >= 0) {
          let result = { flagVictory: false, line: null, startCol: null, startRow: null, finishCol: null, finishRow: null };
          //set tile title and check victory
          if (room[numRoom].step % 2 === 0 && room[numRoom].user1 === json.user) {
            result = setTile(json.row, json.col, "X", room[numRoom].field)
          }
          if (room[numRoom].step % 2 === 1 && room[numRoom].user2 === json.user) {
            result = setTile(json.row, json.col, "O", room[numRoom].field)
          }
          //send result
          room[numRoom].step++;
          const nextUser = room[numRoom].step % 2 === 0 ? room[numRoom].user1 : room[numRoom].user2;
          app.publish(String(json.room), JSON.stringify({ answer: "step", nextUser: nextUser, field: room[numRoom].field }));

          if (result.flagVictory) {
            app.publish(String(json.room), JSON.stringify({ answer: "victory", user: json.user, coord: result }))
          }
        }
        break;
      }
      case 'exit': {
        let numRoom = -1;
        room.forEach((el, idx) => {
          if (el.room === json.room)
            numRoom = idx;
        })
        if (numRoom >= 0) {
          if (room[numRoom]) {
            if (room[numRoom].user2 === "") {
              room[numRoom].user1 = "";
              users--;
            }
            else {
              room[numRoom].user2 = "";
              users--
            }
          }
          app.publish(String(json.room), JSON.stringify({ answer: "exit", message: `Player ${json.user} quit the game` }));
          if (room[numRoom].user1 === "" && room[numRoom].user2 === "") {
            room.splice(numRoom, 1);
          }
          // unsubscribe from the said drawing room
          socket.unsubscribe(String(json.room));
          socket.close();
        }
        break;
      }
    }
  },
  close: (socket, code, message) => {
    let numRoom = -1;
    room.forEach((el, idx) => {
      if (el.s1 === socket || el.s2 === socket) {
        numRoom = idx;
      }
    })
    if (numRoom >= 0) {
      if (room[numRoom]) {
        if (room[numRoom].s1 === socket) {
          //disconnection while playing
          if (room[numRoom].user1 !== "") {
            app.publish(String(room[numRoom].room), JSON.stringify({ answer: "exit", message: `${room[numRoom].user1} is out the game` }));
            room[numRoom].user1 = "";
            users--;
          }
        }
        if (room[numRoom].s2 === socket) {
          if (room[numRoom].user2 !== "") {
            app.publish(String(room[numRoom].room), JSON.stringify({ answer: "exit", message: `${room[numRoom].user2} is out the game` }));
            room[numRoom].user2 = "";
            users--;
          }
        }
      }
      if (room[numRoom].user1 === "" && room[numRoom].user2 === "") {
        room.splice(numRoom, 1);
      }
    }
  }
});
// finally listen using the app on port 3000
app.listen(8080, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 8080');
  }
});
