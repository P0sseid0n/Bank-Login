<script setup lang="ts">
import type { FormError, FormSubmitEvent, Form } from "#ui/types"

const state = reactive({
  name: "",
  email: "",
  password: "",
})
const step = ref(1)
const form = ref<Form<typeof state>>()

const PASS_LENGTH = 6

const toast = useToast()

const validate = (state: any) => {
  const errors: FormError[] = []
  if (!state.name || state.name.length < 3) {
    errors.push({ path: "name", message: "Invalido" })
  }

  const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  if (!state.email || !regexEmail.test(state.email)) {
    errors.push({ path: "email", message: "Invalido" })
  }

  if (step.value === 2 && !state.password)
    errors.push({
      path: "password",
      message: `Deve ter ${PASS_LENGTH} dígitos`,
    })
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  // Do something with data
  console.log(event.data)

  $fetch("/api/signup", {
    method: "POST",
    body: event.data,
  })
    .then((res) => {
      toast.add({
        title: "Sucesso",
        description: "Conta criada com sucesso",
        color: "green",
        duration: 5000,
        isClosable: true,
      })

      useRouter().push("/login")
    })

    .catch((err) => {
      console.dir(err)
      toast.add({
        title: "Erro",
        icon: "i-heroicons-exclamation-triangle",
        description: err?.data?.message || err,
        color: "red",
        duration: 5000,
        isClosable: true,
      })
    })
}

function typePass(value: string) {
  if (value === "") return (state.password = state.password.slice(0, -1))

  if (state.password.length >= PASS_LENGTH) return
  state.password += value
}

async function nextStep() {
  const validated = await form.value?.validate(undefined, {
    silent: true,
  })

  if (validated === false) return

  step.value++
  state.password = ""
}
</script>

<template>
  <div id="signup" class="bg-white">
    <div class="container">
      <header>
        <h1>Criando conta</h1>
      </header>
      <UForm ref="form" :validate="validate" :state="state" @submit="onSubmit">
        <template v-if="step === 1">
          <UFormGroup class="w-80 mb-4" label="Nome" name="name">
            <UInput
              placeholder="Nome"
              icon="i-heroicons-user"
              v-model="state.name"
            />
          </UFormGroup>
          <UFormGroup class="w-80 mb-6" label="Email" name="email">
            <UInput
              placeholder="email@exemplo.com"
              icon="i-heroicons-envelope"
              v-model="state.email"
            />
          </UFormGroup>
          <UButton class="mt-4" block variant="solid" @click="nextStep">
            Proximo
          </UButton>
          <UButton class="mt-2" block variant="link" to="/login">
            Ja tenho conta
          </UButton>
        </template>
        <template v-else-if="step === 2">
          <UFormGroup class="w-80 mb-4" label="Senha" name="password">
            <UInput
              disabled
              placeholder="Senha"
              icon="i-heroicons-lock-closed"
              type="password"
              :value="state.password"
            />
          </UFormGroup>
          <div class="pass mb-10">
            <UButton
              v-for="i in 10"
              size="xl"
              color="white"
              variant="solid"
              @click="typePass(10 - i + '')"
            >
              {{ 10 - i }}
            </UButton>
            <UButton
              icon="i-heroicons-backspace"
              size="md"
              color="white"
              variant="solid"
              @click="typePass('')"
            >
            </UButton>
          </div>

          <UButton class="mt-4" block variant="solid" type="submit">
            Criar
          </UButton>
          <UButton class="mt-2" block variant="link" @click="step--">
            Voltar
          </UButton>
        </template>
      </UForm>
    </div>
  </div>
</template>

<style scoped>
#signup {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.container header h1 {
  font-size: 2rem;
  font-weight: 700;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

div.pass {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

div.pass > button {
  align-items: center;
  justify-content: center;
}
</style>
