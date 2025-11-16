const axios = require("axios");

// Listagem/manutenção de fornecedores
const manutFornecedores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      const resp = await axios.get(
        process.env.SERVIDOR_DW3Back + "/GetAllFornecedores",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );

      res.render("fornecedores/view/vwManutFornecedores.njk", {
        title: "Manutenção de fornecedores",
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

      res.render("fornecedores/view/vwManutFornecedores.njk", {
        title: "Manutenção de fornecedores",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    }
  })();

// Criação de fornecedores
const insertFornecedores = async (req, res) =>
  (async () => {
    const token = req.session.token;

    if (req.method === "GET") {
      // Abre formulário de criação
      return res.render("fornecedores/view/vwFCrFornecedores.njk", {
        title: "Cadastro de fornecedores",
        data: null,
        erro: null,
        userName: null,
      });
    }

    // POST: persiste
    const regData = req.body;

    try {
      const response = await axios.post(
        process.env.SERVIDOR_DW3Back + "/InsertFornecedores",
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

// Visualização (read-only) de fornecedor
const ViewFornecedores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      if (req.method === "GET") {
        const id = parseInt(req.params.id);

        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetFornecedorByID",
          { fornecedor_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );

        if (response.data.status === "ok" && response.data.registro?.[0]) {
          res.render("fornecedores/view/vwFRUDrFornecedores.njk", {
            title: "Visualização de fornecedores",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,
          });
        } else {
          res.json({ status: "[ctlFornecedores|ViewFornecedores] Fornecedor não localizado!" });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlFornecedores|ViewFornecedores] Erro não identificado!" });
    }
  })();

// Atualização de fornecedor
const UpdateFornecedor = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      if (req.method === "GET") {
        const id = parseInt(req.params.id);

        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetFornecedorByID",
          { fornecedor_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );

        if (response.data.status === "ok" && response.data.registro?.[0]) {
          res.render("fornecedores/view/vwFRUDrFornecedores.njk", {
            title: "Atualização de fornecedores",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          res.json({ status: "[ctlFornecedores|UpdateFornecedor] Dados não localizados" });
        }
      } else {
        // POST: atualiza
        const regData = req.body;

        try {
          const response = await axios.post(
            process.env.SERVIDOR_DW3Back + "/UpdateFornecedores",
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
      res.json({ status: "[ctlFornecedores|UpdateFornecedor] Erro não identificado!" });
    }
  })();

// Exclusão de fornecedor
const DeleteFornecedor = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const regData = req.body;

    try {
      const response = await axios.post(
        process.env.SERVIDOR_DW3Back + "/DeleteFornecedores",
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
  manutFornecedores,
  insertFornecedores,
  ViewFornecedores,
  UpdateFornecedor,
  DeleteFornecedor,
};
