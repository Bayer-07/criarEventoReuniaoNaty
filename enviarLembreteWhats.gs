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
      tags: [
        "Best App",
        "Chatbot"
      ],
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

  var pastaId = "15138ECUf55WM_vy3io4FyvmyHejASeIo";
  var pasta = DriveApp.getFolderById(pastaId);
  pasta.createFile(nomeArquivo, jsonStr, "application/json");

  Logger.log("Arquivo JSON criado na pasta: " + nomeArquivo);

  enviarMensagemViaAPI(mensagens);
}

function enviarMensagemViaAPI(mensagens) {
  var url = "https://api.staging.naty.app/api/v2/messages";

  var payload = {
    name: "Reuniões Diárias",
    whatsappId: "c5331e39-9feb-4e44-b37e-2ea84ae243a0",
    queueId: "d4d94c1b-5697-4184-a851-db1be1b990e6",
    minMsgInterval: 1000,
    maxMsgInterval: 2000,
    messages: mensagens
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWFkOmNhbXBhaWducyIsIm1hbmFnZTpjYW1wYWlnbnMiLCJjcmVhdGU6bWVzc2FnZXMiLCJjcmVhdGU6bWVkaWFzIiwicmVhZDp3aGF0c2FwcHMiLCJ1cGRhdGU6d2hhdHNhcHBzIiwicmVhZDpxdWV1ZXMiLCJyZWFkOnVzZXJzIl0sImNvbXBhbnlJZCI6ImZmNDUzYmU5LTkyYzctNGVlZS1iNjE1LThmMTg5MDEzMTg0YSIsImlhdCI6MTcwNjgwOTA3NH0.q5w4XGartpQwjODEsHUzMNvUToji_UIe3oZxXG5A3ng",
      "User-Agent": "insomnia/9.2.0"
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