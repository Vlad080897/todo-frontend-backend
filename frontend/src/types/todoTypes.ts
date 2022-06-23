export interface TaskType {
  completed: boolean
  createdAt: string
  description: string
  isEdit: boolean
  updatedAt: string
  __v: number
  _id: string
}

export type DeleteTaskAction = {
  type: string
  id: string
}

export type AddNewTaskAction = {
  type: string
  newTask: TaskType
}

export type completeTaskAction = {
  type: string
  completed: boolean
  id: string
  path: string
}

export type ToggleEditMode = {
  type: string
  id: string
  description: string
  isEdit: boolean
}

