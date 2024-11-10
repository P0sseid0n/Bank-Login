<script setup lang="ts"></script>

<template>
  <div id="home">
    <header>
      <div class="container">
        <div>
          <h1>Banco Nacional</h1>
        </div>
        <div>
          <UButton variant="solid" size="lg" to="/login"> Entrar </UButton>
          <UButton variant="link" size="lg" to="/signup"> Cadastrar </UButton>
        </div>
      </div>
    </header>

    <main>
      <div class="container">
        <h2>Seja bem-vindo ao Banco Nacional</h2>
        <p>
          O Banco Nacional é um banco digital que oferece serviços financeiros
          de forma rápida e segura.
        </p>
        <UButton variant="solid" size="lg" to="/login">
          Acessar minha conta
        </UButton>
      </div>
    </main>
  </div>
</template>

<style scoped>
#home {
  height: 100vh;
}

header {
  width: 100%;
  background-color: rgb(252, 252, 252);
  padding: 1rem;
  height: 72px;
  border-bottom: 1px solid rgb(245, 245, 245);
}

header .container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--color-primary-500));
}

header .container a {
  margin-left: 16px;
  padding-left: 32px;
  padding-right: 32px;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding-top: 10rem;
}

main .container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

main h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

main p {
  font-size: 1rem;
  color: rgb(70, 70, 70);
  text-align: center;
}

main a {
  margin-top: 3rem;
}
</style>
