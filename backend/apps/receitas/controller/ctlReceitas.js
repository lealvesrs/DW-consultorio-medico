// apps/receitas/controller/ctlReceitas.js
const mdlReceitas = require("../model/mdlReceitas");

// GetAllReceitas
const getAllReceitas = (req, res) =>
  (async () => {
    const registro = await mdlReceitas.getAllReceitas();
    res.json({ status: "ok", registro });
  })();

// GetReceitaByID
const getReceitaByID = (req, res) =>
  (async () => {
    const receitaID = parseInt(req.body.receita_id);
    const registro = await mdlReceitas.getReceitaByID(receitaID);
    res.json({ status: "ok", registro });
  })();

// InsertReceitas
const insertReceitas = (req, res) =>
  (async () => {
    // Esperado no body: { paciente_id, descricao, data_emissao (YYYY-MM-DD), valor_total }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlReceitas.insertReceitas(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdateReceitas
const updateReceitas = (req, res) =>
  (async () => {
    // Esperado no body: { receita_id, paciente_id, descricao, data_emissao, valor_total }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlReceitas.updateReceitas(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeleteReceitas (soft delete)
const deleteReceitas = (req, res) =>
  (async () => {
    // Esperado no body: { receita_id }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlReceitas.deleteReceitas(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  getAllReceitas,
  getReceitaByID,
  insertReceitas,
  updateReceitas,
  deleteReceitas,
};
