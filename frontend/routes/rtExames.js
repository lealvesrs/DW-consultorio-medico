var express = require('express');
var router = express.Router();
var examesApp = require("../apps/exames/controller/ctlExames")

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
router.get('/ManutExames', authenticationMiddleware, examesApp.manutExames)
router.get('/InsertExames', authenticationMiddleware, examesApp.insertExames);
router.get('/ViewExames/:id', authenticationMiddleware, examesApp.ViewExames);
router.get('/UpdateExames/:id', authenticationMiddleware, examesApp.UpdateExame);

/* POST métodos */
router.post('/InsertExames', authenticationMiddleware, examesApp.insertExames);
router.post('/UpdateExames', authenticationMiddleware, examesApp.UpdateExame);
router.post('/DeleteExames', authenticationMiddleware, examesApp.DeleteExame);
// router.post('/viewExames', authenticationMiddleware, examesApp.viewExames);


module.exports = router;