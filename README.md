# 🎓 Projeto A3 - Desafio do Saber

O projeto Desafio do Saber surge com o propósito de atender crianças entre 8 e 14 anos, 
oferecendo uma plataforma web gamificada que estimula o aprendizado por meio de 
quizzes interativos. A proposta é incentivar o estudo de forma lúdica, permitindo que os 
usuários acumulem pontos e troquem por elementos de personalização, como cores de 
fundo e personagens de perfil. 

## Integrantes do Grupo 

| Nome | RA |
|--- | --- |
| Alice Barros Viana | 324138379 |
| Eduardo Oliveira de Lana | 324123267 |
| Isabelle Vertello da Costa |324141384 |
| Samuel Henrique Simões de Carvalho | 324231263 |
| Túlio Macedo | 32427421 |

---

## 🚀 Tecnologias Utilizadas

- **Backend:** C#  
  📄 [Documentação do Backend](educa-quiz/backend-dotnet/Backend.md)

- **Frontend:** React  
  📄 [Documentação do Frontend](educa-quiz/frontend-react/Frontend.md)

- **Banco de Dados:** MySQL  
  📄 [Documentação do Banco de Dados](educa-quiz/database/Documentação%20do%20Banco%20de%20Dados%20–%20EducaQuiz.md)

---

## 🧰 Ferramentas necessárias para rodar este projeto

| Aplicativo        | Link de Download                                                                 | Observação                                   |
|-------------------|----------------------------------------------------------------------------------|----------------------------------------------|
| MySQL 8.4.8       | [Download MySQL](https://dev.mysql.com/downloads/mysql/)                         | Obrigatório                                   |
| MySQL Workbench   | [Download MySQL Workbench](https://dev.mysql.com/downloads/workbench/)           | Opcional – para visualizar o banco melhor |
| .NET 10 SDK       | [Download .NET SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)     | Obrigatório                                   |
| Node.js           | [Download Node.js](https://nodejs.org/en/download/)                              | Obrigatório                                   |

---

## 🛠️ Como Executar

1. Clone este repositório:
   
   ```bash
   git clone https://github.com/SaMueLHsLie2D/Projeto_-Desafio-do-Saber_A3.git

--------

2. Frontend (React):
   
   - Abra o terminal dentro da pasta frontend.
   
   - Rode os seguintes comandos:
   ```bash
   npm install
   npm run dev
   
  O servidor de desenvolvimento será iniciado e você poderá acessar a aplicação pelo navegador.
  
--------


3. Backend (C# .NET):
   
   - Abra o CMD dentro da pasta backend.
   - Execute os seguintes comandos para configurar o banco de dados e rodar o servidor:
    <br>

   ```bash
   dotnet ef migrations add CriarDB
   dotnet ef migrations update
   dotnet run
--------

   ⚠️ **Certifique-se que a configuração do MySQL está de acordo com as definições do projeto para evitar erros de conexão.**
