<script setup>
import Header from '@/components/Header.vue'
import PdfForm from '~/components/PdfForm.vue';
import PdfTable from '~/components/PdfTable.vue';

const { data, pending, refresh } = useFetch("/api/pdf")
</script>

<template>
  <Header></Header>

  <main class="mx-auto max-w-5xl space-y-6 p-6">
    <PdfForm @refresh="refresh"></PdfForm>

    <p v-if="pending">Loading ...</p>

    <PdfTable v-else :data="data"></PdfTable>
  </main>
</template>
