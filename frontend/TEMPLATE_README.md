# Template de Dashboard SaaS - Orbit Alliance

Este projeto implementa um dashboard SaaS completo usando Next.js, shadcn/ui e Lucide Icons.

## Componentes Principais

### AsideDashboard
Componente de sidebar lateral com:
- Logo da empresa
- Navegação entre as 4 seções (Professores, Produtos, Ações, Usuários)
- Botão para colapsar/expandir
- Indicação visual da página ativa
- Área de perfil no rodapé

### DataTemplate
Template genérico reutilizável para listas com CRUD completo:
- **Props principais:**
  - `title`: Título da página
  - `description`: Descrição da seção
  - `data`: Array de dados para exibir
  - `columns`: Configuração das colunas da tabela
  - `FormComponent`: Componente de formulário para adicionar/editar
  - `onAdd`, `onEdit`, `onDelete`: Callbacks para operações CRUD

- **Funcionalidades:**
  - Busca em tempo real
  - Tabela responsiva
  - Dialog modal para formulários
  - Botões de ação (editar/deletar)
  - Contador de itens

### Exemplo de uso do DataTemplate:

```jsx
<DataTemplate
  title="Professores"
  description="Gerencie todos os professores da plataforma"
  data={professores}
  columns={[
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <Badge>{value}</Badge> // Renderização customizada
    }
  ]}
  searchPlaceholder="Buscar professores..."
  FormComponent={ProfessorForm}
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Estrutura de Formulários

Cada formulário segue o padrão:
- Recebe `initialData` para edição
- Implementa `onSubmit` e `onCancel`
- Usa componentes shadcn/ui (Input, Label, Button)
- Validação básica com HTML5

### Exemplo de FormComponent:

```jsx
const ProfessorForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    email: initialData?.email || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogFooter>
    </form>
  )
}
```

## Seções Implementadas

1. **Dashboard Principal** (`/`)
   - Cards com estatísticas
   - Layout de overview

2. **Professores** (`/professores`)
   - Lista com nome, email, especialidade, telefone
   - Formulário para adicionar/editar professores

3. **Produtos** (`/produtos`)
   - Lista com nome, descrição, preço, categoria
   - Formatação de preço customizada

4. **Usuários** (`/usuarios`)
   - Lista com nome, email, função, telefone
   - Badge colorido para diferentes funções

5. **Ações** (`/acoes`)
   - Lista com título, descrição, status, responsável
   - Badge de status com cores diferentes

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **shadcn/ui** - Biblioteca de componentes
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Radix UI** - Componentes primitivos

## Como Adicionar Nova Seção

1. Crie o formulário em `/components/forms/`
2. Adicione a rota no sidebar (`aside.jsx`)
3. Crie a página em `/app/nova-secao/page.js`
4. Use o `DataTemplate` com os dados e configurações específicas

## Funcionalidades do Template

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Busca em tempo real
- ✅ Interface responsiva
- ✅ Modais para formulários
- ✅ Validação de formulários
- ✅ Navegação ativa
- ✅ Design moderno com shadcn/ui
- ✅ Totalmente reutilizável
- ✅ TypeScript ready (apenas mudar extensões para .tsx)

O template é completamente agnóstico e pode ser usado para qualquer tipo de dados, bastando configurar as props adequadamente.
