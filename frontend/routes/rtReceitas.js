var express = require('express');
var router = express.Router();
var receitasApp = require("../apps/receitas/controller/ctlReceitas")

//Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");
    }
    next();
}; 
  
/* GET métodos */
router.get('/ManutReceitas', authenticationMiddleware, receitasApp.manutReceitas)
router.get('/InsertReceitas', authenticationMiddleware, receitasApp.insertReceitas);
router.get('/ViewReceitas/:id', authenticationMiddleware, receitasApp.ViewReceitas);
router.get('/UpdateReceitas/:id', authenticationMiddleware, receitasApp.UpdateReceita);

/* POST métodos */
router.post('/InsertReceitas', authenticationMiddleware, receitasApp.insertReceitas);
router.post('/UpdateReceitas', authenticationMiddleware, receitasApp.UpdateReceita);
router.post('/DeleteReceitas', authenticationMiddleware, receitasApp.DeleteReceita);
// router.post('/viewReceitas', authenticationMiddleware, receitasApp.viewReceitas);


module.exports = router;