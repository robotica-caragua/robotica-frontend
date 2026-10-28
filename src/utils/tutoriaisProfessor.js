import containerImg from '@/assets/container.png'
import semaforo from '@/assets/semaforo.png'

// TODO: substituir pelos dados da API quando estiver disponível
export const tutoriaisProfessorPadrao = [
  {
    id: 1,
    titulo: 'Elevador de Papelão',
    status: 'rascunho',
    duracao: '08:45',
    visualizacoes: 0,
    infoData: 'Última alteração há 5 horas',
    nivel: 'Iniciante',
    categoria: 'Maker / Reciclagem (Sucata)',
    escola: 'EMEF Prof. Luiz Ribeiro Muniz',
    descricao:
      'Construa um elevador funcional em miniatura utilizando caixas de papelão reaproveitadas, barbante e um motor DC simples para ensinar conceitos de polias e força.',
    materiais: [
      { id: 1, nome: 'Caixa de papelão reciclada', selecionado: false },
      { id: 2, nome: 'Motor DC 3V–6V com redução', selecionado: false },
      { id: 3, nome: 'Barbante resistente e palitos de churrasco', selecionado: false }
    ],
    nomeVideo: 'elevador_papelao_aula.mp4',
    imagem: containerImg,
    visivel: true
  },
  {
    id: 2,
    titulo: 'Lixeira Automática com Sensor',
    status: 'publicado',
    duracao: '15:20',
    visualizacoes: 1240,
    infoData: 'Criado em 10/05/2026',
    nivel: 'Intermediário',
    categoria: 'Arduino e Automação (C++)',
    escola: 'EMEF Prof. Luiz Ribeiro Muniz',
    descricao:
      'Desenvolva uma lixeira inteligente que abre a tampa automaticamente ao detectar a aproximação das mãos usando um sensor ultrassônico HC-SR04 e um servomotor.',
    materiais: [
      { id: 1, nome: 'Microcontrolador Arduino Uno', selecionado: false },
      { id: 2, nome: 'Sensor Ultrassônico HC-SR04', selecionado: false },
      { id: 3, nome: 'Servomotor SG90 e cabos jumper', selecionado: false }
    ],
    nomeVideo: 'lixeira_automatica_sensor.mp4',
    imagem: semaforo,
    visivel: true
  },
  {
    id: 3,
    titulo: 'Barco a Motor de Isopor',
    status: 'publicado',
    duracao: '22:12',
    visualizacoes: 1676,
    infoData: 'Criado em 18/04/2026',
    nivel: 'Iniciante',
    categoria: 'Eletrônica Básica',
    escola: 'EMEF Prof. Luiz Silvar do Prado',
    descricao:
      'Monte um barco movido a hélice com bandeja de isopor reaproveitada, pilha AA e interruptor, explorando circuitos elétricos simples e empuxo.',
    materiais: [
      { id: 1, nome: 'Bandeja de isopor limpa', selecionado: false },
      { id: 2, nome: 'Mini motor DC com hélice plástica', selecionado: false },
      { id: 3, nome: 'Suporte para 2 pilhas AA e chave liga/desliga', selecionado: false }
    ],
    nomeVideo: 'barco_motor_isopor.mp4',
    imagem: containerImg,
    visivel: true
  },
  {
    id: 4,
    titulo: 'Carrinho Movido a Elástico',
    status: 'publicado',
    duracao: '22:12',
    visualizacoes: 2490,
    infoData: 'Criado em 02/04/2026',
    nivel: 'Avançado',
    categoria: 'Maker / Reciclagem (Sucata)',
    escola: 'EMEF Profª Maria Aparecida De Carvalho',
    descricao:
      'Protótipo de carrinho movido pela energia potencial elástica acumulada em elásticos de escritório, com chassi de palitos de picolé e rodas de tampinhas.',
    materiais: [
      { id: 1, nome: 'Palitos de picolé e canudos de papel', selecionado: false },
      { id: 2, nome: '4 tampinhas de garrafa PET (rodas)', selecionado: false },
      { id: 3, nome: 'Elásticos de escritório e cola quente', selecionado: false }
    ],
    nomeVideo: 'carrinho_elastico_passo_a_passo.mp4',
    imagem: semaforo,
    visivel: true
  }
]

export const buscarTutorialPorId = (id) => {
  const numId = Number(id)
  return tutoriaisProfessorPadrao.find((t) => t.id === numId) || tutoriaisProfessorPadrao[0]
}
