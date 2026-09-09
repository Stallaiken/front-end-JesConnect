## Table `modalidade`

Modalidades

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `nome` | `varchar` |  |
| `genero` | `genero` |  Nullable |
| `created_at` | `timestamptz` |  |

## Table `time`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  |
| `Nome` | `varchar` |  Unique |
| `id_modalidade` | `uuid` |  |
| `logo_URL` | `text` |  Nullable |
| `pontuacao` | `int4` |  |

## Table `confronto`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  |
| `time1` | `uuid` |  |
| `time2` | `uuid` |  |
| `finalizado` | `bool` |  |
| `horario` | `timestamptz` |  Nullable |
| `ao_vivo` | `bool` |  |

## Table `detalhes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `confronto_id` | `uuid` |  |
| `ptn_time1` | `int4` |  |
| `ptn_time2` | `int4` |  |
| `local` | `varchar` |  |
| `vencedor` | `uuid` |  Nullable |

## Table `admins`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `usuario` | `text` |  Unique |
| `senha` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Custom Types / Enums

### `genero`

`M` | `F` | `Not`

## RLS Policies

### `modalidade`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Visitantes podem ver modalidades` | SELECT | public | PERMISSIVE | `true` | — |
| `Qualquer um pode ver modalidades` | SELECT | public | PERMISSIVE | `true` | — |
| `Permitir inserir modalidade` | INSERT | anon, authenticated | PERMISSIVE | — | `true` |
| `Permitir atualizar modalidade` | UPDATE | anon, authenticated | PERMISSIVE | `true` | `true` |
| `Permitir deletar modalidade` | DELETE | anon, authenticated | PERMISSIVE | `true` | — |

### `time`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Visitantes podem ver times` | SELECT | public | PERMISSIVE | `true` | — |
| `Qualquer um pode ver times` | SELECT | public | PERMISSIVE | `true` | — |
| `Permitir inserir time` | INSERT | anon, authenticated | PERMISSIVE | — | `true` |
| `Permitir atualizar time` | UPDATE | anon, authenticated | PERMISSIVE | `true` | `true` |
| `Permitir deletar time` | DELETE | anon, authenticated | PERMISSIVE | `true` | — |

### `confronto`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Permitir deletar confronto` | DELETE | anon, authenticated | PERMISSIVE | `true` | — |
| `Visitantes podem ver confrontos` | SELECT | public | PERMISSIVE | `true` | — |
| `Qualquer um pode ver confrontos` | SELECT | public | PERMISSIVE | `true` | — |
| `Permitir inserir confronto` | INSERT | anon, authenticated | PERMISSIVE | — | `true` |
| `Permitir atualizar confronto` | UPDATE | anon, authenticated | PERMISSIVE | `true` | `true` |

### `detalhes`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Visitantes podem ver detalhes` | SELECT | public | PERMISSIVE | `true` | — |
| `Permitir atualizar detalhes` | UPDATE | anon, authenticated | PERMISSIVE | `true` | `true` |
| `Permitir deletar detalhes` | DELETE | anon, authenticated | PERMISSIVE | `true` | — |
| `Qualquer um pode ver detalhes` | SELECT | public | PERMISSIVE | `true` | — |
| `Permitir inserir detalhes` | INSERT | anon, authenticated | PERMISSIVE | — | `true` |

### `admins`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Ninguém pode ver admins` | SELECT | public | PERMISSIVE | `false` | — |

