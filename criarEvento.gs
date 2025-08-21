function criarEventosPlanilha() {
  var sheet = SpreadsheetApp
    .openById("1MlZVh9jAbjEImmos7IOQhRxrZ10ekzZn0byCCmOgZvk")
    .getSheetByName("Reuniões ");

  if (!sheet) {
    throw new Error("Aba 'Reuniões ' não encontrada. Confira o nome exato da aba.");
  }
  
  var dados = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  var calendario = CalendarApp.getDefaultCalendar();
  
  dados.forEach(function(linha, index) {
    var nome = linha[0];       // Nome
    var status = linha[1];     // Status
    var sdr = linha[2];        // SDR
    var data = linha[3];       // Data
    var horaObs = linha[4];    // Observações
    var emails = linha[5];     // E-mails
    
    // Ingora campos vazios
    if (!nome || !status || !sdr || !data || !horaObs || !emails) {
      Logger.log("Linha " + (index + 2) + " ignorada: campo obrigatório em branco.");
      return;
    }
    
    if (status === "Marcado" && data) {
      try {
        var horaMatch = horaObs ? horaObs.match(/(\d{1,2})h/) : null;
        var hora = horaMatch ? parseInt(horaMatch[1]) : 9; // Caso não tenha horário, define para as 9h
        var minuto = 0;
        
        var inicio = new Date(data);
        inicio.setHours(hora, minuto);
        var fim = new Date(inicio.getTime() + 60 * 60 * 1000); // Evento definido com 1h de duração
        
        var descricao = "SDR: " + sdr + "\nObservações: " + horaObs + "\nEmails: " + emails;
        
        // Verifica duplicados
        var eventosExistentes = calendario.getEvents(inicio, fim, {search: nome});
        if (eventosExistentes.length > 0) {
          Logger.log("Evento já existe: " + nome + " em " + inicio.toLocaleString());
          return;
        }
        
        // Cria evento
        calendario.createEvent(nome, inicio, fim, {description: descricao});
        Logger.log("Evento criado: " + nome);
        
      } catch (e) {
        Logger.log("Erro ao criar evento para: " + nome + " - " + e);
      }
    }
  });
}
