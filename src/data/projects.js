import { Layout, TrendingUp, Target } from 'lucide-react';

export const projectsData = [
  {
    id: 1,
    title: "Ballet Fit Management System",
    category: "dev",
    subtitle: "Product Strategy & Development",
    description: "Más que una PWA, fue un proceso de consultoría. Identifiqué las necesidades críticas del estudio para digitalizar asistencias y créditos, creando una herramienta práctica que evoluciona con el negocio.",
    tech: ["React", "Firebase", "Product Discovery", "UX Logic"],
    icon: Layout // Guardamos la referencia al icono
  },
  {
    id: 2,
    title: "Marketing & Conversion",
    category: "marketing",
    subtitle: "Estrategia Basada en Datos",
    description: "Análisis de funnels y optimización de presencia digital. Aplico mi formación en marketing para asegurar que cada desarrollo tenga un objetivo comercial claro.",
    tech: ["Conversion Rate", "Strategy", "User Behavior"],
    icon: Target
  },
  {
    id: 3,
    title: "Data Insights for Business",
    category: "data",
    subtitle: "Análisis con R & SQL",
    description: "Transformación de datos económicos complejos en visualizaciones que permiten tomar decisiones. Uso de IA para acelerar la limpieza y el procesamiento de información.",
    tech: ["R Language", "SQL", "Predictive Logic"],
    icon: TrendingUp
  }
];