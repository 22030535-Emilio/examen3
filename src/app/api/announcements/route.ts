import { NextResponse } from 'next/server';

// In-memory "database" for the demo
let announcements = [
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAnnouncement = {
      ...body,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    announcements = [newAnnouncement, ...announcements];
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  announcements = announcements.filter(a => a.id !== parseInt(id));
  return NextResponse.json({ success: true });
}
