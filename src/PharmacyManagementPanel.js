import React, { useState } from 'react';
import { 
  Users, Package, BarChart3, Settings, Plus, Search, MapPin, 
  Clock, CheckCircle, AlertCircle, Bell, LogOut, Eye, Edit2, 
  Trash2, User, Phone, Home, TrendingUp, DollarSign, Activity 
} from 'lucide-react';

// Dados iniciais para demonstração
const dadosIniciais = {
  entregas: [
    {
      id: '1',
      cliente: { 
        nome: 'Maria Santos', 
        telefone: '(11) 99999-1234', 
        endereco: 'Rua das Flores, 123', 
        bairro: 'Centro' 
      },
      produtos: [{ nome: 'Dipirona 500mg', quantidade: 2, preco: 15.50 }],
      total: 31.00,
      taxaEntrega: 5.00,
      status: 'pendente',
      criadoEm: new Date(),
      entregador: null,
      prioridade: 'normal'
    },
    {
      id: '2',
      cliente: { 
        nome: 'João Silva', 
        telefone: '(11) 88888-5678', 
        endereco: 'Av. Principal, 456', 
        bairro: 'Jardins' 
      },
      produtos: [
        { nome: 'Paracetamol 750mg', quantidade: 1, preco: 8.90 }, 
        { nome: 'Vitamina C', quantidade: 1, preco: 25.00 }
      ],
      total: 33.90,
      taxaEntrega: 7.00,
      status: 'atribuida',
      entregador: 'Carlos Lima',
      criadoEm: new Date(),
      prioridade: 'urgente'
    },
    {
      id: '3',
      cliente: { 
        nome: 'Ana Costa', 
        telefone: '(11) 77777-9012', 
        endereco: 'Rua da Paz, 789', 
        bairro: 'Vila Nova' 
      },
      produtos: [{ nome: 'Ibuprofeno 400mg', quantidade: 3, preco: 12.90 }],
      total: 38.70,
      taxaEntrega: 6.00,
      status: 'concluida',
      entregador: 'Pedro Santos',
      criadoEm: new Date(),
      prioridade: 'normal'
    }
  ],
  clientes: [
    { 
      id: '1', 
      nome: 'Maria Santos', 
      telefone: '(11) 99999-1234', 
      endereco: 'Rua das Flores, 123', 
      bairro: 'Centro', 
      pedidos: 15 
    },
    { 
      id: '2', 
      nome: 'João Silva', 
      telefone: '(11) 88888-5678', 
      endereco: 'Av. Principal, 456', 
      bairro: 'Jardins', 
      pedidos: 8 
    },
    { 
      id: '3', 
      nome: 'Ana Costa', 
      telefone: '(11) 77777-9012', 
      endereco: 'Rua da Paz, 789', 
      bairro: 'Vila Nova', 
      pedidos: 23 
    },
    { 
      id: '4', 
      nome: 'Carlos Oliveira', 
      telefone: '(11) 66666-3456', 
      endereco: 'Av. Central, 321', 
      bairro: 'Centro', 
      pedidos: 5 
    }
  ],
  entregadores: [
    { id: '1', nome: 'Carlos Lima', status: 'disponivel', entregas: 12, nota: 4.8 },
    { id: '2', nome: 'Pedro Santos', status: 'ocupado', entregas: 8, nota: 4.6 },
    { id: '3', nome: 'Roberto Silva', status: 'offline', entregas: 15, nota: 4.9 }
  ]
};

