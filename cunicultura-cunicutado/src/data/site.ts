import { NavItem } from "@/types";

export const siteConfig = {
  name: "Cunicultura Cunicutado",
  tagline: "Qualidade, genética e paixão na criação de coelhos.",
  description:
    "Especializada na criação, comercialização e distribuição de coelhos de alta qualidade, além de produtos, acessórios e serviços para cunicultura.",
  founder: "Anselmo Gomes",
  foundedYear: 2018,
  email: "contato@cuniculturacunicutado.com.br",
  phone: "(11) 99999-8888",
  whatsapp: "5511999998888",
  address: {
    street: "Estrada Municipal dos Coelhos",
    number: "123",
    complement: "Sítio Cunicutado",
    neighborhood: "Zona Rural",
    city: "São Paulo",
    state: "SP",
    zipCode: "08000-000",
  },
  businessHours: {
    weekdays: "Seg a Sex: 08h - 18h",
    saturday: "Sáb: 08h - 12h",
    sunday: "Dom: Fechado",
  },
  social: {
    facebook: "https://facebook.com/cuniculturacunicutado",
    instagram: "https://instagram.com/cuniculturacunicutado",
    tiktok: "https://tiktok.com/@cuniculturacunicutado",
    youtube: "https://youtube.com/@cuniculturacunicutado",
  },
};

export const navigation: NavItem[] = [
  { label: "Início", href: "/" },
  {
    label: "Coelhos",
    href: "/catalogo",
    children: [
      { label: "Gigantes", href: "/catalogo?categoria=gigantes" },
      { label: "Médios", href: "/catalogo?categoria=medios" },
      { label: "Mini", href: "/catalogo?categoria=mini" },
      { label: "Anões", href: "/catalogo?categoria=anoes" },
      { label: "Reprodutores", href: "/catalogo?categoria=reprodutores" },
      { label: "Matrizes", href: "/catalogo?categoria=matrizes" },
      { label: "Filhotes", href: "/catalogo?categoria=filhotes" },
    ],
  },
  {
    label: "Loja",
    href: "/loja",
    children: [
      { label: "Rações", href: "/loja?categoria=racoes" },
      { label: "Fenos", href: "/loja?categoria=fenos" },
      { label: "Vitaminas", href: "/loja?categoria=vitaminas" },
      { label: "Gaiolas", href: "/loja?categoria=gaiolas" },
      { label: "Acessórios", href: "/loja?categoria=acessorios" },
      { label: "Kits", href: "/loja?categoria=kits" },
    ],
  },
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contato", href: "/contato" },
];

export const advantages = [
  {
    icon: "🐰",
    title: "Coelhos Saudáveis",
    description: "Criados com os mais altos padrões de bem-estar animal e genética superior.",
  },
  {
    icon: "🚚",
    title: "Entrega Segura",
    description: "Transporte especializado com todo conforto e segurança para os animais.",
  },
  {
    icon: "👨‍🔬",
    title: "Atendimento Especializado",
    description: "Equipe técnica qualificada para orientar em todas as etapas.",
  },
  {
    icon: "🏆",
    title: "Garantia de Qualidade",
    description: "Todos os animais e produtos com garantia e certificação de qualidade.",
  },
];

export const stats = [
  { value: "500+", label: "Coelhos Entregues" },
  { value: "50+", label: "Raças Diferentes" },
  { value: "6+", label: "Anos de Experiência" },
  { value: "98%", label: "Clientes Satisfeitos" },
];

export const categoriesHome = [
  { name: "Coelhos Gigantes", image: "/images/categories/gigantes.jpg", href: "/catalogo?categoria=gigantes", count: 12 },
  { name: "Mini Coelhos", image: "/images/categories/mini.jpg", href: "/catalogo?categoria=mini", count: 8 },
  { name: "Filhotes", image: "/images/categories/filhotes.jpg", href: "/catalogo?categoria=filhotes", count: 15 },
  { name: "Rações Premium", image: "/images/categories/racoes.jpg", href: "/loja?categoria=racoes", count: 24 },
  { name: "Gaiolas", image: "/images/categories/gaiolas.jpg", href: "/loja?categoria=gaiolas", count: 18 },
  { name: "Kits Completos", image: "/images/categories/kits.jpg", href: "/loja?categoria=kits", count: 10 },
];

