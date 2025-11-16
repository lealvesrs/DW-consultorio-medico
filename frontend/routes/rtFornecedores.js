var express = require('express');
var router = express.Router();
var fornecedoresApp = require("../apps/fornecedores/controller/ctlFornecedores")



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
router.get('/ManutFornecedores', authenticationMiddleware, fornecedoresApp.manutFornecedores)
router.get('/InsertFornecedores', authenticationMiddleware, fornecedoresApp.insertFornecedores);
router.get('/ViewFornecedores/:id', authenticationMiddleware, fornecedoresApp.ViewFornecedores);
router.get('/UpdateFornecedores/:id', authenticationMiddleware, fornecedoresApp.UpdateFornecedor);

/* POST métodos */
router.post('/InsertFornecedores', authenticationMiddleware, fornecedoresApp.insertFornecedores);
router.post('/UpdateFornecedores', authenticationMiddleware, fornecedoresApp.UpdateFornecedor);
router.post('/DeleteFornecedores', authenticationMiddleware, fornecedoresApp.DeleteFornecedor);
// router.post('/viewFornecedores', authenticationMiddleware, fornecedoresApp.viewFornecedores);


module.exports = router;