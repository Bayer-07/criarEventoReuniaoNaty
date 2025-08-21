function gerarJSONEventosDoDiaFormatado() {
  var calendario = CalendarApp.getDefaultCalendar();

  var hoje = new Date();
  var inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
  var fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);

  var eventos = calendario.getEvents(inicio, fim);
  eventos.sort(function (a, b) {
    return a.getStartTime() - b.getStartTime();
  });

  function formatarHora(date) {
    return String(date.getHours()).padStart(2, '0') + ":" +
      String(date.getMinutes()).padStart(2, '0');
  }

  var mensagens = eventos.map(function (evento, index) {
    return {
      number: "/* [NÚMERO PARA ENVIAR O LEMBRETE] */",
      name: evento.getTitle() || "Contato",
      body: "Reunião " + (index + 1) + ":\n" +
        "Empresa: " + evento.getTitle() + "\n" +
        "Horário: " + formatarHora(evento.getStartTime()) + "\n" +
        (evento.getDescription() ? evento.getDescription() : "")
    };
  });

  var jsonStr = JSON.stringify({ messages: mensagens }, null, 2);
  var nomeArquivo = "Reuniões " +
    String(hoje.getDate()).padStart(2, '0') + "/" +
    String(hoje.getMonth() + 1).padStart(2, '0') + ".json";

  var pastaId = "/*[ID DA PASTA ONDE SERÃO CRIADOS OS ARQUIVOS JSON]*/";
  var pasta = DriveApp.getFolderById(pastaId);
  pasta.createFile(nomeArquivo, jsonStr, "application/json");

  Logger.log("Arquivo JSON criado na pasta: " + nomeArquivo);

  enviarMensagemViaAPI(mensagens);
}

function enviarMensagemViaAPI(mensagens) {
  var url = "/*[URL DA API]*/";

  var payload = {
    name: "Reuniões Diárias",
    whatsappId: "/*[ID DO WHATSAPP]*/",
    queueId: "/*[ID DA FILA]*/",
    minMsgInterval: 1000,
    maxMsgInterval: 2000,
    messages: mensagens
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: /*[TOKEN DA SUA API]*/,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log("Código: " + response.getResponseCode());
    Logger.log("Resposta: " + response.getContentText());
  } catch (e) {
    Logger.log("Erro na requisição: " + e);
  }
}