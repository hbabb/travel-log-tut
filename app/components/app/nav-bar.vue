<template>
  <header class="navbar bg-primary text-primary-content">
    <nav class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        Travel Log
      </NuxtLink>
    </nav>
    <nav class="navbar-end">
      <AppThemeToggle />
      <AuthButton />
    </nav>
  </header>
</template>
