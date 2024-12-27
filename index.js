require('dotenv').config();
const fs = require("fs");
const http = require("http");
const path = require("path");

const host = process.env.DB_HOST;
const port = process.env.PORT;

const folderPath = path.join(__dirname, "info");
const filePath = path.join(__dirname, "info", "temp-file.txt");
const indexPath = path.join(__dirname, "index.html"); 

http.createServer((request, response) => {
    if (request.url === "/write") {
        fs.mkdir(folderPath, { recursive: true }, err => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end("Ошибка при создании папки");
                return;
            }
            fs.writeFile(filePath, "Сегодня была очень плохая и пасмурная погода.", { flag: 'wx' }, err => {
                if (err) {
                    if (err.code === "EEXIST") {
                        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                        response.end("Папка уже существует, поэтому данные не были записаны");
                    } else {
                        response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                        response.end("Ошибка при создании файла");
                    }
                    return;
                }
                response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end("Данные записаны");
            });
        });
    } else if (request.url === "/read") {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end("Ошибка при чтении файла");
                return;
            }
            response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end(`Данные прочитаны: ${data}`);
        });
    } else {
        fs.readFile(indexPath, "utf-8", (err, data) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                console.log("Ошибка при загрузке страницы", err);
                response.end("Ошибка при загрузке страницы");
                return;
            }
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(data);
        });
    }
}).listen(port, host, () => {
    console.log(`Сервер запущен по адресу: http://${host}:${port}`);
});


