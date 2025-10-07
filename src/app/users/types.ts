export type User = {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type NewUserData = {
  name: string
  email: string
}

export type UpdateUserData = Partial<NewUserData>
