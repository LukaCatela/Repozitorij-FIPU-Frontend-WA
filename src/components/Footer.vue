<template>
  <footer class="bg-[#8ECAE6] text-white mt-auto">
    <div class="max-w-6xl mx-auto px-6 py-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <RouterLink to="/" class="inline-flex items-center gap-2 mb-3">
            <span class="font-bold text-lg">FIPU<span class="text-[#FFB703]">Hub</span></span>
          </RouterLink>
          <p class="text-white text-sm leading-relaxed">
            Centralno mjesto za studentske projekte, radove i prilike. Od studenata za studente.
          </p>
        </div>

        <div class="md:text-right">
          <h4 class="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Kontakt</h4>
          <p class="text-white text-sm">Fakultet informatike u Puli</p>
          <p class="text-white text-sm">Pula, Hrvatska</p>
          <a
            href="mailto:info@fipu.hr"
            class="text-[#8ECAE6] hover:text-[#FFB703] text-sm transition-colors mt-2 block"
          >
            info@fipu.hr
          </a>
        </div>
      </div>

      <div
        class="border-t border-[#FFB703] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
      >
        <p class="text-[#FFB703] text-sm">© {{ new Date().getFullYear() }} FIPU Hub</p>
        <p class="text-[#FFB703] text-sm">Napravljeno od studenata za studente</p>
      </div>
    </div>
  </footer>
</template>
