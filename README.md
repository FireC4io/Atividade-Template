# Technologic — React Native + Express + MongoDB

Atividade prática: aplicativo feito a partir do [template](https://github.com/Emerson-Rocha/AtividadeTemplate), onde os conteúdos são cadastrados, consultados, alterados e excluídos usando uma API REST com Express.js e banco MongoDB.

## Funcionalidades

- **Cadastro de usuário** no primeiro acesso
- **Login** — só usuários logados acessam a área administrativa
- **Nome do usuário no menu** quando está logado
- **Área administrativa** para cadastrar e gerenciar os conteúdos
- **Editar e excluir imagens** (só aparece para quem está logado; visitante apenas visualiza)
- **Pesquisa** por termo (título, subtítulo ou categoria)
- **Perfil** do usuário salvo no banco

## Tecnologias

| Parte | Tecnologia |
|-------|------------|
| App | React Native, Expo 54, React Navigation, React Native Paper |
| API | Node.js, Express.js |
| Banco | MongoDB (Mongoose) |

## Estrutura

```
AtividadeTemplate/
├── backend/
│   └── server.js        # API: modelos e rotas
├── App.js               # Navegação e usuário logado
├── Api.js               # Endereço da API
├── UsuarioContext.js    # Guarda o usuário logado
├── AppBar.js            # Tela inicial (cards e abas)
├── Cards.js             # Card de conteúdo
├── Admin.js             # Área administrativa
├── FormConteudo.js      # Criar / editar conteúdo
├── Login.jsx            # Login
├── Cadastro.jsx         # Cadastro
├── Pesquisa.js          # Pesquisa
├── Perfil.js            # Perfil do usuário
└── CabecaMenu.js        # Menu lateral
```

## Rotas da API

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | `/usuarios` | Cadastra usuário |
| POST | `/login` | Faz login |
| PUT | `/usuarios/:id` | Altera o perfil |
| GET | `/conteudos?busca=termo` | Lista ou pesquisa conteúdos |
| POST | `/conteudos` | Cadastra conteúdo |
| PUT | `/conteudos/:id` | Altera conteúdo |
| DELETE | `/conteudos/:id` | Exclui conteúdo |

## Como rodar

**1. MongoDB** — instale o MongoDB Community Server e deixe rodando.

**2. API**

```bash
cd backend
npm install
npm start
```

Deve aparecer `Conectado ao MongoDB` e `API rodando na porta 3000`.

**3. Endereço da API** — em `Api.js`, coloque o IP do seu computador (descubra com `ipconfig`):

```js
export const API_URL = 'http://SEU_IP:3000';
```

> O celular e o computador precisam estar na mesma rede Wi-Fi.

**4. App**

```bash
npm install
npx expo start
```

Leia o QR code com o aplicativo **Expo Go**.

## Autor

Caio Cesar
