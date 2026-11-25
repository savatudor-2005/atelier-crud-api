const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const FILE_PATH = './comenzi.json';

app.use(express.json());

const citesteDate = () => {
  const data = fs.readFileSync(FILE_PATH, 'utf8');
  return JSON.parse(data);
};

const salveazaDate = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

app.get('/comenzi', (req, res) => {
  const comenzi = citesteDate();
  res.json(comenzi);
});

app.get('/comenzi/:id', (req, res) => {
  const comenzi = citesteDate();
  const id = parseInt(req.params.id);
  const comanda = comenzi.find(c => c.id === id);

  if (!comanda) {
    return res.status(404).json({ mesaj: "Comanda nu a fost găsită" });
  }
  res.json(comanda);
});

app.post('/comenzi', (req, res) => {
  const comenzi = citesteDate();
  const comandaNoua = {
    id: comenzi.length > 0 ? comenzi[comenzi.length - 1].id + 1 : 1,
    client: req.body.client,
    serviciu: req.body.serviciu,
    pret: req.body.pret,
    status: req.body.status || "In asteptare"
  };

  comenzi.push(comandaNoua);
  salveazaDate(comenzi);
  res.status(201).json(comandaNoua);
});

app.put('/comenzi/:id', (req, res) => {
  const comenzi = citesteDate();
  const id = parseInt(req.params.id);
  const comanda = comenzi.find(c => c.id === id);

  if (!comanda) {
    return res.status(404).json({ mesaj: "Comanda nu a fost găsită" });
  }

  comanda.client = req.body.client || comanda.client;
  comanda.serviciu = req.body.serviciu || comanda.serviciu;
  comanda.pret = req.body.pret || comanda.pret;
  comanda.status = req.body.status || comanda.status;

  salveazaDate(comenzi);
  res.json(comanda);
});

app.delete('/comenzi/:id', (req, res) => {
  const comenzi = citesteDate();
  const id = parseInt(req.params.id);
  const index = comenzi.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ mesaj: "Comanda nu a fost găsită" });
  }

  comenzi.splice(index, 1);
  salveazaDate(comenzi);
  res.json({ mesaj: "Comandă ștearsă cu succes" });
});

app.listen(PORT, () => {
  console.log(`Serverul rulează la http://localhost:${PORT}`);
});