<template>
  <div class="grid grid-cols-2 w-full h-full">
    <div class="slidev-layout center intro image-right pr-4">
      <slot />
    </div>
    <div class="my-20 mr-20">
      <slot name="image" />
    </div>
  </div>
</template>
