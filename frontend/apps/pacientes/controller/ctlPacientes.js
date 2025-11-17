const axios = require("axios");

// Listagem/manutenção de pacientes
const manutPacientes = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      const resp = await axios.get(
        process.env.SERVIDOR_DW3Back + "/GetAllPacientes",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );

      res.render("pacientes/view/vwManutPacientes.njk", {
        title: "Manutenção de pacientes",
        data: resp.data.registro,
        erro: null,
        userName: userName,
      });
    } catch (error) {
      let remoteMSG;
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível";
      } else if (error.code === "ERR_BAD_REQUEST") {
        remoteMSG = "Usuário não autenticado";
      } else {
        remoteMSG = error.message || "Erro inesperado";
      }

      res.render("pacientes/view/vwManutPacientes.njk", {
        title: "Manutenção de pacientes",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    }
  })();

// Criação de pacientes
const insertPacientes = async (req, res) =>
  (async () => {
    const token = req.session.token;

    if (req.method === "GET") {
      // Abre formulário de criação
      return res.render("pacientes/view/vwFCrPacientes.njk", {
        title: "Cadastro de pacientes",
        data: null,
        erro: null,
        userName: null,
      });
    }

    // POST: persiste
    const regData = req.body;

    try {
      const response = await axios.post(
        process.env.SERVIDOR_DW3Back + "/InsertPacientes",
        regData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: null,
      });
    }
  })();

// Visualização (read-only) de paciente
const ViewPacientes = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      if (req.method === "GET") {
        const id = req.params.id;
        parseInt(id);
        console.log(id)
        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetPacienteByID",
          { paciente_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );

        if (response.data.status === "ok" && response.data.registro?.[0]) {
          res.render("pacientes/view/vwFRUDrPacientes.njk", {
            title: "Visualização de pacientes",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,
          });
        } else {
          res.json({ status: "[ctlPacientes|ViewPacientes] Paciente não localizado!" });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlPacientes|ViewPacientes] Erro não identificado!" });
    }
  })();

// Atualização de paciente
const UpdatePaciente = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      if (req.method === "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetPacienteByID",
          { paciente_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );

        if (response.data.status === "ok" && response.data.registro?.[0]) {
          res.render("pacientes/view/vwFRUDrPacientes.njk", {
            title: "Atualização de pacientes",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          res.json({ status: "[ctlPacientes|UpdatePaciente] Dados não localizados" });
        }
      } else {
        // POST: atualiza
        const regData = req.body;

        try {
          const response = await axios.post(
            process.env.SERVIDOR_DW3Back + "/UpdatePacientes",
            regData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              timeout: 5000,
            }
          );

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          res.json({
            status: "Error",
            msg: error.message,
            data: null,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlPacientes|UpdatePaciente] Erro não identificado!" });
    }
  })();

// Exclusão de paciente
const DeletePaciente = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const regData = req.body;

    try {
      const response = await axios.post(
        process.env.SERVIDOR_DW3Back + "/DeletePacientes",
        regData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: null,
      });
    }
  })();

module.exports = {
  manutPacientes,
  insertPacientes,
  ViewPacientes,
  UpdatePaciente,
  DeletePaciente,
};
