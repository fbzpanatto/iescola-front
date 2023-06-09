export interface Discipline { id: number, name: string, selected?: boolean }
export interface Classroom { id: number, name: string, selected?: boolean }
export interface TestCategory { id: number, name: string }
export interface Bimester { id: number, name: string }
export interface Year { id: number, name: number }
export interface Questions { id: number, answer: string }
export interface Teacher { id: number, person: { id: number, name: string } }
export interface Test { id: number, name: string, questions: Questions, year: Year, bimester: Bimester, teacher: Teacher, discipline: Discipline }
export interface TestClass { name: string, school: string, classroomId: number, classroom: string, year: number, bimester: string, category: string, teacher: string, discipline: string }
export interface TestClasses { testId: number, classes: TestClass[] }
export interface ObjectLiteral { [key: string]: any }
export interface ObjectLiteralArray extends Array<ObjectLiteral> {}
export interface PopupOptions {title?: string, url?: string, questions?: ObjectLiteralArray, headers?: ObjectLiteralArray, fetchedData?: ObjectLiteralArray, multipleSelection?: boolean, alreadySelected?: any }
