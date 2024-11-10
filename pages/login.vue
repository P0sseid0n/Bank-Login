<script setup lang="ts">
import type { FormError, FormSubmitEvent, Form } from "#ui/types"

const state = reactive({
  email: "",
  password: [] as Array<[number, number]>,
})
const step = ref(1)
const form = ref<Form<typeof state>>()

const PASS_LENGTH = 6

const toast = useToast()

const validate = (state: any) => {
  const errors: FormError[] = []
  //   if (!state.email) errors.push({ path: "email", message: "Invalido" })

  const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  if (!state.email || !regexEmail.test(state.email)) {
    errors.push({ path: "email", message: "Invalido" })
  }

  if (step.value === 2 && !state.password) {
    errors.push({
      path: "password",
      message: `Deve ter ${PASS_LENGTH} dígitos`,
    })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  // Do something with data
  console.log(event.data)

  $fetch("/api/login", {
    method: "post",
    body: event.data,
  })
    .then((res) => {
      toast.add({
        title: "Sucesso",
        description: "Login efetuado com sucesso",
        color: "green",
        duration: 5000,
        isClosable: true,
      })
    })
    .catch((err) => {
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

const keyboard = ((numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) => {
  const keyboard: Array<Array<Number>> = []
  const restNumbers = [...numbers]
  const size = 2

  while (restNumbers.length > 0) {
    const key = restNumbers.shift()

    if (key === undefined) break

    const position = Math.floor(Math.random() * (numbers.length / size))

    if (keyboard[position] === undefined) keyboard[position] = [key]
    else if (keyboard[position].length < size) keyboard[position].push(key)
    else restNumbers.push(key)
  }

  return keyboard as Array<[number, number]>
})()

async function nextStep() {
  const validated = await form.value?.validate(undefined, {
    silent: true,
  })

  if (validated === false) return

  step.value++
  state.password = []
}

const textPassword = computed(() => state.password.map(() => "•").join(""))
</script>

<template>
  <div id="login" class="bg-white">
    <div class="container">
      <header>
        <h1 class="text-orange-400">Login</h1>
      </header>
      <UForm ref="form" :validate="validate" :state="state" @submit="onSubmit">
        <template v-if="step === 1">
          <UFormGroup class="w-80 mb-4" label="Email" name="email">
            <UInput
              placeholder="email@exemplo.com"
              icon="i-heroicons-envelope"
              size="xl"
              v-model="state.email"
            />
          </UFormGroup>

          <UButton
            class="mt-4"
            size="lg"
            block
            variant="solid"
            @click="nextStep"
          >
            Entrar
          </UButton>
          <UButton class="mt-2" size="lg" block variant="link" to="/signup">
            Não tenho conta
          </UButton>
        </template>
        <template v-else-if="step === 2">
          {{ state.password }}
          <UFormGroup class="w-80 mb-4" label="Senha" name="password">
            <UInput disabled :value="textPassword" type="password" />
          </UFormGroup>

          <div class="keyboard">
            <UButton
              v-for="keys in keyboard"
              size="xl"
              color="white"
              variant="solid"
              @click="
                state.password.length < PASS_LENGTH
                  ? state.password.push(keys)
                  : null
              "
            >
              {{ keys[0] }} ou {{ keys[1] }}
            </UButton>
            <UButton
              icon="i-heroicons-backspace"
              size="md"
              color="white"
              variant="solid"
              @click="state.password.pop()"
            >
            </UButton>
          </div>

          <UButton class="mt-4" block variant="solid" type="submit">
            Entrar
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
#login {
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

div.keyboard {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

div.keyboard > button {
  align-items: center;
  justify-content: center;
}
</style>
