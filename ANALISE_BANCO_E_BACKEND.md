# BIOBOT — Especificação Técnica de Alterações no Banco de Dados e Back-end

Este documento detalha todas as alterações necessárias no banco de dados (MySQL / MariaDB) e no back-end (`robotica-backend`) do projeto **BIOBOT (Portal de Robótica de Caraguatatuba)**, apontando o diagnóstico, a justificativa e os comandos de migração recomendados.

---

## 1. Contexto e Diagnóstico

Durante os testes de integração das telas administrativas e docentes, foram identificados dois problemas estruturais no banco de dados e nas rotas da API:

1. **Mistura de Equipes com Projetos:**
   - A tabela `RoboticsGroup` foi criada originalmente apenas com `id` e `name`.
   - Por ausência de colunas para alunos e escola, a tela de Equipes (`/grupos`) utilizava a tabela `Project` de forma improvisada, causando a colisão onde a descrição técnica do projeto aparecia como lista de integrantes da equipe e vice-versa.
2. **Descrições truncadas / Erro 500 ao publicar Projetos e Tutoriais:**
   - As colunas `description` das tabelas `Project` e `Tutorial` foram criadas como `VARCHAR(191)` nas migrações iniciais.
   - Ao publicar textos com mais de 191 caracteres, o Prisma lança o erro `P2000` (valor longo demais para o tipo da coluna), retornando `HTTP 500` para o front-end.

---

## 2. Alterações Necessárias no Banco de Dados

### 2.1. Tabela `RoboticsGroup` (Equipes de Robótica)

#### Situação Atual

| Coluna      | Tipo                       | Descrição               |
| ----------- | -------------------------- | ----------------------- |
| `id`        | `INT` (PK, Auto-increment) | Identificador da equipe |
| `name`      | `VARCHAR(191)` (Unique)    | Nome da equipe          |
| `createdAt` | `DATETIME`                 | Data de criação         |
| `updatedAt` | `DATETIME`                 | Data de atualização     |

#### Colunas a Adicionar

1. **`students` (`TEXT`, nulo):**
   - **Motivo:** Armazenar os nomes de todos os alunos integrantes da equipe (ex: `"Ana Laura, João Lattaro, Sthefany Santiago"`). A ordenação alfabética (A-Z) é garantida na interface.
2. **`grade` (`VARCHAR(191)`, nulo):**
   - **Motivo:** Armazenar o ano/série escolar atendido pela equipe (ex: `"6º Ano"`, `"7º Ano"`, `"8º Ano"`, `"9º Ano"`).
3. **`schoolId` (`INT`, nulo) + Chave Estrangeira com `School(id)`:**
   - **Motivo:** Vincular a equipe à sua respectiva unidade escolar municipal, viabilizando o filtro de equipes por escola nos painéis docente e administrativo.

---

### 2.2. Tabelas `Project` e `Tutorial` (Descrições)

#### Situação Atual

- `Project.description`: `VARCHAR(191)`
- `Tutorial.description`: `VARCHAR(191)`

#### Alteração Necessária

- Alterar ambas as colunas para o tipo `TEXT`.
- **Motivo:** Permitir textos completos, com introdução, materiais, etapas de montagem e instruções pedagógicas sem limite de 191 caracteres.

---

## 3. Script SQL de Execução Direta (MySQL / MariaDB)

```sql
-- ====================================================================
-- 1. ESTRUTURA PARA EQUIPES DE ROBÓTICA (RoboticsGroup)
-- ====================================================================
ALTER TABLE `RoboticsGroup`
  ADD COLUMN `students` TEXT NULL,
  ADD COLUMN `grade` VARCHAR(191) NULL,
  ADD COLUMN `schoolId` INT NULL;

ALTER TABLE `RoboticsGroup`
  ADD CONSTRAINT `RoboticsGroup_schoolId_fkey`
  FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ====================================================================
-- 2. SUPORTE A TEXTO LONGO EM PROJETOS E TUTORIAIS
-- ====================================================================
ALTER TABLE `Project` MODIFY `description` TEXT NULL;
ALTER TABLE `Tutorial` MODIFY `description` TEXT NOT NULL;
```

---

## 4. Atualização no Schema do Prisma (`prisma/schema.prisma`)

Após aplicar o script SQL (ou para gerar uma nova migração via Prisma), o arquivo `robotica-backend/prisma/schema.prisma` deve conter as seguintes definições:

```prisma
model School {
  id             Int             @id @default(autoincrement())
  name           String
  address        String?
  description    String?         @db.Text
  users          User[]          @relation("UserPrimarySchool")
  linkedUsers    User[]          @relation("UserSchools")
  projects       Project[]
  tutorials      Tutorial[]
  events         Event[]
  roboticsGroups RoboticsGroup[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RoboticsGroup {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  students  String?  @db.Text
  grade     String?
  schoolId  Int?
  school    School?  @relation(fields: [schoolId], references: [id], onDelete: SetNull)
  users     User[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?  @db.Text
  schoolId    Int
  school      School   @relation(fields: [schoolId], references: [id])
  imageUrl    String?  @db.VarChar(2048)
  images      Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Tutorial {
  id              Int        @id @default(autoincrement())
  title           String
  description     String     @db.Text
  categoryId      Int
  category        Category   @relation(fields: [categoryId], references: [id])
  difficulty      Difficulty
  schoolId        Int
  school          School     @relation(fields: [schoolId], references: [id])
  materialsNeeded Json
  tutorialUrl     String?
  imageUrl        String?    @db.VarChar(2048)
  images          Json?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

---

## 5. Alterações Necessárias no Back-end (`robotica-backend`)

Para que o back-end exponha o recurso de Equipes de forma oficial e desacoplada de Projetos:

1. **Definição de Recursos (`src/modules/resources.js`):**
   - Adicionar o recurso `groups` em `resourceDefinitions` mapeando a entidade `roboticsGroup` do Prisma com os campos `{ id, name, students, grade, schoolId, school, createdAt, updatedAt }`.
2. **Schemas de Validação (`src/modules/groups/schemas.js`):**
   - Criar `createGroupSchema` e `updateGroupSchema` validando `name` (obrigatório), `students` (opcional), `grade` (opcional) e `schoolId` (opcional/numérico).
3. **Registro de Rotas CRUD (`src/app.js`):**
   - Registrar as rotas de equipes:
     ```javascript
     registerCrudRoutes(app, '/groups', container.controllers.groups, session, [
       container.policy.role('ADMIN', 'TEACHER')
     ])
     ```
4. **Permissões por Escola (`AccessPolicy` / Escopo Docente):**
   - Professores vinculados a uma escola só podem gerenciar as equipes de sua unidade escolar; Administradores têm acesso global.
