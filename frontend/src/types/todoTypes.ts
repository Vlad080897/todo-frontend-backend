import { actions } from "../actions/actions"

export interface TaskType {
  _id: string,
  description: string,
  completed: boolean,
  isEdit: boolean
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

//infer type of each action
type InferValueType<T> = T extends { [key: string]: infer U } ? U : never;
export type ActionsType = ReturnType<InferValueType<typeof actions>>;