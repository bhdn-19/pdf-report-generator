<script setup>
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { formatCurrency } from '~/composables/useCurrency'
import { FileDown } from 'lucide-vue-next'
import { generatePdf } from '~/composables/usePdf'

const props = defineProps(['data'])

const handleDownload = async (id) => {
  try{
    const index = props.data.findIndex((d) => d.id === id)
    await generatePdf(props.data[index])

    alert('Download berhasil.')
  }catch(error){
    alert('Download gagal.')
    console.error(error);
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>History Generate</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <div class="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Page Size</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-for="(d, i) in data" :key="d.id">
              <TableCell>{{ i+1 }}</TableCell>
              <TableCell>{{ d.title }}</TableCell>
              <TableCell>{{ d.pageSize }}</TableCell>
              <TableCell class="text-right">{{ `Rp. ${formatCurrency(d.nominal)}` }}</TableCell>
              <TableCell>{{ new Date(d.id).toLocaleString('id-ID') }}</TableCell>
              <TableCell>
                <Button size="icon-sm" variant="outline" @click="handleDownload(d.id)">
                  <FileDown />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</template>
