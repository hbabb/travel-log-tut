<template>
  <header class="navbar bg-primary text-primary-content">
    <nav class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        Travel Log
      </NuxtLink>
    </nav>
    <nav class="navbar-end">
      <AppThemeToggle />
      <a class="btn btn-accent">
        Sign In With GitHub
        <Icon name="tabler:brand-github" size="24" />
      </a>
    </nav>
  </header>
</template>
