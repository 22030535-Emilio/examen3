import { NextResponse } from 'next/server';

const announcements = [
  {
    id: 1,
    title: 'Convocatoria de Becas 2026',
    content: 'Se informa a la comunidad estudiantil que ya está abierta la recepción de documentos para becas de manutención.',
    date: '2026-04-20',
    category: 'Becas'
  },
  {
    id: 2,
    title: 'Mantenimiento del SII',
    content: 'El sistema estará fuera de servicio el próximo domingo de 2:00 AM a 6:00 AM por actualización de servidores.',
    date: '2026-04-25',
    category: 'Sistemas'
  },
  {
    id: 3,
    title: 'Examen de Inglés para Egreso',
    content: 'Última fecha de registro para el examen TOEFL institucional: 15 de mayo.',
    date: '2026-04-27',
    category: 'Idiomas'
  }
];

export async function GET() {
  return NextResponse.json(announcements);
}
