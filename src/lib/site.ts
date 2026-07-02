/* ============================================================
   CONFIGURACIÓN CENTRAL DEL SITIO SERVIMIL
   Punto único para datos de contacto, contenido y la fórmula
   de la calculadora de crédito. Cambiar aquí se refleja en todo.
   ============================================================ */

/** Contacto */
export const WHATSAPP_NUMBER = "573181626167";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_DISPLAY = "+57 318 162 6167";
export const WEBSITE = "https://www.servimil.co";
export const REGISTER_HREF = "#registro";

/* ---- Navegación ---- */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Conócenos", href: "/conocenos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Testimonios", href: "/testimonios" },
];

/* ---- Servicios actuales (íconos por nombre — ver Icon.astro) ---- */
export const SERVICIOS = [
  { icon: "heart", title: "Bono de condolencia", desc: "Un apoyo que llega cuando más se necesita, sin trámites complicados." },
  { icon: "money", title: "Asistencia financiera", desc: "Respaldo para tus metas y tranquilidad para tus finanzas." },
  { icon: "bank", title: "Asistencia jurídica", desc: "Abogados de tu lado para resolver lo que necesites." },
  { icon: "file", title: "Administración de nómina", desc: "Tu nómina ordenada y bajo control, sin sorpresas." },
  { icon: "shield", title: "Seguros", desc: "Protección a la medida para ti y los tuyos." },
  { icon: "play", title: "Entretenimiento", desc: "Momentos para disfrutar en familia, con beneficios exclusivos." },
];

/* ---- Bienestar y salud ---- */
export const BIENESTAR = [
  { icon: "home", title: "Médico en casa", desc: "Atención profesional sin salir de tu hogar." },
  { icon: "video", title: "Telemedicina", desc: "Habla con un médico en minutos, desde tu celular." },
  { icon: "bus", title: "Transporte a citas", desc: "Llega seguro y a tiempo a tus controles médicos." },
  { icon: "chat", title: "Asistencia psicológica", desc: "Un espacio para tu salud mental y la de tu familia." },
  { icon: "sparkle", title: "Aseo por incapacidad", desc: "Apoyo en casa mientras te recuperas." },
  { icon: "grad", title: "Tutorías académicas", desc: "Apoyo escolar para que tus hijos avancen seguros." },
];

/* ---- Nuevos servicios (badge naranja "NUEVO") ---- */
export const NUEVOS = [
  {
    icon: "paw",
    title: "Plan Mascota",
    desc: "Porque también son familia. Cuidamos a tu compañero de cuatro patas.",
    items: ["Auxilio en medicamentos y tratamientos", "Cobertura para 1 mascota", "Apoyo económico para su cuidado"],
  },
  {
    icon: "laptop",
    title: "Servicio Tecnología",
    desc: "Soporte que te entiende, sin tecnicismos ni esperas eternas.",
    items: [
      "Soporte remoto: celular, PC, tablet, Smart TV",
      "Configuración de equipos y recuperación de cuentas",
      "Acompañamiento en compras tecnológicas",
    ],
  },
  {
    icon: "plane",
    title: "Viajes Internacionales",
    desc: "Tu próximo destino, más fácil y sin estrés.",
    items: [
      "Apoyo para visas B1/B2 y citas de pasaporte",
      "Comparación de tiquetes nacionales e internacionales",
      "Asesoría en turismo",
    ],
  },
  {
    icon: "legal",
    title: "Asistencia Jurídica Especializada",
    desc: "Defendemos tus derechos con abogados que conocen el sector.",
    items: [
      "Derechos de petición, tutelas y demandas",
      "Trámites de la fuerza pública, subsidios y permisos",
      "Contratos, divorcios y asesoría legal integral",
    ],
  },
];

/* ---- Testimonios ---- */
export const TESTIMONIOS = [
  { q: "Cuando perdí a mi padre, Servimil estuvo ahí sin que tuviera que rogar por nada. El bono llegó cuando más lo necesitábamos.", n: "Carlos M.", r: "Soldado Profesional · Batallón Ayacucho" },
  { q: "Llevo 6 años pensionado y por fin siento que alguien piensa en nosotros. La telemedicina me ahorra viajes que antes eran un calvario.", n: "Hernán R.", r: "Pensionado CREMIL" },
  { q: "El médico llegó a casa en menos de lo que esperaba. Atención de primera y un trato humano que no se ve en otros lados.", n: "Diana P.", r: "Esposa de Suboficial · Tolemaida" },
  { q: "Me asesoraron con la tutela y ganamos. Saber que tienes abogados que entienden el sector cambia todo.", n: "Andrés G.", r: "Cabo Primero · Batallón Colombia" },
];

/* ============================================================
   CALCULADORA DE CRÉDITO
   Fórmula placeholder en UN solo lugar. Cuando se definan las
   condiciones reales, editar CREDIT_CONFIG y/o monthlyPayment().
   ============================================================ */
export const CREDIT_CONFIG = {
  min: 1_000_000,
  max: 50_000_000,
  step: 500_000,
  defaultMonto: 8_000_000,
  defaultCuotas: 24,
  plazos: [6, 12, 18, 24, 36, 48],
  monthlyRate: 0.015, // tasa mensual placeholder (1.5%)
};

export const REQUISITOS = [
  "Válido para fuerza pública / Min. Defensa",
  "Carencia de 120 días",
  "Beneficiarios máximo 70 años",
];
