# 📅 Automação de Reuniões com Google Apps Script

Este repositório contém scripts de automação para gerenciamento de reuniões, desde a criação de eventos no Google Calendar até o envio de lembretes via WhatsApp.

## � Estrutura do Projeto

- `criarEvento.gs` - Script para criar eventos no Google Calendar a partir de uma planilha
- `enviarLembreteWhats.gs` - Script para enviar lembretes de reuniões via WhatsApp

## 🛠️ Script 1: Criação de Eventos (`criarEvento.gs`)

### 📌 O que este script faz

A função `criarEventosPlanilha()` integra uma planilha do Google Sheets com o Google Calendar.
Ela automatiza a criação de eventos de reuniões a partir dos dados cadastrados em uma aba chamada "Reuniões " (atenção: contém um espaço no final do nome).

### ⚙️ Funcionamento

O script:

1. Acessa a planilha pelo ID informado (openById)
2. Lê todos os dados a partir da linha 2, nas colunas:
   - **A**: Nome
   - **B**: Status
   - **C**: SDR responsável
   - **D**: Data
   - **E**: Observações (de onde extrai a hora da reunião, ex: "14h")
   - **F**: E-mails envolvidos
3. Ignora linhas com campos obrigatórios em branco
4. Se o status for "Marcado", cria um evento no calendário padrão do usuário com:
   - **Título**: Nome da reunião
   - **Início/Fim**: Data e hora (duração padrão de 1h)
   - **Descrição**: SDR, observações e e-mails
5. Verifica se já existe um evento com o mesmo nome e horário para evitar duplicados
6. Registra no log cada ação realizada (evento criado, ignorado ou erro)

## 🔔 Script 2: Envio de Lembretes via WhatsApp (`enviarLembreteWhats.gs`)

### 📌 O que este script faz

A função `gerarJSONEventosDoDiaFormatado()` integra o Google Calendar, o Google Drive e a API da Naty App, automatizando a geração e envio de mensagens com os eventos do dia.

### ⚙️ Funcionamento

O script:

1. Obtém todos os eventos do Google Calendar do usuário para o dia atual
2. Ordena os eventos por horário de início
3. Para cada evento, gera um objeto JSON com:
   - Número de WhatsApp (fixo ou dinâmico)
   - Nome/empresa (título do evento)
   - Tags (ex: "Best App", "Chatbot")
   - Mensagem formatada com nome, horário e descrição
4. Gera um arquivo .json contendo todos os eventos do dia e salva no Google Drive em uma pasta específica
5. Chama a função `enviarMensagemViaAPI()` para enviar as mensagens via WhatsApp

### 📤 Envio via API

A função `enviarMensagemViaAPI(mensagens)`:

1. Monta o payload com os dados da campanha (nome, WhatsApp ID, fila, intervalos de mensagens e lista de mensagens)
2. Realiza uma requisição HTTP POST para a API da Naty App, enviando o JSON
3. Retorna no log o código de resposta e o conteúdo retornado pela API

## ✅ Benefícios do Sistema Completo

- **Automação completa**: Desde o agendamento até a comunicação
- **Redução de erros**: Evita erros manuais e duplicação de eventos
- **Comunicação eficiente**: Lembretes automáticos via WhatsApp
- **Backup de dados**: Armazenamento de eventos em JSON no Google Drive
- **Integração perfeita**: Planilhas, Calendário, Drive e WhatsApp trabalhando juntos

## 🚀 Como Usar

1. Configure os scripts no Google Apps Script
2. Adicione as IDs necessárias (planilha, pastas do Drive, etc.)
3. Configure os gatilhos para execução automática dos scripts
4. Monitore os logs para verificar o funcionamento

## 📝 Observações

- Os scripts exigem permissões para acessar Sheets, Calendar e Drive
- O token de autorização para a API deve ser mantido seguro e atualizado
- Personalize os formatos de mensagem conforme necessário

---

# Script de Envio de Lembretes via WhatsApp

## 📌 O que este script faz

O script `gerarJSONEventosDoDiaFormatado()` integra o Google Calendar, o Google Drive e a API da Naty App, automatizando a geração e envio de mensagens com os eventos do dia.

## ⚙️ Funcionamento

Obtém todos os eventos do Google Calendar do usuário para o dia atual.

Ordena os eventos por horário de início.

Para cada evento, gera um objeto JSON com:

- Número de WhatsApp (fixo ou dinâmico).
- Nome/empresa (título do evento).
- Tags (ex: "Best App", "Chatbot").
- Mensagem formatada com nome, horário e descrição.

Gera um arquivo .json contendo todos os eventos do dia e salva no Google Drive em uma pasta específica (ID configurado no código).

Chama a função enviarMensagemViaAPI() para enviar as mensagens diretamente à API da Naty App, que dispara os conteúdos via WhatsApp.

## 📤 Envio via API

A função `enviarMensagemViaAPI(mensagens)` monta o payload com os dados da campanha (nome, WhatsApp ID, fila, intervalos de mensagens e lista de mensagens).

Realiza uma requisição HTTP POST para a API da Naty App, enviando o JSON.

Retorna no log o código de resposta e o conteúdo retornado pela API.

## ✅ Benefícios

- Automatiza o envio diário de lembretes de reuniões.
- Gera um backup em JSON dos eventos no Google Drive.
- Facilita a comunicação via WhatsApp de forma padronizada e sem esforço manual.
