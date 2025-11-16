var express = require('express');
var router = express.Router();
var loginApp = require("../apps/login/controller/ctlLogin")
var homeApp = require("../apps/home/controller/ctlHome")


//@ Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  //@ Verificar se existe uma sessão válida
  //isLogged = req.cookies.isLogged;
  isLogged = req.session.isLogged;

  if (!isLogged) {
    return res.redirect("/Login");
  }

  next();
};

/* GET home page. */
router.get('/', authenticationMiddleware, homeApp.homeController);


/* GET login page. */
router.get('/Login', loginApp.Login);

/* POST login page. */
router.post('/Login', loginApp.Login);

/* GET logout page. */
router.get('/Logout', loginApp.Logout);

module.exports = router;
