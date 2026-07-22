import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "s1",
    title: "Consultoria Especializada",
    slug: "consultoria",
    description: "Orientação profissional para criadores iniciantes e experientes.",
    longDescription:
      "Oferecemos consultoria completa para quem deseja iniciar ou aprimorar sua criação de coelhos. Nossa equipe técnica visita suas instalações, avalia o manejo atual e elabora um plano de melhorias personalizado, abrangendo nutrição, reprodução, sanidade e gestão.",
    icon: "👨‍🔬",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    features: [
      "Diagnóstico completo do criatório",
      "Plano de melhorias personalizado",
      "Orientação nutricional e sanitária",
      "Acompanhamento periódico",
      "Relatórios técnicos detalhados",
    ],
    cta: "Solicitar Consultoria",
  },
  {
    id: "s2",
    title: "Assistência Técnica",
    slug: "assistencia-tecnica",
    description: "Suporte técnico contínuo para manutenção da qualidade do plantel.",
    longDescription:
      "Nosso serviço de assistência técnica oferece suporte contínuo para criadores que buscam manter e melhorar a qualidade do seu plantel. Inclui visitas regulares, exames sanitários, avaliação genética e orientação sobre melhores práticas de manejo.",
    icon: "🩺",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80",
    features: [
      "Visitas técnicas regulares",
      "Avaliação sanitária do plantel",
      "Exames laboratoriais",
      "Programa de vacinação",
      "Suporte remoto via WhatsApp",
    ],
    cta: "Contratar Assistência",
  },
  {
    id: "s3",
    title: "Cursos e Treinamentos",
    slug: "cursos",
    description: "Capacitação completa em cunicultura para todos os níveis.",
    longDescription:
      "Oferecemos cursos presenciais e online para todos os níveis, do iniciante ao avançado. Nossos treinamentos abordam desde conceitos básicos de manejo até técnicas avançadas de melhoramento genético e gestão empresarial aplicada à cunicultura.",
    icon: "🎓",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    features: [
      "Curso Básico de Cunicultura",
      "Treinamento Avançado em Reprodução",
      "Workshop de Manejo Sanitário",
      "Gestão Empresarial para Criadores",
      "Certificado de conclusão",
    ],
    cta: "Ver Cursos",
  },
  {
    id: "s4",
    title: "Projetos de Instalações",
    slug: "projetos-instalacoes",
    description: "Projetos personalizados de instalações para cunicultura.",
    longDescription:
      "Desenvolvemos projetos completos de instalações para cunicultura, desde pequenos criatórios caseiros até granjas comerciais de grande porte. Nossa equipe de engenheiros e zootecnistas elabora projetos funcionais, sustentáveis e que otimizam o bem-estar animal.",
    icon: "🏗️",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    features: [
      "Projeto arquitetônico personalizado",
      "Dimensionamento de instalações",
      "Sistemas de climatização",
      "Automação e tecnologia",
      "Acompanhamento de obra",
    ],
    cta: "Solicitar Projeto",
  },
  {
    id: "s5",
    title: "Planejamento de Granjas",
    slug: "planejamento-granjas",
    description: "Planejamento estratégico para implantação de granjas comerciais.",
    longDescription:
      "Serviço completo de planejamento para implantação de granjas comerciais de coelhos. Inclui estudo de viabilidade, dimensionamento de plantel, cronograma de implantação, seleção genética inicial e suporte nos primeiros meses de operação.",
    icon: "📋",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    features: [
      "Estudo de viabilidade econômica",
      "Dimensionamento do plantel",
      "Cronograma de implantação",
      "Seleção genética inicial",
      "Suporte operacional inicial",
    ],
    cta: "Solicitar Planejamento",
  },
  {
    id: "s6",
    title: "Entrega de Animais",
    slug: "entrega-animais",
    description: "Serviço especializado de transporte e entrega de animais.",
    longDescription:
      "Serviço de entrega com transporte especializado que garante o bem-estar dos animais durante todo o percurso. Veículos climatizados, motoristas treinados e documentação sanitária completa. Entregamos em todo o Brasil.",
    icon: "🚚",
    image: "https://images.unsplash.com/photo-1578575436950-218d09e9efb5?w=800&q=80",
    features: [
      "Transporte climatizado",
      "Equipe treinada em manejo",
      "Documentação sanitária",
      "Seguro de transporte",
      "Rastreamento em tempo real",
    ],
    cta: "Solicitar Entrega",
  },
];
