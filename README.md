# Frontend | BioBot

> **Interface gráfica, vitrine de projetos e experiência do usuário da plataforma Conexão Robótica.**

Este repositório contém o código-fonte da aplicação cliente (Frontend) do projeto BioBot. A interface foi projetada para ser ágil, responsiva e acessível, servindo como o ponto de encontro digital para alunos e professores da rede municipal.

---

## Tecnologias e Ferramentas

O projeto foi desenvolvido focando em performance e componentização, utilizando as seguintes tecnologias:

- **Next.js(https://nextjs.org/)**: Framework principal para roteamento e renderização otimizada.
- **React(https://reactjs.org/)**: Biblioteca para a construção de interfaces baseadas em componentes.
- **Tailwind CSS(https://tailwindcss.com/)**: Estilização utilitária e responsiva, garantindo um design limpo e moderno.
- **React Icons(https://react-icons.github.io/react-icons/)**: Padronização da iconografia do portal.
- **Figma(https://www.figma.com/)**: Utilizado para a prototipação e design de interfaces.

---

## Manual de Instalação e Execução Local

Para testar a interface em ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

- Node.js (v18.x ou superior)
- Gerenciador de pacotes (`npm`)

### Rodando o Projeto

1. **Clone este repositório:**

```bash
git clone https://github.com/robotica-caragua/robotica-frontend.git
```

2. **Acesse a pasta do projeto:**

```bash
cd robotica-frontend
```

3. **Instale todas as dependências:**

```bash
npm install
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

5. **Acesse no navegador:**
   Abra http://localhost:3000 para visualizar a aplicação rodando.

---

## Integração com a API (Backend)

Esta aplicação é a camada de apresentação e consome os dados fornecidos pela nossa API Rest. Para visualizar o projeto completo rodando com dados dinâmicos, certifique-se de também clonar e rodar o [repositório do Backend](https://github.com/robotica-caragua/robotica-backend) na sua máquina, configurando as variáveis de ambiente necessárias.

---

## Licença

Este software está sob a **GNU General Public License v3.0 (GPLv3)**.
