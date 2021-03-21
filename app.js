const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const Core = require("./core");
new Core();

const User = require("./schema/user");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Obter user por cell
app.get("/user", async (req, res)=>{

    const user = await User.find({cell:req.query.cell});

    if(user.length == 0){
        return res.status(404).json({"error": "O usuário não está cadastrado!"});
    }
    return res.status(200).json({
        data: user
    });
});

//Obter user por idade
app.get("/users", async (req, res)=>{

    if (!req.query.age){
        const user = await User.find();
        return res.status(200).json({
        data: user,
        });
     }
    const user = await User.find({age:req.query.age});
    if(user.length == 0){
        return res.status(404).json({"error": "O usuário não está cadastrado!"});
    }
    return res.status(200).json({
        data: user
    });
});

//Obter user por ID
app.get("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({"error": "Usuario não encontrado"});
    }
    return res.status(200).json({
        data: user
    });
});

//Cadastrar user com nome, cpf, idade e celular
app.post("/users", async (req, res)=>{
    if((await User.findById(req.body.id))) {
        return res.status(400).json({error: "Id ja existe na base de dados"});
    }
    let elf = 11;
    if((String(req.body.cell).length) != elf) {
        return res.status(400).json({"Error":"Número maior que 11 digitos."});        
    }
    const user = {
        name: req.body.name,
        cpf: req.body.cpf,
        age: req.body.age,
        cell: req.body.cell
    };
    await (new User(user).save());
    return res.status(200).json({data: user});
});


//Editar user por ID
app.patch("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).json({
            error: "Usuario não encontrado"
        });
    }
    await user.updateOne(req.body);
    return res.status(200).json({data: req.body});
});

//Deletar user por ID
app.delete("/users/:id", async (req, res)=>{
    return res.status(200).json({
        data: (await User.findOneAndRemove({_id: req.params.id}))
    });
});

//Iniciar servidor
app.listen(3000, ()=>{
    console.log("Servidor inicializado...");
});