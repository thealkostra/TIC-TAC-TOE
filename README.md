Игра крестики нолики 5 в ряд
стек - react, redux-toolkit, typescript, uWebSokets.js



Для развертывания проекта необходимо, установленный node.js не ниже 13 версии и git.
для игры необходимо запустить как проект сервера , так и проект клиента
-для сервера можно сменить порт в файле  `websocketServer/server.js` строка 229
-в клиенте указать сервер и порт WebSocket сервера в файле `src\Components\game\game.tsx` строка 34


создать на диске папку для проекта 
1 - склонировать репозиторий в созданную папку командой в консоли
`git clone https://github.com/thealkostra/TIC-TAC-TOE`

запуск сервера:
 - в каталоге проекта `TIC-TAC-TOE/websocketServer` в консоли выполнить команду `npm install`
после того как скачаются бибоиотеки и установятся зависимости
можно запускать проект сервера - `npm start`

запуск клиента
- в каталоге проекта `TIC-TAC-TOE` в консоли выполнить команду `npm install`
после того как скачаются бибоиотеки и установятся зависимости
можно запускать проект

запустить проект можно двума способами 
a - в папке проекта `TIC-TAC-TOE` в консоли выполнить команду
`npm start`
после сборки в debag режиме проект сам откроется в браузере по умолчанию

b - в папке проекта `TIC-TAC-TOE` в консоли выполнить команду
`npm run build` 
при этом каталоге build создадутся файлы готовые к размещению на веб сервере 
если нет вебсервера, его можно установть командой 
`npm install -g serve`
и запустить сборку командой 
`serve -s build`

после чего проект клиента можно открывать по ссылке `http://localhost:3000`