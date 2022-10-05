const uWS = require('uWebSockets.js');

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

// эталон для поля
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

const room = []; // массив игровых комнат
let users = 0; // количество игроков зашедших с момента старта
let rooms = -1; // количество комнат созданных с момента старта

// установка значения ячейки
const setTile = (row, col, title, field) => {
  field[row][col] = title;
  const res = checkVictory(field); // проверка на победу
  return res;
}

// проверка на победу
const checkVictory = (field) => {
  let result = { flagVictory: false, line: null, startCol: null, startRow: null, finishCol: null, finishRow: null };
  // проверка по диагонали
  const checkDiag1 = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (col + count_max < 20 && row + count_max < 20 && field[row + count_max][col + count_max] === titl) {
      count_max++; //в ячейке справа и ниже повторяется значение
    }
    if (count_max > 4) // если 5 одинаковых возвращаем тру
      return true;

  }
  // проверка по второй диагонали
  const checkDiag2 = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (col + count_max < 20 && row - count_max >= 0 && field[row - count_max][col + count_max] === titl) {
      count_max++;  // в ячейке справа и выше повторяется значение
    }
    if (count_max > 4) // если 5 одинаковых возвращаем тру
      return true;

  }
  // проверка по горизонтали
  const checkHor = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (col + count_max < 20 && field[row][col + count_max] === titl) {
      count_max++;  // в ячейке справа повторяется значение
    }
    if (count_max > 4) //если 5 одинаковых по горизонтали возвращаем тру
      return true;
  }
  // проверка по вертикали
  const checkVer = (row, col) => {
    let count_max = 0;
    const titl = field[row][col];
    while (row + count_max < 20 && field[row + count_max][col] === titl) {
      count_max++; // в ячейке ниже  повторяется значение
    }
    if (count_max > 4)  // если 5 одинаковых возвращаем тру
      return true;

  }

  if (field.length > 0) {
    cicle: for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        // если ячейка не пустая проверяем на победу
        if (field[i][j] === "X" || field[i][j] === "O") {
          // если проверка по горизонтали удачна запоминаем координаты для зачеркивания
          if (checkHor(i, j)) {
            result = { flagVictory: true, line: 0, startCol: j, startRow: i, finishCol: j + 5, finishRow: i }
            break cicle;  // выходим из цикла проверки
          }
          // если проверка по вертикали удачна запоминаем координаты для зачеркивания
          if (checkVer(i, j)) {
            result = { flagVictory: true, line: 1, startCol: j, startRow: i, finishCol: j, finishRow: i + 5 }
            break cicle;// выходим из цикла проверки
          }
          // если проверка по первой диагонали удачна запоминаем координаты для зачеркивания
          if (checkDiag1(i, j)) {
            result = { flagVictory: true, line: 2, startCol: j, startRow: i, finishCol: j + 5, finishRow: i + 5 }
            break cicle;// выходим из цикла проверки
          }
          // если проверка по второй диагонали удачна запоминаем координаты для зачеркивания
          if (checkDiag2(i, j)) {
            result = { flagVictory: true, line: 3, startCol: j, startRow: i, finishCol: j + 5, finishRow: i - 5 }
            break cicle;// выходим из цикла проверки
          }

        }
      }
    }
  }
  return result; // возвращаем результат с координатами линии
}


