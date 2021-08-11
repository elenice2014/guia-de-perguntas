const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define('perguntas', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },

    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    },
});

//sincronizar o que está aqui com o bd, se a tabklea Pergunta n existir, ele n vai forcar a criacao dela, pois ela vai ser criada só uam vez
Pergunta.sync({force: false}).then(()=>{})

module.exports = Pergunta;
