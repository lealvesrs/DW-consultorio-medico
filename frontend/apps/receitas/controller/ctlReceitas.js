const axios = require("axios");
const moment = require("moment");


const manutReceitas = async (req, res) =>
  (async () => {
    //@ Abre o formulário de manutenção de receitas
    const userName = req.session.userName;
    const token = req.session.token;
    
    //console.log("[ctlReceitas|ManutReceitas] Valor token:" + token)
    // try {
    let remoteMSG = null;
    let resp = null;
    try {
        resp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllReceitas", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Set JWT token in the header
            }
        });
        resp.data.registro.forEach((receita) => {
            receita.data_emissao = moment(receita.data_emissao).format("DD/MM/YYYY HH:mm:ss");
        });
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            remoteMSG = "Servidor indisponível"
        } else if (error.response && error.response.status === 401) {
            remoteMSG = "Usuário não autenticado";
        } else {
            remoteMSG = error.message;
        }

        res.render("receitas/view/vwManutReceitas.njk", {
            title: "Manutenção de Receitas ",
            data: null,
            erro: remoteMSG, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
            userName: userName,
        });
        return; // Sai se houver erro
    }

    res.render("receitas/view/vwManutReceitas.njk", {
      title: "Manutenção de Receitas ",
      data: resp.data.registro,
      erro: remoteMSG,
      userName: userName,
      
    });
  })();

const insertReceitas = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;
      

      //@ Busca os pacientes disponíveis
      let pacientes = null;
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
        return res.render("receitas/view/vwFCrReceitas.njk", {
            title: "Cadastro de Receitas ",
            data: null,
            erro: `Erro ao carregar paciente: ${error.message}`,
            paciente: null, 
            userName: null,
          });
      }


      return res.render("receitas/view/vwFCrReceitas.njk", {
        title: "Cadastro de Receitas ",
        data: null,
        erro: null, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
        paciente: pacientes.data.registro, // MUDANÇA: receita -> paciente (no frontend)
        userName: null,
      });

    } else {
      //@ POST
      const regData = req.body;
      const token = req.session.token;
      

      try {
        // @ Enviando dados para o servidor Backend
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertReceitas", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000, // @ 5 segundos de timeout
        });

        //console.log('[ctlReceitas|InsertReceitas] Dados retornados:', response.data);

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
        console.error('[ctlReceitas|InsertReceitas] Erro ao inserir dados no servidor backend:', msg);
        res.json({
          status: "Error",
          msg: msg,
          data: null,
          erro: null,
          
        });
      }
    }
  })();

const ViewReceitas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    
    let response = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetReceitaByID",
          {
            receita_id: id,
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
          const pacientes = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].data_emissao = moment(response.data.registro[0].data_emissao).format(
            "DD/MM/YYYY HH:mm:ss"
          );

          res.render("receitas/view/vwFRUDrReceitas.njk", {
            title: "Visualização de Receitas ",
            data: response.data.registro[0],
            disabled: true,
            paciente: pacientes.data.registro, 
            userName: userName,
          });
        } else {
          console.log("[ctlReceitas|ViewReceitas] ID de Receita não localizada!");
          res.json({ status: "[ctlReceitas.js|ViewReceitas] Receita não localizada!" });
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlReceitas.js|ViewReceitas] Receita não localizada!" });
      console.log(
        "[ctlReceitas.js|ViewReceitas] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

const UpdateReceita = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    
    let response = null;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetReceitaByID",
          {
            receita_id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log('[ctlReceitas|UpdateReceita] Dados retornados:', response.data);
        if (response.data.status == "ok") {
          //@ Busca os pacientes disponíveis
          const pacientes = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllPacientes", { 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].data_emissao = moment(response.data.registro[0].data_emissao).format("DD/MM/YYYY HH:mm:ss");

          res.render("receitas/view/vwFRUDrReceitas.njk", {
            title: "Atualização de dados de Receitas ", 
            data: response.data.registro[0],
            disabled: false,
            paciente: pacientes.data.registro, 
            userName: userName,
          });
        } else {
          console.log("[ctlReceitas|UpdateReceita] Dados não localizados");
          res.json({ status: "[ctlReceitas.js|UpdateReceita] Receita não localizada!" });
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        // console.log("[ctlReceitas|UpdateReceita] Valor regData:", JSON.stringify(regData));
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateReceitas", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000, // @ 5 segundos de timeout
          });

          //console.log('[ctlReceitas|InsertReceitas] Dados retornados:', response.data);

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          let msg = 'Erro ao atualizar dados de receitas no servidor backend';
          if (error.response && error.response.data && error.response.data.msg) {
            msg = error.response.data.msg;
          } else if (error.message) {
            msg = error.message;
          }
          console.error('[ctlReceitas.js|UpdateReceita] Erro ao atualizar dados de receitas no servidor backend:', msg);
          res.json({
            status: "Error",
            msg: msg,
            data: null,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlReceitas.js|UpdateReceita] Receita não localizada!" });
      console.log(
        "[ctlReceitas.js|UpdateReceita] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteReceita = async (req, res) =>
  (async () => {
    //@ POST
    const regData = req.body;
    const token = req.session.token;
    //console.log("[ctlReceitas|DeleteReceita] Valor regData:", JSON.stringify(regData));

    try {
      // @ Enviando dados para o servidor Backend
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteReceitas", regData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000, // @ 5 segundos de timeout
      });

      //console.log('[ctlReceitas|DeleteReceita] Dados retornados:', response.data);

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      let msg = 'Erro ao deletar dados de receitas no servidor backend';
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      } else if (error.message) {
        msg = error.message;
      }
      console.error('[ctlReceitas.js|DeleteReceita] Erro ao deletar dados de receitas no servidor backend:', msg);
      res.json({
        status: "Error",
        msg: msg,
        data: null,
        erro: null,
      });
    }
  })();

module.exports = {
  manutReceitas,
  insertReceitas,
  ViewReceitas,
  UpdateReceita,
  DeleteReceita
};