const app = uWS.App().ws('/*', {
  // сообщения от клиентов
  message: (socket, message, isBinary) => {
    // парсим сообщение в json
    let json;
    if (decoder.write(Buffer.from(message)) !== "PING") {
      json = JSON.parse(decoder.write(Buffer.from(message)));
      switch (json.action) {
        // если идет подсоединение 
        case 'join': {
          users++;  // добавляем количество игроков
          if (users % 2 == 1) { // если это первый игрок
            // если игрок заполнил свое имя запоминаем его , иначе имя по умолчанию
            user = json.user === "Player" || json.user === "Player X" || json.user === "Player O" ? "Player X" : json.user;
            // создаем поле из эталона
            let fiel = field.map((item) => {
              return [...item]
            })
            rooms++; // добавляем количество комнат

            // добавляем в массив комнат данные о игроке, его сокете и поле
            room.push({ s1: socket, s2: null, user1: user, room: rooms, field: fiel, step: 0, user2: "" })
            // подписываемся на комнату
            socket.subscribe(String(rooms));
            //отправляем игроку сообщение о подключении
            socket.send(JSON.stringify({ answer: "join", room: rooms, user: user }));
          }
          // если подключается второй игрок
          else {
            // если игрок заполнил свое имя запоминаем его , иначе имя по умолчанию
            user = json.user === "Player" || json.user === "Player X" || json.user === "Player O" ? "Player O" : json.user;
            // прописываемся в последней созданной комнате
            if (user) {
              const r = room.length - 1;
              room[r].user2 = user;
              room[r].s2 = socket;
              //подписываемся на комнату
              socket.subscribe(String(rooms));
              // отправляем игроку сообщение о подключении 
              socket.send(JSON.stringify({ answer: "join", room: rooms, user: user }));
              // кричим в комнату что все подключились
              app.publish(String(rooms), JSON.stringify({ answer: "joinpub", u1: room[r].user1, u2: room[r].user2, nextUser: room[r].user1, field: room[r].field }));
            }
          }
          console.log("добавление игрока в комнату ", rooms)
          break;
        }

        // если прошло сообщение о ходе игрока
        case 'step': {
          //ищем комнату игрока от которого мессага
          let numRoom = -1;
          room.forEach((el, idx) => {
            if (el.room === json.room)
              numRoom = idx; // комната найдена
          })
          if (numRoom >= 0) {
            //let result = { flagVictory: false, line: null, startCol: null, startRow: null, finishCol: null, finishRow: null };
            //устанавливаем значение ячейки и проверяем на победу
            // если ходил первый игрок
            if (room[numRoom].step % 2 === 0 && room[numRoom].user1 === json.user) {
              result = setTile(json.row, json.col, "X", room[numRoom].field)
            }
            // если ходил второй игрок
            if (room[numRoom].step % 2 === 1 && room[numRoom].user2 === json.user) {
              result = setTile(json.row, json.col, "O", room[numRoom].field)
            }
            //меняем количество ходов в комнате (какой игрок ходит)
            room[numRoom].step++;
            const nextUser = room[numRoom].step % 2 === 0 ? room[numRoom].user1 : room[numRoom].user2;
            // кричим в комнату что ход сделан
            app.publish(String(json.room), JSON.stringify({ answer: "step", nextUser: nextUser, field: room[numRoom].field }));
            // если победа
            if (result.flagVictory) {
              // кричим в комнату о победе
              app.publish(String(json.room), JSON.stringify({ answer: "victory", user: json.user, coord: result }))
            }
          }
          break;
        }
        // если игрок вышел из комнаты
        case 'exit': {
          let numRoom = -1;
          // узнаем из какой комнаты
          room.forEach((el, idx) => {
            if (el.room === json.room)
              numRoom = idx;
          })
          if (numRoom >= 0) {
            if (room[numRoom]) {
              if (room[numRoom].user2 === "") { // если второй игрок еще не защел
                room[numRoom].user1 = ""; // обнуляем первого игрока
              }
              else { //если было 2 игрока , то обнуляем сначала второго , другой игрок выйдет после сообщении о выходе
                room[numRoom].user2 = "";
              }
              users--; // уменьшаем количество игроков 
            }
            // кричим в комнату что игрок покинул комнату
            app.publish(String(json.room), JSON.stringify({ answer: "exit", message: `Player ${json.user} quit the game` }));
            if (room[numRoom].user1 === "" && room[numRoom].user2 === "") {
              console.log("закрываем комнату ", room[numRoom].room)
              room.splice(numRoom, 1); //удаляем комнату
            }
            // отписываемся от сокета и закрываем сокет
            socket.unsubscribe(String(json.room));
            socket.close();
          }
          break;
        }
      }
    }
    else
      socket.send("PONG");
  },
  // если сокет закрылся
  close: (socket, code, message) => {
    let numRoom = -1;
    // узнаем по сокету в какой комнате был игрок
    room.forEach((el, idx) => {
      if (el.s1 === socket || el.s2 === socket) {
        numRoom = idx;
      }
    })
    if (numRoom >= 0) {
      if (room[numRoom]) {
        // если вылетел первый игрок
        if (room[numRoom].s1 === socket) {
          // кричим в корнату , что игрок вылетел, обнуляем его и уменьшаем количество игроков
          if (room[numRoom].user1 !== "") {
            app.publish(String(room[numRoom].room), JSON.stringify({ answer: "exit", message: `${room[numRoom].user1} is out the game` }));
            room[numRoom].user1 = "";
            users--;
          }
        }
        // если вылетел второй - все то же самое
        if (room[numRoom].s2 === socket) {
          if (room[numRoom].user2 !== "") {
            app.publish(String(room[numRoom].room), JSON.stringify({ answer: "exit", message: `"${room[numRoom].user2}" is out the game` }));
            room[numRoom].user2 = "";
            users--;
          }
        }
      }
      // если оба игрока обнулены можно закрывать комнату
      if (room[numRoom].user1 === "" && room[numRoom].user2 === "") {
        console.log("закрываем комнату по закрытию сокетов", room[numRoom].room)
        room.splice(numRoom, 1);
      }
    }
  }
});
// вешаем слушатель на 8000 порт
app.listen(8080, (listenSocket) => {
  if (listenSocket) {
    console.log('Прослушиваем порг 8080');
  }
});
