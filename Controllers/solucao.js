const Incidente = require('../Models/Incidente');
const Notificacao = require('../Models/Notificacao');

const listarIncidentesTecnico = async (req, res) => {
  try {
    const tec_id = req.user.id;

    const incidentes = await Incidente.find({ 
        id_tecnico: tec_id,
        estado: { $ne: 'Resolvido' } 
    })
    .select('nome data _id')
    .sort({ data: -1 });

    res.json(incidentes);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar incidentes do técnico." });
  }
};

const resolverIncidente = async (req, res) =>{
    const {
        incident_id,
        status,
        observacao,
        pdfFileBase64
    } = req.body;

    const tec_id = req.user.id;
    
    if (!incident_id || !status || !tec_id) {
    return res.status(400).json({ message: "Dados essenciais em falta (ID ou Estado)." });
  }

  try {
    let dadosParaAtualizar = {
      id_tecnico: tec_id,
      estado: status === 'resolvido' ? 'Resolvido' : 'Não Resolvido',
      observacoesTecnicas: observacao
    };

    if (status === 'resolvido') {
      
      if (!pdfFileBase64) {
        return res.status(400).json({ message: "Para resolver, é obrigatório anexar o relatório PDF." });
      }

      dadosParaAtualizar.relatorioResolucao = pdfFileBase64;
      dadosParaAtualizar.dataResolucao = new Date();
    }

    const incidenteAtualizado = await Incidente.findByIdAndUpdate(
      incident_id, 
      dadosParaAtualizar, 
      { new: true }
    );

    if (!incidenteAtualizado) {
      return res.status(404).json({ message: "Incidente não encontrado." });
    }

    if (dadosParaAtualizar.estado === 'Resolvido') {
      await Notificacao.create({
        id_incidente: incidenteAtualizado._id,
        id_utilizador: incidenteAtualizado.id_cliente,
        destinatario_tipo: 'cliente',
        mensagem: `O seu incidente "${incidenteAtualizado.nome}" foi resolvido.`
      });
    }

    res.status(200).json({ 
      message: "Incidente atualizado com sucesso!", 
      incidente: incidenteAtualizado 
    });

    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno ao processar a resolução." });
  }
};

module.exports = { resolverIncidente, listarIncidentesTecnico };
