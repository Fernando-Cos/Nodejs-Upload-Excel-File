const express = require('express');
const app = express();
const path = require('path'); 


const db = require('./app/config/db.config.js');

global.__basedir = __dirname;   
    
// Forçando: true vai cair o mesmo se ele já existe...
db.sequelize.sync({force: true}).then(() => {
  console.log('Apagando e Reniciando with { force: true }');
});       

let router = require('./app/routers/excel.router.js');
app.use(express.static('resources'));

app.use(express.static(path.join(__dirname, "public")))


app.use('/', router);   

// Criando nosso servidor...
const server = app.listen(8080, function () {
  let host = server.address().address
  let port = server.address().port
 
  console.log("App rodando na porta http://%s%s\n\n", host, port); 
})