const Incidente = require('../Models/Incidente');

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

    // 4. Lógica Específica para "Resolvido"
    if (status === 'resolvido') {
      
      // Valida se o ficheiro foi enviado
      if (!pdfFileBase64) {
        return res.status(400).json({ message: "Para resolver, é obrigatório anexar o relatório PDF." });
      }

      dadosParaAtualizar.relatorioResolucao = pdfFileBase64; // Guarda o ficheiro
      dadosParaAtualizar.dataResolucao = new Date(); // Marca a hora da resolução
    }

    const incidenteAtualizado = await Incidente.findByIdAndUpdate(
      incident_id, 
      dadosParaAtualizar, 
      { new: true } // Opção para retornar o documento já atualizado
    );

    if (!incidenteAtualizado) {
      return res.status(404).json({ message: "Incidente não encontrado." });
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

module.exports = { resolverIncidente };
