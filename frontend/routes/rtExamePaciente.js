var express = require('express');
var router = express.Router();
var examePacienteApp = require("../apps/examePaciente/controller/ctlExamePaciente")

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
router.get('/ManutExamePaciente', authenticationMiddleware, examePacienteApp.manutExamePaciente)
router.get('/InsertExamePaciente', authenticationMiddleware, examePacienteApp.insertExamePaciente);
router.get('/ViewExamePaciente/:id', authenticationMiddleware, examePacienteApp.ViewExamePaciente);
router.get('/UpdateExamePaciente/:id', authenticationMiddleware, examePacienteApp.UpdateExamePaciente);

/* POST métodos */
router.post('/InsertExamePaciente', authenticationMiddleware, examePacienteApp.insertExamePaciente);
router.post('/UpdateExamePaciente', authenticationMiddleware, examePacienteApp.UpdateExamePaciente);
router.post('/DeleteExamePaciente', authenticationMiddleware, examePacienteApp.DeleteExamePaciente);
// router.post('/viewExamePaciente', authenticationMiddleware, examePacienteApp.viewExamePaciente);


module.exports = router;