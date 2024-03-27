import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { useForm } from 'react-hook-form'
import { Textarea } from './components/ui/textarea'
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './components/ui/form'

export default function App() {
  const formSchema = z.object({
    name: z.string().min(0.01, { message: 'Nome obrigatório' }),
    description: z.string().optional(),
    valor: z
      .string()
      .min(1, { message: 'Valor obrigatório' })
      .transform((value) => parseFloat(value))
      .refine((value) => !Number.isNaN(value), {
        message: 'O valor deve ser um número válido',
        path: ['valor'],
      }),
    available: z.enum(['Sim', 'Não']),
  })

  type formSchema = z.infer<typeof formSchema>

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
  })
  const [products, setProducts] = useState<formSchema[]>([])

  const handleSubmit = (data: formSchema) => {
    try {
      setProducts([...products, data])
      form.reset()
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return (
    <div className="w-screen h-screen flex lg:flex-row lg:divide-x flex-col-reverse justify-center items-center bg-neutral-950 text-neutral-50 dark">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-3 lg:w-1/4 w-full h-full p-4 min-w-[300px] lg:border-t-0 border-t"
        >
          <h1 className="font-bold text-xl mb-4">Adicionar Produto</h1>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            type="text"
            id="name"
            placeholder="Nome do Produto"
            {...form.register('name')}
          />
          <Label htmlFor="description">Descrição do produto</Label>
          <Textarea
            className="h-[100px] resize-none"
            id="description"
            placeholder="Descrição do produto"
            {...form.register('description')}
          />
          <Label htmlFor="valor">Valor do produto</Label>
          <Input
            id="valor"
            placeholder="Valor do produto"
            {...form.register('valor')}
          />

          <FormField
            control={form.control}
            name="available"
            defaultValue="Sim"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Disponivel para venda?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="w-full flex justify-center items-center gap-10"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="available-yes" value="Sim" />
                      <label htmlFor="available-yes">Sim</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="available-no" value="Não" />
                      <label htmlFor="available-no">Não</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Enviar Produto</Button>
        </form>
      </Form>
      <div className="flex flex-col lg:w-3/4 w-full h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nomes</TableHead>
              <TableHead>Disponivel</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Valores</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products
              .sort((a, b) => a.valor - b.valor)
              .map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[100px]">{product.name}</TableCell>
                  <TableCell>{product.available}</TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    {product.description}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {product.valor.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
