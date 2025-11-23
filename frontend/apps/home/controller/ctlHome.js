const axios = require("axios");

const homeController = async (req, res) => {
  const token = req.session.token;

  try {
    const [examesResp, examesRealizadosResp, pacientesResp] = await Promise.all([
      axios.get(process.env.SERVIDOR_DW3Back + "/GetAllExames", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(process.env.SERVIDOR_DW3Back + "/GetAllExamePaciente", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(process.env.SERVIDOR_DW3Back + "/GetAllPacientes", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    const exames = examesResp.data.registro ?? [];
    const realizados = examesRealizadosResp.data.registro ?? [];
    const pacientes = pacientesResp.data.registro ?? [];


    const valoresPorExame = {};
    exames.forEach(ex => {
      valoresPorExame[ex.exame_id] = Number(ex.valor ?? 0);
    });


    const exames_por_dia = {};
    realizados.forEach(reg => {
      const dia = reg.data_exame?.slice(0, 10);
      if (!dia) return;

      const valor = valoresPorExame[String(reg.exame_id)] ?? 0;

      if (!exames_por_dia[dia]) exames_por_dia[dia] = 0;
      exames_por_dia[dia] += valor;
    });

    const total_exames = Object.values(exames_por_dia)
      .reduce((acc, v) => acc + v, 0);

    const hoje = new Date().toISOString().slice(0, 10);
    const exames_hoje = realizados.filter(r =>
      r.data_exame?.slice(0, 10) === hoje
    ).length;


    const pacientes_count = pacientes.length;

    res.render("home/view/index.njk", {
      parametros: {
        title: "Página Inicial",
        erro: null,
        exames_hoje,
        total_exames,
        pacientes_count,
        exames_por_dia: exames_por_dia
      },  
    });

  } catch (error) {
    console.error("Erro no dashboard:", error);
    res.render("home/view/index.njk", {
      parametros: {
        title: "Página Inicial",
        erro: "Erro ao carregar dados.",
        exames_hoje: 0,
        total_exames: 0,
        pacientes_count: 0,
        exames_por_dia: {}
      },
    });
  }
};

module.exports = { homeController };
