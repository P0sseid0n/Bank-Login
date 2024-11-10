import { JSONFilePreset } from "lowdb/node"

type User = {
  name: string
  email: string
  password: string
}

type Data = {
  users: User[]
}

export default defineEventHandler(async (event) => {
  const defaultData: Data = { users: [] }
  const db = await JSONFilePreset<Data>("db.json", defaultData)

  const { name, email, password } = await readBody<User>(event)

  if (!name || !email || !password) {
    throw createError({
      status: 400,
      message: "Nome, email e senha são obrigatórios",
    })
  }

  const userExists = db.data.users.some((user) => user.email === email)

  if (userExists) {
    throw createError({
      status: 400,
      message: "Usuário já existe",
    })
  }

  db.data.users.push({
    name,
    email,
    password,
  })

  await db.write()

  setResponseStatus(event, 201)
  return {
    message: "Usuário criado com sucesso",
  }
})
