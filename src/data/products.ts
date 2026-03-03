import type { CategorySlug } from './categories';

export interface Product {
  name: string;
  slug: string;
  category: CategorySlug;
  shortDesc: string;
  description: string;
  specs: string[];
  materials: string[];
  images: string[];
  featured?: boolean;
  fscEligible?: boolean;
}

export const products: Product[] = [
  // --- PAPELERÍA CORPORATIVA ---
  {
    name: 'Tarjetas de Presentación',
    slug: 'tarjetas-de-presentacion',
    category: 'papeleria-corporativa',
    shortDesc: 'Tarjetas de presentación profesionales en múltiples terminaciones.',
    description:
      'Tarjetas de presentación de alta resolución impresas en offset o digital. Disponibles en papel couché, kraft, y especiales. Terminaciones en barniz UV, laminado mate o brillo, relieve y más.',
    specs: [
      'Formato estándar: 9 × 5 cm',
      'Gramaje: 300–400 g/m²',
      'Impresión: offset o digital',
      'Cantidad mínima: 100 unidades',
    ],
    materials: ['Couché 300 g', 'Couché 350 g', 'Kraft', 'Papel especial'],
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80'],
    featured: true,
    fscEligible: true,
  },
  {
    name: 'Carpetas Corporativas',
    slug: 'carpetas-corporativas',
    category: 'papeleria-corporativa',
    shortDesc: 'Carpetas con solapas y bolsillos para presentaciones ejecutivas.',
    description:
      'Carpetas corporativas personalizadas con solapas interiores, bolsillos para tarjetas y acabados premium. Ideales para presentaciones, licitaciones y kits de bienvenida.',
    specs: [
      'Formato: A4 cerrada',
      'Gramaje: 350 g/m² couché',
      'Con bolsillo interior para documentos',
      'Cantidad mínima: 50 unidades',
    ],
    materials: ['Couché brillante', 'Couché mate', 'Kraft'],
    images: ['https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80'],
    featured: true,
    fscEligible: true,
  },
  {
    name: 'Cuadernos Corporativos',
    slug: 'cuadernos-corporativos',
    category: 'papeleria-corporativa',
    shortDesc: 'Cuadernos personalizados con tapa dura o blanda y logo impreso.',
    description:
      'Cuadernos con tapa personalizada en couché o cartón, interior en papel bond o kraft. Encuadernación en espiral, cosido o pegado. Opción de hojas personalizadas con membrete.',
    specs: [
      'Formatos: A5 / A4',
      'Tapa: couché 350 g o cartón',
      'Interior: 80–100 g bond',
      'Encuadernado: espiral, cosido o pegado',
      'Cantidad mínima: 30 unidades',
    ],
    materials: ['Tapa couché', 'Tapa kraft', 'Interior bond blanco', 'Interior bond crema'],
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'],
    fscEligible: true,
  },
  {
    name: 'Volantes y Dípticos',
    slug: 'volantes-dipticos',
    category: 'papeleria-corporativa',
    shortDesc: 'Volantes, dípticos y trípticos para campañas y eventos.',
    description:
      'Impresión de volantes, dípticos y trípticos en alta resolución para campañas comerciales, lanzamientos y eventos corporativos. Entrega rápida y tirajes desde 500 unidades.',
    specs: [
      'Formato: A5, A4, A3, personalizado',
      'Gramaje: 115–300 g/m²',
      'Acabados: mate, brillo, UV parcial',
      'Cantidad mínima: 500 unidades',
    ],
    materials: ['Couché 115 g', 'Couché 150 g', 'Couché 300 g'],
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80'],
    fscEligible: true,
  },
  {
    name: 'Planificadores y Libretas',
    slug: 'planificadores-libretas',
    category: 'papeleria-corporativa',
    shortDesc: 'Planificadores anuales y libretas personalizadas para equipos.',
    description:
      'Planificadores anuales, semanales o diarios con diseño corporativo personalizado. Ideales como regalo institucional o kit de onboarding para nuevos colaboradores.',
    specs: [
      'Formato: A5 o A4',
      'Tapa: couché laminado o tela sintética',
      'Interior personalizable por sección',
      'Cantidad mínima: 20 unidades',
    ],
    materials: ['Couché laminado', 'Tela sintética', 'Interior 90 g bond'],
    images: ['https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80'],
    fscEligible: true,
  },

  // --- GRANDES FORMATOS ---
  {
    name: 'Gigantografías PVC',
    slug: 'gigantografias-pvc',
    category: 'grandes-formatos',
    shortDesc: 'Impresión en gran formato sobre vinilo PVC para interiores y exteriores.',
    description:
      'Gigantografías impresas en alta resolución sobre vinilo PVC de alta densidad. Resistentes a la intemperie, con posibilidad de ojales para instalación. Aptas para fachadas, eventos y ferias.',
    specs: [
      'Resolución: hasta 1440 dpi',
      'Material: PVC 440 g/m² o 510 g/m²',
      'Ancho máximo: 5 metros',
      'Con o sin ojales',
      'Laminado UV disponible',
    ],
    materials: ['PVC 440 g/m²', 'PVC 510 g/m²', 'PVC microperforado'],
    images: ['https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&q=80'],
    featured: true,
  },
  {
    name: 'Señalética Corporativa',
    slug: 'senaletia-corporativa',
    category: 'grandes-formatos',
    shortDesc: 'Sistema de señalética para oficinas, plantas industriales y edificios.',
    description:
      'Diseño e impresión de señalética corporativa completa: señales de evacuación, identificación de áreas, directorio y señalización vial interna. Material rígido o adhesivo según requerimiento.',
    specs: [
      'Sustratos: PVC espumado, aluminio compuesto, acrílico',
      'Espesores: 3mm / 5mm',
      'Impresión UV directa o vinilo recortado',
      'Instalación disponible en Santiago',
    ],
    materials: ['PVC espumado', 'Aluminio compuesto', 'Acrílico', 'Acero inoxidable'],
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'],
  },
  {
    name: 'Brandeo Vehicular',
    slug: 'brandeo-vehicular',
    category: 'grandes-formatos',
    shortDesc: 'Rotulación y brandeo completo de flotas vehiculares.',
    description:
      'Rotulación de vehículos comerciales con vinilo de alta calidad. Desde calcomanías simples hasta envoltura total. Vinilos cast para mayor durabilidad y resistencia UV.',
    specs: [
      'Vinilo: cast 80 µm o calendrado 70 µm',
      'Durabilidad: 5–7 años exterior',
      'Instalación incluida bajo coordinación',
      'Diseño disponible',
    ],
    materials: ['Vinilo cast', 'Vinilo calendrado', 'Laminado protector'],
    images: ['https://images.unsplash.com/photo-1558981852-426c349659c1?w=800&q=80'],
    featured: true,
  },
  {
    name: 'Lienzo y Tela Impresa',
    slug: 'lienzo-tela-impresa',
    category: 'grandes-formatos',
    shortDesc: 'Impresión sobre tela y lienzo para ferias, eventos y decoración.',
    description:
      'Impresión sobre tela de alta resolución para fondos de escenario, stands feriales y decoración interior. Material liviano, enrollable y resistente a la luz.',
    specs: [
      'Material: tela de poliéster 110 g/m²',
      'Impresión sublimación o látex',
      'Ancho máximo: 3.2 metros',
      'Con o sin estructura tensora',
    ],
    materials: ['Tela poliéster', 'Tela backlit', 'Tela blackout'],
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'],
  },

  // --- PROMOCIONALES ---
  {
    name: 'Lápices Personalizados',
    slug: 'lapices-personalizados',
    category: 'promocionales',
    shortDesc: 'Lápices y bolígrafos con logo corporativo para eventos y kits.',
    description:
      'Bolígrafos y lápices con grabado o impresión del logo corporativo. Disponibles en plástico, metálico y madera. Ideales para eventos, kits de bienvenida y congresos.',
    specs: [
      'Técnicas: impresión digital, serigrafía, grabado láser',
      'Materiales: plástico, metal, madera',
      'Cantidad mínima: 100 unidades',
      'Colores personalizables',
    ],
    materials: ['Plástico ABS', 'Aluminio anodizado', 'Bambú', 'Madera'],
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'],
    fscEligible: true,
  },
  {
    name: 'Credenciales y Lanyards',
    slug: 'credenciales-lanyards',
    category: 'promocionales',
    shortDesc: 'Credenciales impresas y lanyards personalizados para eventos.',
    description:
      'Credenciales en PVC rígido, papel laminado o poliéster sublimado. Lanyards en poliéster con impresión full-color y broche de seguridad. Solución completa para congresos, ferias y eventos.',
    specs: [
      'Credencial: PVC 0.76mm o papel 300g laminado',
      'Lanyard: poliéster 15mm o 20mm',
      'Impresión: sublimación full-color',
      'Cantidad mínima: 50 unidades',
    ],
    materials: ['PVC', 'Papel laminado', 'Poliéster'],
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'],
    featured: true,
  },
  {
    name: 'Tazones y Vasos Personalizados',
    slug: 'tazones-vasos-personalizados',
    category: 'promocionales',
    shortDesc: 'Tazones cerámicos y vasos con logo para regalo corporativo.',
    description:
      'Tazones y vasos personalizados con impresión sublimada de alta resolución. Resistentes al lavavajillas. Opción de caja de empaque personalizada.',
    specs: [
      'Tazón cerámico 325ml o 440ml',
      'Vaso térmico de acero inoxidable',
      'Sublimación full-color 360°',
      'Cantidad mínima: 24 unidades',
    ],
    materials: ['Cerámica blanca', 'Acero inoxidable', 'Plástico BPA free'],
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
  },
  {
    name: 'Pendrives Personalizados',
    slug: 'pendrives-personalizados',
    category: 'promocionales',
    shortDesc: 'Pendrives USB con carcasa personalizada y logo corporativo.',
    description:
      'Pendrives USB en múltiples capacidades con carcasa en madera, metal o plástico. Grabado láser o impresión serigráfica del logo. Opciones de diseño a medida.',
    specs: [
      'Capacidades: 8GB, 16GB, 32GB, 64GB',
      'USB-A 2.0 o 3.0',
      'Carcasa: metal, madera o plástico',
      'Cantidad mínima: 50 unidades',
    ],
    materials: ['Aluminio anodizado', 'Madera', 'Plástico ABS'],
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80'],
    fscEligible: true,
  },

  // --- PACKAGING Y ETIQUETAS ---
  {
    name: 'Cajas de Lujo',
    slug: 'cajas-de-lujo',
    category: 'packaging-etiquetas',
    shortDesc: 'Cajas premium con terminaciones especiales para productos de valor.',
    description:
      'Cajas rígidas tipo "clamshell" o libro para productos premium. Tapa y base en cartón rígido forrado en papel couché laminado. Terminaciones en hot stamping, UV selectivo y relieve.',
    specs: [
      'Cartón rígido 2mm o 3mm base',
      'Forrado en couché 128g laminado',
      'Terminaciones: hot stamping, UV selectivo, relieve',
      'Diseño estructural incluido',
      'Cantidad mínima: 100 unidades',
    ],
    materials: ['Cartón rígido', 'Couché laminado', 'Papel especial de fantasía'],
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80'],
    featured: true,
  },
  {
    name: 'Cajas Corrugadas Personalizadas',
    slug: 'cajas-corrugadas-personalizadas',
    category: 'packaging-etiquetas',
    shortDesc: 'Cajas de cartón corrugado con impresión de alta calidad.',
    description:
      'Cajas de cartón corrugado en simple, doble o triple canal con impresión offset o flexografía. Resistentes para envíos y almacenaje. Disponibles con o sin certificación FSC.',
    specs: [
      'Canal: simple C, doble BC o triple ABB',
      'Impresión: offset o flexografía hasta 4 colores',
      'Pruebas de compresión disponibles',
      'Cantidad mínima: 500 unidades',
    ],
    materials: ['Corrugado simple canal C', 'Corrugado doble canal BC', 'Corrugado triple canal'],
    images: ['https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80'],
    fscEligible: true,
  },
  {
    name: 'Etiquetas Industriales',
    slug: 'etiquetas-industriales',
    category: 'packaging-etiquetas',
    shortDesc: 'Etiquetas adhesivas para productos industriales, químicos y alimentarios.',
    description:
      'Etiquetas en rollo o pliego para aplicaciones industriales, alimentarias y químicas. Alta resistencia a la humedad, temperatura y solventes. Materiales certificados para contacto alimentario.',
    specs: [
      'Materiales: papel adhesivo, poliéster, polipropileno',
      'Impresión: digital o flexografía',
      'Adhesivos: permanente, removible, ultra-fuerza',
      'Resistencia: agua, aceite, temperatura',
      'Cantidad mínima: 1.000 unidades',
    ],
    materials: ['Papel adhesivo', 'Poliéster transparente', 'BOPP', 'Polipropileno blanco'],
    images: ['https://images.unsplash.com/photo-1580169980114-ccd0babfa840?w=800&q=80'],
    featured: true,
    fscEligible: true,
  },
  {
    name: 'Cajas Microcorrugado',
    slug: 'cajas-microcorrugado',
    category: 'packaging-etiquetas',
    shortDesc: 'Packaging en microcorrugado para producto terminado y retail.',
    description:
      'Cajas en cartón microcorrugado (canal E o F) con alta calidad de impresión offset. Superficie lisa que permite resoluciones de hasta 150 líneas/pulgada. Ideal para packaging retail y e-commerce.',
    specs: [
      'Canal: E (1.2mm) o F (0.8mm)',
      'Impresión offset hasta 6 colores',
      'Resolución 150 lpi',
      'Troquelado y hendido de precisión',
      'Cantidad mínima: 200 unidades',
    ],
    materials: ['Microcorrugado canal E', 'Microcorrugado canal F'],
    images: ['https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'],
    fscEligible: true,
  },
];
