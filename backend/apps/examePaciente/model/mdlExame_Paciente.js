// apps/exame_paciente/model/mdlExame_Paciente.js
const db = require("../../../database/databaseconfig");

// GetAllExamePaciente
const getAllExamePaciente = async () => {
  return (
    await db.query(
      `SELECT ep.*, 
              p.nome AS paciente_nome, 
              e.nome AS exame_nome
       FROM exame_paciente ep
       JOIN pacientes p ON p.paciente_id = ep.paciente_id
       JOIN exames    e ON e.exame_id    = ep.exame_id
       WHERE ep.removido = FALSE 
         AND p.removido  = FALSE
         AND e.removido  = FALSE
       ORDER BY ep.data_exame DESC, ep.exame_paciente_id DESC`
    )
  ).rows;
};

// GetExamePacienteByID
const getExamePacienteByID = async (examePacienteIDPar) => {
  return (
    await db.query(
      `SELECT ep.*, 
              p.nome AS paciente_nome, 
              e.nome AS exame_nome
       FROM exame_paciente ep
       JOIN pacientes p ON p.paciente_id = ep.paciente_id
       JOIN exames    e ON e.exame_id    = ep.exame_id
       WHERE ep.exame_paciente_id = $1
         AND ep.removido = FALSE 
         AND p.removido  = FALSE
         AND e.removido  = FALSE`,
      [examePacienteIDPar]
    )
  ).rows;
};

// InsertExamePaciente
const insertExamePaciente = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        `INSERT INTO exame_paciente 
           (paciente_id, exame_id, data_exame, laudo, removido)
         VALUES ($1, $2, $3, $4, FALSE)`,
        [
          registroPar.paciente_id, // FK pacientes.paciente_id
          registroPar.exame_id,    // FK exames.exame_id
          registroPar.data_exame,  // date (YYYY-MM-DD)
          registroPar.laudo ?? null,
        ]
      )
    ).rowCount;
  } catch (error) {
    // pode estourar UNIQUE (paciente_id, exame_id, data_exame)
    msg = "[mdlExamePaciente|insertExamePaciente] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// UpdateExamePaciente
const updateExamePaciente = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        `UPDATE exame_paciente SET
            paciente_id = $2,
            exame_id    = $3,
            data_exame  = $4,
            laudo       = $5
         WHERE exame_paciente_id = $1`,
        [
          registroPar.exame_paciente_id, // PK
          registroPar.paciente_id,
          registroPar.exame_id,
          registroPar.data_exame,
          registroPar.laudo ?? null,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlExamePaciente|updateExamePaciente] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// DeleteExamePaciente (soft delete)
const deleteExamePaciente = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        `UPDATE exame_paciente 
            SET removido = TRUE 
          WHERE exame_paciente_id = $1`,
        [registroPar.exame_paciente_id]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlExamePaciente|deleteExamePaciente] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  getAllExamePaciente,
  getExamePacienteByID,
  insertExamePaciente,
  updateExamePaciente,
  deleteExamePaciente,
};
