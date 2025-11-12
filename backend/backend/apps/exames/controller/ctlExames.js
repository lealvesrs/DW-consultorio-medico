// apps/exames/controller/ctlExames.js
const mdlExames = require("../model/mdlExames");

// GetAllExames
const getAllExames = (req, res) =>
  (async () => {
    const registro = await mdlExames.getAllExames();
    res.json({ status: "ok", registro });
  })();

// GetExameByID
const getExameByID = (req, res) =>
  (async () => {
    const exameID = parseInt(req.body.exame_id);
    const registro = await mdlExames.getExameByID(exameID);
    res.json({ status: "ok", registro });
  })();

// InsertExames
const insertExames = (req, res) =>
  (async () => {
    // Esperado: { nome, descricao, valor }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlExames.insertExames(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdateExames
const updateExames = (req, res) =>
  (async () => {
    // Esperado: { exame_id, nome, descricao, valor }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlExames.updateExames(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeleteExames (soft delete)
const deleteExames = (req, res) =>
  (async () => {
    // Esperado: { exame_id }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlExames.deleteExames(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  getAllExames,
  getExameByID,
  insertExames,
  updateExames,
  deleteExames,
};
