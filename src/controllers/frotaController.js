const frotaRepository = require('../repositories/frotaRepository');

class FrotaController {
  async listar(req, res) {
    try {
      // Permite paginação dinâmica via req.query (ex: /frota?limite=100&offset=0)
      const limite = parseInt(req.query.limite) || 500;
      const offset = parseInt(req.query.offset) || 0;

      const veiculos = await frotaRepository.listarTodos(limite, offset);
      res.status(200).json(veiculos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  }

  async buscarDetalhes(req, res) {
    try {
      const veiculo = await frotaRepository.buscarPorId(req.params.id);
      if (!veiculo) return res.status(404).json({ mensagem: 'Veículo não encontrado.' });

      res.status(200).json(veiculo);
    } catch (error) {
      res.status(500).json({ erro: 'Falha na busca.' });
    }
  }

  async registrar(req, res) {
    try {
      const { id, tipo } = req.body;
      if (!id || !tipo) {
        return res.status(400).json({ erro: 'ID e Tipo são obrigatórios.' });
      }

      const novoVeiculo = await frotaRepository.criar(req.body);
      res.status(201).json(novoVeiculo);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao inserir. ID duplicado?' });
    }
  }

  async atualizarTelemetria(req, res) {
    try {
      const { vel, latitude, longitude } = req.body;
      if (vel === undefined || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ erro: 'Velocidade, latitude e longitude são obrigatórios.' });
      }

      const sucesso = await frotaRepository.atualizar(req.params.id, { vel, latitude, longitude });
      if (!sucesso) return res.status(404).json({ mensagem: 'Veículo inexistente.' });

      res.status(200).json({ mensagem: 'Telemetria atualizada.' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro no Update SQL.' });
    }
  }

  async remover(req, res) {
    try {
      const sucesso = await frotaRepository.deletar(req.params.id);
      if (!sucesso) return res.status(404).json({ mensagem: 'Veículo inexistente.' });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ erro: 'Falha ao deletar.' });
    }
  }
}

module.exports = new FrotaController();