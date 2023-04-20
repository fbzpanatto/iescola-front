export interface Discipline { id: number, name: string }
export interface Bimester { id: number, name: string }
export interface Year { id: number, name: number }
export interface Questions { id: number, answer: string }[]
export interface Teacher { id: number, person: { id: number, name: string } }
export interface Test { id: number, name: string, questions: Questions, year: Year, bimester: Bimester, teacher: Teacher, discipline: Discipline }
export interface TestClasses {name: any, school: any, classroomId: any, classroom: any, year: any, bimester: any, category: any, teacher: any, discipline: any}
