// apps/receitas/model/mdlReceitas.js
const db = require("../../../database/databaseconfig");

// GetAllReceitas
const getAllReceitas = async () => {
  return (
    await db.query(
      // Lista receitas ativas, mais recentes primeiro
      "SELECT r.*, p.nome AS paciente_nome " +
        "FROM receitas r " +
        "JOIN pacientes p ON p.paciente_id = r.paciente_id " +
        "WHERE r.removido = FALSE AND p.removido = FALSE " +
        "ORDER BY r.data_emissao DESC, r.receita_id DESC"
    )
  ).rows;
};

// GetReceitaByID
const getReceitaByID = async (receitaIDPar) => {
  return (
    await db.query(
      "SELECT r.*, p.nome AS paciente_nome " +
        "FROM receitas r " +
        "JOIN pacientes p ON p.paciente_id = r.paciente_id " +
        "WHERE r.receita_id = $1 AND r.removido = FALSE AND p.removido = FALSE",
      [receitaIDPar]
    )
  ).rows;
};

// InsertReceitas
const insertReceitas = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO receitas (paciente_id, descricao, data_emissao, valor_total, removido) " +
          "VALUES ($1, $2, $3, $4, FALSE)",
        [
          registroPar.paciente_id,   // bigint (FK de pacientes.paciente_id)
          registroPar.descricao,     // text NOT NULL
          registroPar.data_emissao,  // date (YYYY-MM-DD)
          registroPar.valor_total ?? 0, // numeric(9,2)
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlReceitas|insertReceitas] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// UpdateReceitas
const updateReceitas = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE receitas SET " +
          "paciente_id = $2, " +
          "descricao = $3, " +
          "data_emissao = $4, " +
          "valor_total = $5 " +
          "WHERE receita_id = $1",
        [
          registroPar.receita_id,    // PK
          registroPar.paciente_id,
          registroPar.descricao,
          registroPar.data_emissao,
          registroPar.valor_total ?? 0,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlReceitas|updateReceitas] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// DeleteReceitas (soft delete)
const deleteReceitas = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE receitas SET removido = TRUE WHERE receita_id = $1",
        [registroPar.receita_id]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlReceitas|deleteReceitas] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  getAllReceitas,
  getReceitaByID,
  insertReceitas,
  updateReceitas,
  deleteReceitas,
};
