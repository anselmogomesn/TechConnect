import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Guia Completo para Iniciar na Cunicultura",
    slug: "guia-completo-iniciar-cunicultura",
    excerpt:
      "Descubra tudo o que você precisa saber para começar sua criação de coelhos com sucesso, desde a escolha da raça até os cuidados essenciais.",
    content: `Começar na cunicultura é uma decisão emocionante e recompensadora. Seja para produção comercial, melhoramento genético ou como hobby, os coelhos são animais fascinantes que podem trazer grandes resultados com os cuidados adequados.

## Escolhendo a Raça Ideal

A primeira decisão importante é escolher qual raça criar. Para iniciantes, recomendamos raças como Califórnia e Nova Zelândia, que são rústicas, férteis e de fácil manejo. Para quem busca animais de estimação, as raças mini como Holland Lop e Netherland Dwarf são excelentes opções.

## Instalações Básicas

Antes de adquirir seus primeiros coelhos, é fundamental preparar as instalações. As gaiolas devem ser espaçosas, arejadas e protegidas de intempéries. A temperatura ideal para criação fica entre 15°C e 25°C.

## Alimentação

A base da alimentação deve ser o feno de capim (80% da dieta), complementado com ração específica e vegetais frescos. Água limpa e fresca deve estar sempre disponível.

## Cuidados Sanitários

Mantenha um calendário de vacinação e vermifugação. Observe seus animais diariamente para identificar precocemente qualquer sinal de doença.

Com dedicação e planejamento, a cunicultura pode ser uma atividade extremamente gratificante e lucrativa.`,
    category: "Iniciantes",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80",
    author: "Anselmo Gomes",
    authorRole: "Fundador da Cunicultura Cunicutado",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    date: "2025-12-15",
    readTime: "8 min",
    tags: ["iniciantes", "cunicultura", "guia", "cuidados"],
    comments: [
      {
        id: "c1",
        name: "Maria Silva",
        email: "maria@email.com",
        content: "Excelente guia! Comecei minha criação seguindo essas dicas e está dando super certo.",
        date: "2025-12-20",
        approved: true,
      },
    ],
  },
  {
    id: "b2",
    title: "Alimentação Natural vs Ração: O que é Melhor para seu Coelho?",
    slug: "alimentacao-natural-vs-racao-coelhos",
    excerpt:
      "Entenda os prós e contras de cada tipo de alimentação e descubra a melhor abordagem para a saúde do seu coelho.",
    content: `A alimentação é um dos pilares da criação de coelhos saudáveis. Muitos criadores se perguntam qual é a melhor abordagem: alimentação natural ou ração industrializada?

## A Importância do Feno

Independentemente da escolha, o feno de capim deve ser a base da alimentação. Ele fornece fibras longas essenciais para o funcionamento do sistema digestivo dos coelhos.

## Ração Industrializada

As rações extrusadas de qualidade oferecem nutrição balanceada e prática. São formuladas por nutricionistas animais e garantem que todos os nutrientes necessários sejam fornecidos nas proporções corretas.

## Alimentação Natural

Vegetais frescos, ervas e frutas podem complementar a dieta, mas devem ser introduzidos gradualmente. Nem todos os alimentos são seguros - alguns como alface americana em excesso e alimentos ricos em açúcar podem causar problemas.

## Nossa Recomendação

A melhor abordagem é combinar: feno à vontade, ração de qualidade medida por peso corporal, e porções controladas de vegetais frescos como complemento.`,
    category: "Alimentação",
    image: "https://images.unsplash.com/photo-1565708097881-bbf4f4c0e6b0?w=800&q=80",
    author: "Dra. Juliana Mendes",
    authorRole: "Veterinária Especialista",
    authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80",
    date: "2026-01-20",
    readTime: "6 min",
    tags: ["alimentação", "ração", "feno", "saúde"],
    comments: [],
  },
  {
    id: "b3",
    title: "Como Identificar os Sinais de Doença em Coelhos",
    slug: "sinais-doenca-coelhos",
    excerpt:
      "Aprenda a reconhecer os principais sinais de que seu coelho pode estar doente e saiba quando procurar um veterinário.",
    content: `Coelhos são animais presa por natureza e tendem a esconder sinais de doença. Por isso, é fundamental que o criador esteja atento a mudanças sutis no comportamento e aparência dos animais.

## Sinais de Alerta

- Falta de apetite ou redução na ingestão de água
- Alterações nas fezes (diminuição, diarreia ou fezes muito secas)
- Postura encurvada ou relutância em se movimentar
- Ranger de dentes (bruxismo) - pode indicar dor
- Secreção ocular ou nasal
- Perda de peso progressiva
- Alterações na pelagem (opaca, falhas)

## Prevenção

A melhor estratégia é a prevenção: mantenha as instalações limpas, ofereça alimentação de qualidade e siga o calendário de vacinação e vermifugação.

## Quando Procurar Ajuda

Ao primeiro sinal de anormalidade, entre em contato com um veterinário especializado em animais silvestres e exóticos.`,
    category: "Saúde",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    author: "Dra. Juliana Mendes",
    authorRole: "Veterinária Especialista",
    authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80",
    date: "2026-02-10",
    readTime: "7 min",
    tags: ["saúde", "doenças", "prevenção", "veterinário"],
    comments: [],
  },
  {
    id: "b4",
    title: "Melhoramento Genético na Cunicultura: Guia Prático",
    slug: "melhoramento-genetico-cunicultura",
    excerpt:
      "Conheça as técnicas de melhoramento genético aplicadas à cunicultura e como selecionar os melhores reprodutores.",
    content: `O melhoramento genético é uma ferramenta poderosa para criadores que buscam aprimorar seu plantel. Com técnicas adequadas de seleção, é possível obter animais superiores em características como porte, velocidade de crescimento e fertilidade.

## Fundamentos da Seleção

A seleção genética baseia-se na escolha dos melhores indivíduos para reprodução, considerando características de interesse econômico e padrão racial.

## Características a Observar

- Conformação corporal
- Peso e ganho de peso
- Temperamento
- Fertilidade e prolificidade
- Resistência sanitária

## Registros e Controle

Manter registros detalhados de cada animal é fundamental para o sucesso do melhoramento genético. Utilize fichas individuais e planilhas para acompanhar o desempenho.

## Parceria com a Cunicutado

Oferecemos reprodutores e matrizes selecionadas com pedigree e histórico genético completo para impulsionar seu programa de melhoramento.`,
    category: "Mercado",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80",
    author: "Anselmo Gomes",
    authorRole: "Fundador da Cunicultura Cunicutado",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    date: "2026-03-05",
    readTime: "10 min",
    tags: ["genética", "melhoramento", "reprodução", "seleção"],
    comments: [],
  },
];
