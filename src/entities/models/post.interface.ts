export interface IPost {
  id: string;
  titulo: string;
  resumo?: string;
  conteudo: string;
  professor_id: string;
  created_at: Date;
  updated_at: Date;
}
