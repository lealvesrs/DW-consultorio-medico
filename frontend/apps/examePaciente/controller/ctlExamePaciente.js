const axios = require("axios");
const moment = require("moment");


const manutExamePaciente = async (req, res) =>
  (async () => {
    //@ Abre o formulário de manutenção de examePaciente
    const userName = req.session.userName;
    const token = req.session.token;
    
    //console.log("[ctlExamePaciente|ManutExamePaciente] Valor token:" + token)
    // try {
    let remoteMSG = null;
    let resp = null;
    try {
        resp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllExamePaciente", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Set JWT token in the header
            }
        });
        resp.data.registro.forEach((examePaciente) => {
            examePaciente.data_exame = moment(examePaciente.data_exame).format("DD/MM/YYYY HH:mm");
        });
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            remoteMSG = "Servidor indisponível"
        } else if (error.response && error.response.status === 401) {
            remoteMSG = "Usuário não autenticado";
        } else {
            remoteMSG = error.message;
        }

        res.render("examePaciente/view/vwManutExamePaciente.njk", {
            title: "Manutenção de Exame Realizado",
            data: null,
            erro: remoteMSG, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
            userName: userName,
        });
        return; // Sai se houver erro
    }

    res.render("examePaciente/view/vwManutExamePaciente.njk", {
      title: "Manutenção de Exame Realizado ",
      data: resp.data.registro,
      erro: remoteMSG,
      userName: userName,
      
    });
  })();

const insertExamePaciente = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;
      

      //@ Busca os pacientes disponíveis
      let pacientes = null;
      let exames = null;
      try {
        pacientes = await axios.get(
          process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { // MUDANÇA: /GetAllPacientes -> /GetAllPacientes
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Set JWT token in the header
          }
        });

        exames = await axios.get(
          process.env.SERVIDOR_DW3Back + "/GetAllExames", { 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Set JWT token in the header
          }
        });
      } catch (error) {
        console.error('Erro ao buscar pacientes no servidor backend:', error.message);
        // Pode-se tratar o erro aqui, por exemplo, renderizando a página sem a lista
        // Ou com uma mensagem de erro específica para o formulário
        return res.render("examePaciente/view/vwFCrExamePaciente.njk", {
            title: "Cadastro de Exame Realizado ",
            data: null,
            erro: `Erro ao carregar paciente: ${error.message}`,
            paciente: null, 
            exame: null, 
            userName: null,
          });
      }


      return res.render("examePaciente/view/vwFCrExamePaciente.njk", {
        title: "Cadastro de Exame Realizado ",
        data: null,
        erro: null, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
        paciente: pacientes.data.registro,
        exame: exames.data.registro, 
        userName: null,
      });

    } else {
      //@ POST
      const regData = req.body;
      const token = req.session.token;
      

      try {
        // @ Enviando dados para o servidor Backend
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertExamePaciente", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000, // @ 5 segundos de timeout
        });

        //console.log('[ctlExamePaciente|InsertExamePaciente] Dados retornados:', response.data);

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
        console.error('[ctlExamePaciente|InsertExamePaciente] Erro ao inserir dados no servidor backend:', msg);
        res.json({
          status: "Error",
          msg: msg,
          data: null,
          erro: null,
          
        });
      }
    }
  })();

const ViewExamePaciente = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    
    let response = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetExamePacienteByID",
          {
            exame_paciente_id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          response.data.registro[0].data_exame = moment(response.data.registro[0].data_exame)
          .format("YYYY-MM-DDTHH:mm");


          //@ Busca os pacientes disponíveis
          const pacientes = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          const exames = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllExames", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          res.render("examePaciente/view/vwFRUDrExamePaciente.njk", {
            title: "Visualização de Exame Realizado ",
            data: response.data.registro[0],
            disabled: true,
            paciente: pacientes.data.registro, 
            exame: exames.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlExamePaciente|ViewExamePaciente] ID de ExamePaciente não localizado!");
          res.json({ status: "[ctlExamePaciente.js|ViewExamePaciente] ExamePaciente não localizado!" });
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlExamePaciente.js|ViewExamePaciente] ExamePaciente não localizado!" });
      console.log(
        "[ctlExamePaciente.js|ViewExamePaciente] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

const UpdateExamePaciente = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    
    let response = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetExamePacienteByID",
          {
            exame_paciente_id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log('[ctlExamePaciente|UpdateExamePaciente] Dados retornados:', response.data);
        if (response.data.status == "ok") {
          //@ Busca os pacientes disponíveis
          const pacientes = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          const exames = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllExames", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].data_exame = moment(response.data.registro[0].data_exame)
          .format("YYYY-MM-DDTHH:mm");


          res.render("examePaciente/view/vwFRUDrExamePaciente.njk", {
            title: "Atualização de dados de Exame Realizado ", 
            data: response.data.registro[0],
            disabled: false,
            paciente: pacientes.data.registro, 
            exame: exames.data.registro, 
            userName: userName,
          });
        } else {
          console.log("[ctlExamePaciente|UpdateExamePaciente] Dados não localizados");
          res.json({ status: "[ctlExamePaciente.js|UpdateExamePaciente] ExamePaciente não localizado!" });
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        // console.log("[ctlExamePaciente|UpdateExamePaciente] Valor regData:", JSON.stringify(regData));
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateExamePaciente", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000, // @ 5 segundos de timeout
          });

          //console.log('[ctlExamePaciente|InsertExamePaciente] Dados retornados:', response.data);

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          let msg = 'Erro ao atualizar dados de examePaciente no servidor backend';
          if (error.response && error.response.data && error.response.data.msg) {
            msg = error.response.data.msg;
          } else if (error.message) {
            msg = error.message;
          }
          console.error('[ctlExamePaciente.js|UpdateExamePaciente] Erro ao atualizar dados de examePaciente no servidor backend:', msg);
          res.json({
            status: "Error",
            msg: msg,
            data: null,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlExamePaciente.js|UpdateExamePaciente] ExamePaciente não localizado!" });
      console.log(
        "[ctlExamePaciente.js|UpdateExamePaciente] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteExamePaciente = async (req, res) =>
  (async () => {
    //@ POST
    const regData = req.body;
    const token = req.session.token;
    //console.log("[ctlExamePaciente|DeleteExamePaciente] Valor regData:", JSON.stringify(regData));

    try {
      // @ Enviando dados para o servidor Backend
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteExamePaciente", regData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000, // @ 5 segundos de timeout
      });

      //console.log('[ctlExamePaciente|DeleteExamePaciente] Dados retornados:', response.data);

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      let msg = 'Erro ao deletar dados de examePaciente no servidor backend';
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      } else if (error.message) {
        msg = error.message;
      }
      console.error('[ctlExamePaciente.js|DeleteExamePaciente] Erro ao deletar dados de examePaciente no servidor backend:', msg);
      res.json({
        status: "Error",
        msg: msg,
        data: null,
        erro: null,
      });
    }
  })();

module.exports = {
  manutExamePaciente,
  insertExamePaciente,
  ViewExamePaciente,
  UpdateExamePaciente,
  DeleteExamePaciente
};