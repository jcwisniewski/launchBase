//config server

const express = require('express')

const server = express ();

//configurar o servidor para apresentar arquivos extrass
server.use(express.static('public'))

//configurando o server para buscar as infos do body
server.use(express.urlencoded({extended: true}))

//configurar a connecao com banco de dados

const Pool = require('pg').Pool
//criado dados do banco
const db = new Pool({
  user: 'userx',
  password: '028197',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

//configurando nunjucks
const nunjucks = require('nunjucks');

nunjucks.configure("./", {
  express: server,
  noCache: true
})

//lista de doadores: Vetor ou array
/* const donors = [
  {
    name: "Diego Fernandes",
    blood: "B"
  },
  {
    name: "Cleiton Fernandes",
    blood: "O"
  },
  {
    name: "Robson Fernandes",
    blood: "B"
  },
  {
    name: "Julinho Fernandes",
    blood: "A"
  },
]
*/
//configurar apresentacao da pagina
server.get("/", function(req, res){
  //realiza a query no banco de dados
 const query = `SELECT * FROM donors`
 //realiza a funcao que ira retornar ou erro ou o resultado da query (parametros)
 db.query(query, function(err, result){
   //fluxo de erro
   if (err) return res.send('Erro ao realizar consulta no banco de dados')
  //fluxo ideal
   const donors = result.rows;
   return res.render("index.html", {donors});
  })
})
//configurar envio de informacao para o servidor (post) a
server.post("/", function(req, res){
  //ENVIAR DADOS DO FORMULARIO PARA O SERVIDOR
  const name = req.body.name;
  const email = req.body.email;
  const blood= req.body.blood;

  //se o nome for vazio ou email vazio ou blood vazio
  if (name == "" || email == "" || blood == "" ){
    return res.send("todos os campos sao obrigatorios.");
  }
  /*
  //insere dados denrto do array
  donors.push({
    name:name,
    blood:blood,
  })
  */
 //quero para adicionar itens no banco de dados
 //javascript permite colocar na query os numeros referentes as variaveis
  const query = `INSERT INTO donors("name", "email", "blood")
  VALUES ($1, $2, $3)`

  const values = [name, email, blood]
  db.query(query, values, function(err) {
    //fluxo de erro
    if(err) return res.send("Erro no banco de dados")

    //fluxo ideal
    return res.redirect("/");

  })

  //retorna uma pagina apos realizar o post. retorno RES do metodo post.
})

//ligar e permitir o uso da porta 3000

server.listen(3000, function (){
  console.log("server ativo");
});
