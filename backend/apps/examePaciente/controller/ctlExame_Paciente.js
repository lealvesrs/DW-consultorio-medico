// apps/exame_paciente/controller/ctlExame_Paciente.js
const mdlExamePaciente = require("../model/mdlExame_Paciente");

// GetAllExamePaciente
const getAllExamePaciente = (req, res) =>
  (async () => {
    let registro = await mdlExamePaciente.getAllExamePaciente();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];
      if (row.data_exame instanceof Date) {
        row.data_exame = row.data_exame.toISOString().split("T")[0];
      }
    }
    res.json({ status: "ok", registro });
  })();

// GetExamePacienteByID
const getExamePacienteByID = (req, res) =>
  (async () => {
    const examePacienteID = parseInt(req.body.exame_paciente_id);
    const registro = await mdlExamePaciente.getExamePacienteByID(examePacienteID);
    res.json({ status: "ok", registro });
  })();

// InsertExamePaciente
const insertExamePaciente = (req, res) =>
  (async () => {
    // Esperado no body: { paciente_id, exame_id, data_exame (YYYY-MM-DD), laudo }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlExamePaciente.insertExamePaciente(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdateExamePaciente
const updateExamePaciente = (req, res) =>
  (async () => {
    // Esperado no body: { exame_paciente_id, paciente_id, exame_id, data_exame, laudo }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlExamePaciente.updateExamePaciente(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeleteExamePaciente (soft delete)
const deleteExamePaciente = (req, res) =>
  (async () => {
    // Esperado no body: { exame_paciente_id }
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlExamePaciente.deleteExamePaciente(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  getAllExamePaciente,
  getExamePacienteByID,
  insertExamePaciente,
  updateExamePaciente,
  deleteExamePaciente,
};
