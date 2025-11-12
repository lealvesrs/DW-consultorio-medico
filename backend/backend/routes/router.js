const express = require("express");
const routerApp = express.Router();

// Controllers
const appLogin         = require("../apps/login/controller/ctlLogin");
const appPacientes     = require("../apps/pacientes/controller/ctlPacientes");
const appExames        = require("../apps/exames/controller/ctlExames");
const appReceitas      = require("../apps/receitas/controller/ctlReceitas");
const appExamePaciente = require("../apps/examePaciente/controller/ctlExame_paciente");

// Middleware global (placeholder)
routerApp.use((req, res, next) => {
  next();
});

// Health-check / raiz
routerApp.get("/", (req, res) => {
  res.send("Olá mundo!");
});

/* =========================
 *  Rotas de Login (sem JWT)
 * ========================= */
routerApp.post("/Login",  appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

/* =========================
 *  PACIENTES (CRUD + JWT)
 * ========================= */
routerApp.get ("/GetAllPacientes", appLogin.AutenticaJWT, appPacientes.getAllPacientes);
routerApp.post("/GetPacienteByID", appLogin.AutenticaJWT, appPacientes.getPacienteByID);
routerApp.post("/InsertPacientes", appLogin.AutenticaJWT, appPacientes.insertPacientes);
routerApp.post("/UpdatePacientes", appLogin.AutenticaJWT, appPacientes.updatePacientes);
routerApp.post("/DeletePacientes", appLogin.AutenticaJWT, appPacientes.deletePacientes);

/* ======================
 *  EXAMES (CRUD + JWT)
 * ====================== */
routerApp.get ("/GetAllExames", appLogin.AutenticaJWT, appExames.getAllExames);
routerApp.post("/GetExameByID", appLogin.AutenticaJWT, appExames.getExameByID);
routerApp.post("/InsertExames", appLogin.AutenticaJWT, appExames.insertExames);
routerApp.post("/UpdateExames", appLogin.AutenticaJWT, appExames.updateExames);
routerApp.post("/DeleteExames", appLogin.AutenticaJWT, appExames.deleteExames);

/* ========================
 *  RECEITAS (CRUD + JWT)
 * ======================== */
routerApp.get ("/GetAllReceitas", appLogin.AutenticaJWT, appReceitas.getAllReceitas);
routerApp.post("/GetReceitaByID", appLogin.AutenticaJWT, appReceitas.getReceitaByID);
routerApp.post("/InsertReceitas", appLogin.AutenticaJWT, appReceitas.insertReceitas);
routerApp.post("/UpdateReceitas", appLogin.AutenticaJWT, appReceitas.updateReceitas);
routerApp.post("/DeleteReceitas", appLogin.AutenticaJWT, appReceitas.deleteReceitas);

/* ==========================================
 *  EXAME_PACIENTE (N:M) (CRUD + JWT)
 *  - PK: exame_paciente_id
 * ========================================== */
routerApp.get ("/GetAllExamePaciente", appLogin.AutenticaJWT, appExamePaciente.getAllExamePaciente);
routerApp.post("/GetExamePacienteByID", appLogin.AutenticaJWT, appExamePaciente.getExamePacienteByID);
routerApp.post("/InsertExamePaciente",  appLogin.AutenticaJWT, appExamePaciente.insertExamePaciente);
routerApp.post("/UpdateExamePaciente",  appLogin.AutenticaJWT, appExamePaciente.updateExamePaciente);
routerApp.post("/DeleteExamePaciente",  appLogin.AutenticaJWT, appExamePaciente.deleteExamePaciente);

module.exports = routerApp;
