const axios = require("axios");
const moment = require("moment");


const manutExames = async (req, res) =>
  (async () => {
    //@ Abre o formulário de manutenção de exames
    const userName = req.session.userName;
    const token = req.session.token;

    //console.log("[ctlExames|ManutExames] Valor token:" + token)
    // try {
    let remoteMSG = null;
    let resp = null;
    try {
        resp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllExames", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Set JWT token in the header
            }
        });
        resp.data.registro.forEach((exame) => {
            exame.data_vencimento = moment(exame.data_vencimento).format("DD/MM/YYYY");
        });
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            remoteMSG = "Servidor indisponível"
        } else if (error.response && error.response.status === 401) {
            remoteMSG = "Usuário não autenticado";
        } else {
            remoteMSG = error.message;
        }

        res.render("exames/view/vwManutExames.njk", {
            title: "Manutenção de Exames ",
            data: null,
            erro: remoteMSG, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
            userName: userName,
        });
        return; // Sai se houver erro
    }

    res.render("exames/view/vwManutExames.njk", {
      title: "Manutenção de Exames ",
      data: resp.data.registro,
      erro: remoteMSG,
      userName: userName,
    });
  })();

const insertExames = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      //@ Busca os pacientes disponíveis
    /*   let pacientes = null;
      try {
        pacientes = await axios.get(
          process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { // MUDANÇA: /GetAllPacientes -> /GetAllPacientes
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Set JWT token in the header
          }
        });
      } catch (error) {
        console.error('Erro ao buscar pacientes no servidor backend:', error.message);
        // Pode-se tratar o erro aqui, por exemplo, renderizando a página sem a lista
        // Ou com uma mensagem de erro específica para o formulário
        return res.render("exames/view/vwFCrExames.njk", {
            title: "Cadastro de Exames ",
            data: null,
            erro: `Erro ao carregar paciente: ${error.message}`,
            userName: null,
          });
      } */


      return res.render("exames/view/vwFCrExames.njk", {
        title: "Cadastro de Exames ",
        data: null,
        erro: null, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
        userName: null,
      });

    } else {
      //@ POST
      const regData = req.body;
      const token = req.session.token;

      try {
        // @ Enviando dados para o servidor Backend
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertExames", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000, // @ 5 segundos de timeout
        });

        //console.log('[ctlExames|InsertExames] Dados retornados:', response.data);

        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        let msg = 'Erro ao inserir dados no servidor backend';
        if (error.response && error.response.data && error.response.data.msg) {
          msg = error.response.data.msg;
        } else if (error.message) {
          msg = error.message;
        }
        console.error('[ctlExames|InsertExames] Erro ao inserir dados no servidor backend:', msg);
        res.json({
          status: "Error",
          msg: msg,
          data: null,
          erro: null,
        });
      }
    }
  })();

const ViewExames = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    let response = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetExameByID",
          {
            exame_id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          //@ Busca os pacientes disponíveis
        /*   const pacientes = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].data_vencimento = moment(response.data.registro[0].data_vencimento).format(
            "YYYY-MM-DD"
          ); */

          res.render("exames/view/vwFRUDrExames.njk", {
            title: "Visualização de Exames ",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,

          });
        } else {
          console.log("[ctlExames|ViewExames] ID de Exame não localizado!");
          res.json({ status: "[ctlExames.js|ViewExames] Exame não localizado!" });
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlExames.js|ViewExames] Exame não localizado!" });
      console.log(
        "[ctlExames.js|ViewExames] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

const UpdateExame = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    let response = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetExameByID",
          {
            exame_id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log('[ctlExames|UpdateExame] Dados retornados:', response.data);
        if (response.data.status == "ok") {
          //@ Busca os pacientes disponíveis
         /*  const pacientes = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          }); */

      

          res.render("exames/view/vwFRUDrExames.njk", {
            title: "Atualização de dados de Exames ", 
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlExames|UpdateExame] Dados não localizados");
          res.json({ status: "[ctlExames.js|UpdateExame] Exame não localizado!" });
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        // console.log("[ctlExames|UpdateExame] Valor regData:", JSON.stringify(regData));
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateExames", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000, // @ 5 segundos de timeout
          });

          //console.log('[ctlExames|InsertExames] Dados retornados:', response.data);

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          let msg = 'Erro ao atualizar dados de exames no servidor backend';
          if (error.response && error.response.data && error.response.data.msg) {
            msg = error.response.data.msg;
          } else if (error.message) {
            msg = error.message;
          }
          console.error('[ctlExames.js|UpdateExame] Erro ao atualizar dados de exames no servidor backend:', msg);
          res.json({
            status: "Error",
            msg: msg,
            data: null,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlExames.js|UpdateExame] Exame não localizado!" });
      console.log(
        "[ctlExames.js|UpdateExame] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteExame = async (req, res) =>
  (async () => {
    //@ POST
    const regData = req.body;
    const token = req.session.token;

    //console.log("[ctlExames|DeleteExame] Valor regData:", JSON.stringify(regData));

    try {
      // @ Enviando dados para o servidor Backend
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteExames", regData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000, // @ 5 segundos de timeout
      });

      //console.log('[ctlExames|DeleteExame] Dados retornados:', response.data);

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      let msg = 'Erro ao deletar dados de exames no servidor backend';
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      } else if (error.message) {
        msg = error.message;
      }
      console.error('[ctlExames.js|DeleteExame] Erro ao deletar dados de exames no servidor backend:', msg);
      res.json({
        status: "Error",
        msg: msg,
        data: null,
        erro: null,
      });
    }
  })();

module.exports = {
  manutExames,
  insertExames,
  ViewExames,
  UpdateExame,
  DeleteExame
};