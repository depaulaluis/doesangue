//configurando o servidor
const express = require("express") 
const server = express()

//configurando o servidor para apresentar os arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true}))

//configurando a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
  user:'postgres',
  password:'123456',
  host: 'localhost',
  port: '5233',
  database: 'doe'
})

//configurando a template engie
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true
})


//lista de doadores array
const donors = [
  {
    name: "Luis Henrique",
    blood: "AB+"
  },
  {
    name: "Letícia Ijorski",
    blood: "A-"
  },
  {
    name: "Lucas Alves",
    blood: "B+"
  },
  {
    name: "Vinicius de Paula",
    blood: "O+"
  },
]




//configurar a apresentação da pagina
server.get("/", function(req, res){
  const donors = []
  return res.render("index.html", {donors})
})


server.post("/", function(req, res){
  //pegar dados do formulario
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if (name == "" || email == "" || blood == ""){
    return res.send("Todos os campos são obrigatórios")
  }

  //coloca valores dentro do banco de dados
  const query = `
    INSERT INTO donors ("name","email","blood") 
    VALUES ($1, $2, $3)
   `
  const values = [nome, email, blood]

  db.query(query,values, function(err){
    //fluxo de erro
    if (err) return res.send("Error in the database!")
      return res.redirect("/")
  })

})

server.listen(3000)
