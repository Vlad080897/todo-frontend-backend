export interface TaskType {
  completed: boolean
  createdAt?: string
  description: string
  isEdit: boolean
  updatedAt?: string
  __v?: number
  _id?: string,

}

export type UserType = {
  email: string
  id: string
}

export type DeleteTaskAction = {
  type: string
  id: string
}

export type AddNewTaskAction = {
  type: string
  newTask: TaskType
}

export type ErrType = {
  error: string
}

export type completeTaskAction = {
  type: string
  completed: boolean
  id: string
  //path: string
}

export type ToggleEditMode = {
  type: string
  id: string
  description: string
  isEdit: boolean
}

export type signUpAndLoginAction = {
  type: string
  email: string
  password: string
}

export type ResponseUserType = {
  email: string
  password: string
  __v: 0
  _id: string
}

export type getUserAction = {
  type: string
}
