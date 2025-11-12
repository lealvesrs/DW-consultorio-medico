// apps/pacientes/controller/ctlPacientes.js
const mdlPacientes = require("../model/mdlPacientes");

// GetAllPacientes
const getAllPacientes = (req, res) =>
  (async () => {
    const registro = await mdlPacientes.getAllPacientes();
    res.json({ status: "ok", registro });
  })();

// GetPacienteByID
const getPacienteByID = (req, res) =>
  (async () => {
    const pacienteID = parseInt(req.body.pacienteid);
    const registro = await mdlPacientes.getPacienteByID(pacienteID);
    res.json({ status: "ok", registro });
  })();

// InsertPacientes
const insertPacientes = (req, res) =>
  (async () => {
    // Esperado no body: { cpf, nome, endereco, telefone }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlPacientes.insertPacientes(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdatePacientes
const updatePacientes = (req, res) =>
  (async () => {
    // Esperado no body: { pacienteid, cpf, nome, endereco, telefone }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlPacientes.updatePacientes(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeletePacientes (soft delete)
const deletePacientes = (req, res) =>
  (async () => {
    // Esperado no body: { pacienteid }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlPacientes.deletePacientes(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  getAllPacientes,
  getPacienteByID,
  insertPacientes,
  updatePacientes,
  deletePacientes,
};
