import { JSONFilePreset } from "lowdb/node"

function getPasswordVariations(password: [number, number][]): string[] {
  const variations: string[] = []

  const positions = Array<0 | 1>(password.length).fill(0)
  let variation = ""

  while (positions.includes(0)) {
    for (let index = 0; index < positions.length; index++) {
      variation += password[index][positions[index]]
    }
    variations.push(variation)
    variation = ""

    const lastZeroIndex: number = positions.findLastIndex(
      (value) => value === 0
    )

    positions[lastZeroIndex] = 1

    for (let index = 0; index < positions.length; index++) {
      if (index > lastZeroIndex) positions[index] = 0
    }
  }

  for (let index = 0; index < positions.length; index++) {
    variation += password[index][positions[index]]
  }

  variations.push(variation)

  return variations
}

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

  const { email, password } = await readBody<{
    email: string
    password: [number, number][]
  }>(event)

  if (!email || !password) {
    throw createError({
      status: 400,
      message: "Email e senha são obrigatórios",
    })
  }

  const user = db.data.users.find((user) => user.email === email)

  if (!user) {
    throw createError({
      status: 404,
      message: "Usuário não encontrado",
    })
  }

  const passwordVariations = getPasswordVariations(password)

  const found = passwordVariations.find(
    (variation) => variation === user.password
  )

  if (found) {
    return {
      name: user.name,
      email: user.email,
    }
  } else {
    throw createError({
      status: 401,
      message: "Senha inválida",
    })
  }
})
