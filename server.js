const express = require("express");
const app = express();

app.use(express.json());

// memoria temporanea per i ticket
let tickets = [];

// funzione per generare risposta intelligente
function generateReply(message) {
  const testo = message.toLowerCase();

  if (testo.includes("login")) {
    return "🔐 Se hai problemi di login, prova a reimpostare la password o verifica le credenziali.";
  }

  if (testo.includes("password")) {
    return "🔑 Puoi reimpostare la password cliccando su 'Password dimenticata'.";
  }

  if (testo.includes("errore")) {
    return "⚠️ Puoi descrivere meglio l'errore oppure inviare uno screenshot?";
  }

  if (testo.includes("accesso")) {
    return "🔓 Controlla che username e password siano corretti e che l’account sia attivo.";
  }

  // risposta di default
  return "🤖 Sto analizzando il problema. Puoi fornire più dettagli?";
}

// API CHAT
app.post("/chat", (req, res) => {
  const message = req.body.message;

  // crea ticket
  const ticket = {
    id: tickets.length + 1,
    message: message,
    risolto: false
  };

  tickets.push(ticket);

  // genera risposta
  const reply = generateReply(message);

  res.json({
    reply: reply,
    ticket_id: ticket.id
  });
});

// KPI
app.get("/stats", (req, res) => {
  const totale = tickets.length;
  const risolti = tickets.filter(t => t.risolto).length;

  res.json({
    totale: totale,
    risolti: risolti
  });
});

// serve la pagina web
app.use(express.static("public"));

// avvio server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server attivo su porta " + PORT);
});
