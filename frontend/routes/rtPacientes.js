var express = require('express');
var router = express.Router();
var pacientesApp = require("../apps/pacientes/controller/ctlPacientes")



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
router.get('/ManutPacientes', authenticationMiddleware, pacientesApp.manutPacientes)
router.get('/InsertPacientes', authenticationMiddleware, pacientesApp.insertPacientes);
router.get('/ViewPacientes/:id', authenticationMiddleware, pacientesApp.ViewPacientes);
router.get('/UpdatePacientes/:id', authenticationMiddleware, pacientesApp.UpdatePaciente);

/* POST métodos */
router.post('/InsertPacientes', authenticationMiddleware, pacientesApp.insertPacientes);
router.post('/UpdatePacientes', authenticationMiddleware, pacientesApp.UpdatePaciente);
router.post('/DeletePacientes', authenticationMiddleware, pacientesApp.DeletePaciente);
// router.post('/viewPacientes', authenticationMiddleware, pacientesApp.viewPacientes);


module.exports = router;