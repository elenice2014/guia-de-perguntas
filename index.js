const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database
connection
    .authenticate()
    .then(()=>{
         console.log("Conexao feita com o banco de dados!")
    }).catch((msgErro)=>{
        console.log(msgErro)
    })

// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json);

//rotas
app.get("/", (req, res) => {  //pesquisa as perguntas, , a lista de perguntas é envaida p/ variavel perguntas, e joga os dados dela p pro front
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas=>{
        res.render("index", {
            perguntas: perguntas
        });
    })
    
});

app.get("/perguntar",(req, res) => {
    res.render("perguntar");  //direcionar para a view
})

app.post("/salvarpergunta",(req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    })
});

app.get("/pergunta/:id",(req ,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ 
                    ['id','DESC'] 
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{ // Não encontrada
            res.redirect("/");
        }
    });
})

app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.listen(8080,()=>
    {console.log("App rodando!");
});