export const partners = [
  { name: "ABNC", logo: "/images/partners/abnc.png" },
  { name: "Matsuda", logo: "/images/partners/matsuda.png" },
  { name: "Suprema", logo: "/images/partners/suprema.png" },
  { name: "AgroGen", logo: "/images/partners/agrogen.png" },
  { name: "VetRabbit", logo: "/images/partners/vetrabbit.png" },
  { name: "NutriCoelhos", logo: "/images/partners/nutricelhos.png" },
];

export const testimonials = [
  {
    id: "1",
    name: "Carlos Mendes",
    role: "Criador Profissional",
    avatar: "CM",
    content: "Adquiri uma matriz da Cunicutado e a qualidade genética é excepcional. O suporte técnico que recebo é incomparável. Recomendo a todos!",
    rating: 5,
  },
  {
    id: "2",
    name: "Ana Beatriz",
    role: "Criadora Amadora",
    avatar: "AB",
    content: "Comecei na cunicultura com um kit inicial da Cunicutado. As orientações e a qualidade dos animais fizeram toda a diferença no meu início.",
    rating: 5,
  },
  {
    id: "3",
    name: "Roberto Lima",
    role: "Veterinário",
    avatar: "RL",
    content: "Como veterinário especializado em pequenos animais, posso atestar a excelência no manejo e bem-estar dos coelhos da Cunicutado. Referência no setor.",
    rating: 5,
  },
  {
    id: "4",
    name: "Juliana Castro",
    role: "Pet Lover",
    avatar: "JC",
    content: "Comprei um mini coelho para minha filha e foi uma experiência incrível. O animal é saudável, dócil e veio com toda documentação e guia de cuidados.",
    rating: 5,
  },
];

export const faqCategories = [
  {
    id: "geral",
    title: "Geral",
    icon: "📋",
    questions: [
      { id: "faq1", question: "O que é cunicultura?", answer: "Cunicultura é a criação de coelhos para fins comerciais, que podem incluir produção de carne, pele, lã, ou para animais de estimação e reprodução." },
      { id: "faq2", question: "A Cunicultura Cunicutado vende para todo o Brasil?", answer: "Sim, realizamos entregas para todo o território nacional através de transportadoras especializadas e com todo cuidado necessário para o bem-estar dos animais." },
      { id: "faq3", question: "Qual a idade mínima para adquirir um coelho?", answer: "Recomendamos que os filhotes sejam separados da mãe a partir de 60 dias de vida, quando já estão completamente desmamados e prontos para novos lares." },
    ],
  },
  {
    id: "cuidados",
    title: "Cuidados",
    icon: "❤️",
    questions: [
      { id: "faq4", question: "Qual a alimentação ideal para coelhos?", answer: "A alimentação deve ser baseada em feno de capim (80% da dieta), ração específica para coelhos, vegetais frescos e água fresca sempre disponível." },
      { id: "faq5", question: "Coelhos precisam de vacinação?", answer: "Sim, embora não sejam tão comuns como em cães e gatos, existem vacinas importantes para coelhos como a contra Mixomatose e Doença Hemorrágica Viral." },
      { id: "faq6", question: "Qual o espaço ideal para criar um coelho?", answer: "Coelhos precisam de espaço para se movimentar. Uma gaiola deve ter no mínimo 4x o tamanho do animal, e recomenda-se tempo diário fora da gaiola para exercícios." },
    ],
  },
  {
    id: "compras",
    title: "Compras e Entregas",
    icon: "🛒",
    questions: [
      { id: "faq7", question: "Quais as formas de pagamento?", answer: "Aceitamos cartões de crédito (parcelado em até 12x), débito, PIX, boleto bancário e transferência bancária." },
      { id: "faq8", question: "Qual o prazo de entrega?", answer: "O prazo varia conforme a região. Para a Grande São Paulo, entregamos em até 48h. Para as demais regiões, o prazo é de 5 a 15 dias úteis." },
      { id: "faq9", question: "Posso visitar o criatório antes de comprar?", answer: "Sim! Agendamos visitas monitoradas ao nosso criatório para que você conheça de perto nossas instalações e animais." },
    ],
  },
];
