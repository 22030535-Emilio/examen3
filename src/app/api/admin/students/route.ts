import { NextResponse } from 'next/server';

let students = [
  { id: '22030535', name: 'Emilio García', email: '22030535@celaya.tecnm.mx', career: 'Ing. Sistemas', gpa: 92, status: 'Regular' },
  { id: '22030101', name: 'Ana Martínez', email: '22030101@celaya.tecnm.mx', career: 'Ing. Sistemas', gpa: 88, status: 'Regular' },
  { id: '22030202', name: 'Roberto Sánchez', email: '22030202@celaya.tecnm.mx', career: 'Ing. Industrial', gpa: 75, status: 'Condicional' },
  { id: '22030303', name: 'Sofía López', email: '22030303@celaya.tecnm.mx', career: 'Ing. Sistemas', gpa: 95, status: 'Excelencia' },
];

export async function GET() {
  return NextResponse.json(students);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, subject, grade } = body;
    
    // Simulate updating a grade
    students = students.map(s => 
      s.id === studentId ? { ...s, lastGrade: grade, lastSubject: subject } : s
    );
    
    return NextResponse.json({ success: true, message: 'Calificación actualizada en el sistema interno' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}
