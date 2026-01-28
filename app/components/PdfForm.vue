<script setup>
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import * as z from 'zod'
import { formatCurrency, parseCurrency } from '~/composables/useCurrency'
import { generatePdf } from '~/composables/usePdf'
import Spinner from './ui/spinner/Spinner.vue'

const emit = defineEmits(['refresh'])

const selectItems = ['A4', 'A5', 'Letter']

const formSchema = z.object({
  pageSize: z.string(),
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  nominal: z.coerce.number().nonnegative()
})

const form = reactive({
  pageSize: 'A4',
  title: '',
  description: '',
  nominal: 0
})

const displayValue = computed({
  get() {
    return formatCurrency(form.nominal)
  },
  set(value) {
    form.nominal = parseCurrency(value)
  }
})

const isLoading = ref(false)
const errors = ref({})

const submitForm = async () => {
  isLoading.value = true
  errors.value = {}

  try{
    const result = formSchema.safeParse(form)

    if (!result.success) {
      result.error.issues.forEach(err => {
        errors.value[err.path[0]] = [err.message]
      })
      return
    }

    await generatePdf(form)

    await $fetch("/api/pdf", {
      method: 'POST',
      body: form
    })

    emit("refresh")
  }catch(error){
    console.error(err)
  }finally{
    isLoading.value = false
  }
}

</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Form Section</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <form @submit.prevent="submitForm">
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>
                    Ukuran Halaman
                  </FieldLabel>
                  <Select v-model="form.pageSize">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="size in selectItems" :value="size" :key="size">
                        {{size}}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError :errors="errors.pageSize" />
                </Field>
                <Field class="md:col-span-2">
                  <FieldLabel>
                    Judul Laporan
                  </FieldLabel>
                  <Input v-model="form.title" type="text" placeholder="Masukkan judul laporan..." />
                  <FieldError :errors="errors.title" />
                </Field>
              </div>
              
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>
                      Deskripsi / Isi Laporan
                    </FieldLabel>
                    <Textarea
                      v-model="form.description"
                      placeholder="Masukkan isi laporan..."
                      class="resize-none"
                    />
                    <FieldError :errors="errors.description" />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field>
                <FieldLabel>
                  Nominal
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>Rp.</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput 
                    type="text"
                    v-model="displayValue"
                    inputmode="numeric"
                    @keydown="
                      ($event.ctrlKey || $event.metaKey) ||
                      /[\d]|Backspace|Delete|Arrow|Tab/.test($event.key)
                        ? null
                        : $event.preventDefault()
                    "
                    required
                  />
                </InputGroup>
                <FieldError :errors="errors.nominal" />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button type="submit" :disabled="isLoading">
              <Spinner v-if="isLoading" />
              {{ isLoading ? 'Generating...' : 'Generate PDF' }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
