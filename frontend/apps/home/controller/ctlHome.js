const axios = require("axios");

const homeController = async (req, res) => {
  const token = req.session.token;

  let exames_hoje = 0;
  let total_exames = 0;
  let remoteMSG = null;

  try {
    const examesResp = await axios.get(
      process.env.SERVIDOR_DW3Back + "/GetAllExames",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (examesResp.data.registro && Array.isArray(examesResp.data.registro)) {
      examesResp.data.registro.forEach((exame) => {
        const valor = Number(exame.valor ?? 0);
        total_exames += isNaN(valor) ? 0 : valor;
      });
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      remoteMSG = "Servidor backend indisponível";
    } else if (error.response && error.response.status === 401) {
      remoteMSG = "Sessão expirada. Faça login novamente.";
    } else {
      remoteMSG = "Erro desconhecido ao carregar dados do painel.";
      console.error(remoteMSG, error.message);
    }
  }

  const parametros = {
    title: "Página Inicial",
    erro: remoteMSG,
    exames_hoje: await examesHoje(token),
    total_exames: total_exames,
    pacientes_count: await totalPacientes(token),
  };

  res.render("home/view/index.njk", { parametros });
};

async function totalPacientes(token) {
  const fornResp = await axios.get(
    process.env.SERVIDOR_DW3Back + "/GetAllPacientes",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return fornResp.data.registro.length;
}

async function examesHoje(token) {
  const examesResp = await axios.get(
    process.env.SERVIDOR_DW3Back + "/GetAllExamePaciente",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let exames_hoje = 0;
  if (examesResp.data.registro && Array.isArray(examesResp.data.registro)) {
    const hojeStr = new Date().toISOString().slice(0, 10);

    examesResp.data.registro.forEach((exame) => {
      const dataStr = new Date(exame.data_exame).toISOString().slice(0, 10);
      if (dataStr === hojeStr) {
        exames_hoje++;
      }
    });
   
  }
  return exames_hoje;
}

module.exports = {
  homeController,
};