function PainelGerencialFarmacia() {
  // Estados principais
  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  const [entregas, setEntregas] = useState(dadosIniciais.entregas);
  const [clientes, setClientes] = useState(dadosIniciais.clientes);
  const [entregadores] = useState(dadosIniciais.entregadores);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('');
  const [notificacoes, setNotificacoes] = useState([]);

  // Estados dos formulários
  const [formEntrega, setFormEntrega] = useState({
    clienteId: '',
    novoCliente: { nome: '', telefone: '', endereco: '', bairro: '' },
    produtos: [{ nome: '', quantidade: 1, preco: 0 }],
    taxaEntrega: 5.00,
    prioridade: 'normal',
    observacoes: ''
  });

  const [formCliente, setFormCliente] = useState({
    nome: '', telefone: '', endereco: '', bairro: ''
  });

  const [usuario] = useState({ 
    nome: 'João Gerente', 
    email: 'gerente@farmacia.com' 
  });

  // Estatísticas do dashboard
  const estatisticas = {
    entregasPendentes: entregas.filter(e => e.status === 'pendente').length,
    entregasAtivas: entregas.filter(e => e.status === 'atribuida' || e.status === 'em_andamento').length,
    entregasConcluidas: entregas.filter(e => e.status === 'concluida').length,
    receitaTotal: entregas.reduce((sum, e) => sum + e.total + e.taxaEntrega, 0),
    tempoMedio: '32 min',
    satisfacao: '4.7/5'
  };

  // Funções auxiliares
  const abrirModal = (tipo, item = null) => {
    setTipoModal(tipo);
    setItemSelecionado(item);
    setMostrarModal(true);
    
    if (tipo === 'editarCliente' && item) {
      setFormCliente(item);
    } else if (tipo === 'editarEntrega' && item) {
      setFormEntrega({
        clienteId: item.cliente.id || '',
        novoCliente: item.cliente,
        produtos: item.produtos,
        taxaEntrega: item.taxaEntrega,
        prioridade: item.prioridade,
        observacoes: item.observacoes || ''
      });
    }
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setTipoModal('');
    setItemSelecionado(null);
    setFormEntrega({
      clienteId: '',
      novoCliente: { nome: '', telefone: '', endereco: '', bairro: '' },
      produtos: [{ nome: '', quantidade: 1, preco: 0 }],
      taxaEntrega: 5.00,
      prioridade: 'normal',
      observacoes: ''
    });
    setFormCliente({ nome: '', telefone: '', endereco: '', bairro: '' });
  };

  const criarEntrega = () => {
    try {
      const cliente = formEntrega.clienteId ? 
        clientes.find(c => c.id === formEntrega.clienteId) : 
        formEntrega.novoCliente;

      const novaEntrega = {
        id: Date.now().toString(),
        cliente,
        produtos: formEntrega.produtos,
        total: formEntrega.produtos.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
        taxaEntrega: formEntrega.taxaEntrega,
        status: 'pendente',
        criadoEm: new Date(),
        entregador: null,
        prioridade: formEntrega.prioridade,
        observacoes: formEntrega.observacoes
      };

      setEntregas(prev => [novaEntrega, ...prev]);
      
      setNotificacoes(prev => [...prev, {
        id: Date.now().toString(),
        mensagem: `Nova entrega criada para ${cliente.nome}`,
        tipo: 'sucesso',
        timestamp: new Date()
      }]);

      fecharModal();
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
    }
  };

  const criarCliente = () => {
    try {
      const novoCliente = {
        id: Date.now().toString(),
        ...formCliente,
        pedidos: 0
      };

      setClientes(prev => [novoCliente, ...prev]);
      fecharModal();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const excluirEntrega = (id) => {
    setEntregas(prev => prev.filter(e => e.id !== id));
  };

  const excluirCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const adicionarProduto = () => {
    setFormEntrega(prev => ({
      ...prev,
      produtos: [...prev.produtos, { nome: '', quantidade: 1, preco: 0 }]
    }));
  };

  const removerProduto = (index) => {
    setFormEntrega(prev => ({
      ...prev,
      produtos: prev.produtos.filter((_, i) => i !== index)
    }));
  };

  const atualizarProduto = (index, campo, valor) => {
    setFormEntrega(prev => ({
      ...prev,
      produtos: prev.produtos.map((produto, i) => 
        i === index ? { ...produto, [campo]: valor } : produto
      )
    }));
  };

  const obterCorStatus = (status) => {
    switch(status) {
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'atribuida': return 'text-blue-600 bg-blue-100';
      case 'em_andamento': return 'text-purple-600 bg-purple-100';
      case 'concluida': return 'text-green-600 bg-green-100';
      case 'cancelada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obterTextoStatus = (status) => {
    switch(status) {
      case 'pendente': return 'Pendente';
      case 'atribuida': return 'Atribuída';
      case 'em_andamento': return 'Em andamento';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const obterCorPrioridade = (prioridade) => {
    switch(prioridade) {
      case 'urgente': return 'text-red-600';
      case 'alta': return 'text-orange-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Componente Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregas Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900">{estatisticas.entregasPendentes}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Andamento</p>
              <p className="text-2xl font-semibold text-gray-900">{estatisticas.entregasAtivas}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídas Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">{estatisticas.entregasConcluidas}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita do Dia</p>
              <p className="text-2xl font-semibold text-gray-900">
                R$ {estatisticas.receitaTotal.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entregas Recentes</h3>
          <div className="space-y-3">
            {entregas.slice(0, 5).map((entrega) => (
              <div key={entrega.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{entrega.cliente.nome}</p>
                  <p className="text-sm text-gray-600">{entrega.cliente.endereco}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${obterCorStatus(entrega.status)}`}>
                    {obterTextoStatus(entrega.status)}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">R$ {(entrega.total + entrega.taxaEntrega).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entregadores</h3>
          <div className="space-y-3">
            {entregadores.map((entregador) => (
              <div key={entregador.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{entregador.nome}</p>
                    <p className="text-sm text-gray-600">{entregador.entregas} entregas</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    entregador.status === 'disponivel' ? 'text-green-600 bg-green-100' :
                    entregador.status === 'ocupado' ? 'text-yellow-600 bg-yellow-100' :
                    'text-gray-600 bg-gray-100'
                  }`}>
                    {entregador.status === 'disponivel' ? 'Disponível' :
                     entregador.status === 'ocupado' ? 'Ocupado' : 'Offline'}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">★ {entregador.nota}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Entregas
  const renderEntregas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Entregas</h1>
          <p className="text-gray-600">Gerencie todas as entregas da farmácia</p>
        </div>
        <button
          onClick={() => abrirModal('novaEntrega')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Entrega</span>
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Todos os status</option>
          <option>Pendente</option>
          <option>Atribuída</option>
          <option>Em andamento</option>
          <option>Concluída</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entregas.map((entrega) => (
                <tr key={entrega.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entrega.cliente.nome}</div>
                      <div className="text-sm text-gray-500">{entrega.cliente.telefone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{entrega.cliente.endereco}</div>
                    <div className="text-sm text-gray-500">{entrega.cliente.bairro}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {entrega.produtos.map((produto, idx) => (
                        <div key={idx}>{produto.quantidade}x {produto.nome}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">R$ {(entrega.total + entrega.taxaEntrega).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Taxa: R$ {entrega.taxaEntrega.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${obterCorStatus(entrega.status)}`}>
                      {obterTextoStatus(entrega.status)}
                    </span>
                    {entrega.prioridade === 'urgente' && (
                      <AlertCircle className={`h-4 w-4 inline ml-1 ${obterCorPrioridade(entrega.prioridade)}`} />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entrega.entregador || 'Não atribuída'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => abrirModal('verEntrega', entrega)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => abrirModal('editarEntrega', entrega)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => excluirEntrega(entrega.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Componente Clientes
  const renderClientes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie o cadastro de clientes</p>
        </div>
        <button
          onClick={() => abrirModal('novoCliente')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => abrirModal('editarCliente', cliente)}
                  className="text-gray-400 hover:text-yellow-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => excluirCliente(cliente.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{cliente.nome}</h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{cliente.telefone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>{cliente.endereco}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{cliente.bairro}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de pedidos</span>
                <span className="font-medium text-gray-900">{cliente.pedidos}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Componente Modal
  const renderModal = () => {
    if (!mostrarModal) return null;

    const conteudoModal = () => {
      switch (tipoModal) {
        case 'novaEntrega':
        case 'editarEntrega':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {tipoModal === 'novaEntrega' ? 'Nova Entrega' : 'Editar Entrega'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select 
                  value={formEntrega.clienteId}
                  onChange={(e) => setFormEntrega(prev => ({ ...prev, clienteId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Novo cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>

              {!formEntrega.clienteId && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={formEntrega.novoCliente.nome}
                    onChange={(e) => setFormEntrega(prev => ({ 
                      ...prev, 
                      novoCliente: { ...prev.novoCliente, nome: e.target.value }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={formEntrega.novoCliente.telefone}
                    onChange={(e) => setFormEntrega(prev => ({ 
                      ...prev, 
                      novoCliente: { ...prev.novoCliente, telefone: e.target.value }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={formEntrega.novoCliente.endereco}
                    onChange={(e) => setFormEntrega(prev => ({ 
                      ...prev, 
                      novoCliente: { ...prev.novoCliente, endereco: e.target.value }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={formEntrega.novoCliente.bairro}
                    onChange={(e) => setFormEntrega(prev => ({ 
                      ...prev, 
                      novoCliente: { ...prev.novoCliente, bairro: e.target.value }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Produtos</label>
                  <button
                    type="button"
                    onClick={adicionarProduto}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Adicionar produto
                  </button>
                </div>
                {formEntrega.produtos.map((produto, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={produto.nome}
                      onChange={(e) => atualizarProduto(index, 'nome', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Qtd"
                      value={produto.quantidade}
                      onChange={(e) => atualizarProduto(index, 'quantidade', parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Preço"
                      step="0.01"
                      value={produto.preco}
                      onChange={(e) => atualizarProduto(index, 'preco', parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formEntrega.produtos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerProduto(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Entrega</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formEntrega.taxaEntrega}
                    onChange={(e) => setFormEntrega(prev => ({ ...prev, taxaEntrega: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select 
                    value={formEntrega.prioridade}
                    onChange={(e) => setFormEntrega(prev => ({ ...prev, prioridade: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={formEntrega.observacoes}
                  onChange={(e) => setFormEntrega(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observações sobre a entrega..."
                />
              </div>
            </div>
          );

        case 'novoCliente':
        case 'editarCliente':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {tipoModal === 'novoCliente' ? 'Novo Cliente' : 'Editar Cliente'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={formCliente.nome}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, nome: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Telefone"
                  value={formCliente.telefone}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, telefone: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Endereço completo"
                  value={formCliente.endereco}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, endereco: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Bairro"
                  value={formCliente.bairro}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, bairro: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {conteudoModal()}
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={fecharModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={tipoModal.includes('Cliente') ? criarCliente : criarEntrega}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {tipoModal.startsWith('novo') ? 'Criar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const itensMenu = [
    { id: 'dashboard', icone: BarChart3, label: 'Dashboard', ativo: paginaAtual === 'dashboard' },
    { id: 'entregas', icone: Package, label: 'Entregas', ativo: paginaAtual === 'entregas' },
    { id: 'clientes', icone: Users, label: 'Clientes', ativo: paginaAtual === 'clientes' },
    { id: 'relatorios', icone: TrendingUp, label: 'Relatórios', ativo: paginaAtual === 'relatorios' },
    { id: 'configuracoes', icone: Settings, label: 'Configurações', ativo: paginaAtual === 'configuracoes' }
  ];

  const renderConteudo = () => {
    switch (paginaAtual) {
      case 'dashboard': return renderDashboard();
      case 'entregas': return renderEntregas();
      case 'clientes': return renderClientes();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Farmácia Plus</h1>
          <p className="text-sm text-gray-600">Sistema de Gestão</p>
        </div>
        
        <nav className="mt-6 flex-1">
          {itensMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setPaginaAtual(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                item.ativo 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icone className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{usuario.nome}</p>
              <p className="text-xs text-gray-600">{usuario.email}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {paginaAtual === 'dashboard' && 'Dashboard'}
                {paginaAtual === 'entregas' && 'Entregas'}
                {paginaAtual === 'clientes' && 'Clientes'}
                {paginaAtual === 'relatorios' && 'Relatórios'}
                {paginaAtual === 'configuracoes' && 'Configurações'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="h-5 w-5" />
                  {notificacoes.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {notificacoes.length}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{usuario.nome}</p>
                <p className="text-xs text-gray-600">{usuario.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderConteudo()}
        </main>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
}

export default PainelGerencialFarmacia;