// apps/exames/model/mdlExames.js
const db = require("../../../database/databaseconfig");

// GetAllExames
const getAllExames = async () => {
  return (
    await db.query(
      "SELECT * FROM exames WHERE removido = FALSE ORDER BY nome ASC, exame_id ASC"
    )
  ).rows;
};

// GetExameByID
const getExameByID = async (exameIDPar) => {
  return (
    await db.query(
      "SELECT * FROM exames WHERE exame_id = $1 AND removido = FALSE",
      [exameIDPar]
    )
  ).rows;
};

// InsertExames
const insertExames = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO exames (nome, descricao, valor, removido) VALUES ($1, $2, $3, FALSE)",
        [
          registroPar.nome,                   // text NOT NULL
          registroPar.descricao ?? null,      // text
          registroPar.valor ?? 0,             // numeric(9,2)
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlExames|insertExames] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// UpdateExames
const updateExames = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE exames SET " +
          "nome = $2, " +
          "descricao = $3, " +
          "valor = $4 " +
          "WHERE exame_id = $1",
        [
          registroPar.exame_id,               // PK
          registroPar.nome,
          registroPar.descricao ?? null,
          registroPar.valor ?? 0,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlExames|updateExames] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// DeleteExames (soft delete)
const deleteExames = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE exames SET removido = TRUE WHERE exame_id = $1",
        [registroPar.exame_id]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlExames|deleteExames] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  getAllExames,
  getExameByID,
  insertExames,
  updateExames,
  deleteExames,
};
