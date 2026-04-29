export interface Student {
  nombre: string;
  matricula: string;
  carrera: string;
  promedio: string;
  periodo_ingreso: string;
  correo: string;
  foto?: string;
}

export interface Grade {
  materia: string;
  periodo: string;
  calificacion: number;
}

export interface KardexItem {
  ciclo: string;
  materia: string;
  calificacion: number;
  creditos: number;
}

export interface ScheduleItem {
  materia: string;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  aula: string;
  profesor: string;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    name?: string;
  };
}
