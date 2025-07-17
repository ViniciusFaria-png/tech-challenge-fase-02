export interface IPost {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  teacher_id?: number | undefined;
}
