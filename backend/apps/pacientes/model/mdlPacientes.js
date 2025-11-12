// apps/pacientes/model/mdlPacientes.js
const db = require("../../../database/databaseconfig");

const getAllPacientes = async () => {
  return (
    await db.query(
      "SELECT * FROM pacientes WHERE removido = FALSE ORDER BY nome ASC, paciente_id ASC"
    )
  ).rows;
};

const getPacienteByID = async (pacienteIDPar) => {
  return (
    await db.query(
      "SELECT * FROM pacientes WHERE paciente_id = $1 AND removido = FALSE",
      [pacienteIDPar]
    )
  ).rows;
};

const insertPacientes = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO pacientes (cpf, nome, endereco, telefone, removido) " +
          "VALUES ($1, $2, $3, $4, FALSE)",
        [
          registroPar.cpf,       // varchar(11) UNIQUE (pode ser null)
          registroPar.nome,      // text NOT NULL
          registroPar.endereco,  // text
          registroPar.telefone,  // varchar(20)
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPacientes|insertPacientes] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const updatePacientes = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pacientes SET " +
          "cpf = $2, " +
          "nome = $3, " +
          "endereco = $4, " +
          "telefone = $5 " +
          "WHERE paciente_id = $1",
        [
          registroPar.pacienteid, // PK
          registroPar.cpf,
          registroPar.nome,
          registroPar.endereco,
          registroPar.telefone,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPacientes|updatePacientes] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const deletePacientes = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pacientes SET removido = TRUE WHERE paciente_id = $1",
        [registroPar.pacienteid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPacientes|deletePacientes] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  getAllPacientes,
  getPacienteByID,
  insertPacientes,
  updatePacientes,
  deletePacientes,
};
