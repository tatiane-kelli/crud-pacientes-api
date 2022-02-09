const express = require('express');

const server = express();

server.use(express.json()); 

const patients = [];

server.use((req, res, next) => { 
  console.time('Request'); 
  console.log(`Método: ${req.method}; URL: ${req.url}; `); 

  next();

  console.log('Finalizou');
  console.timeEnd('Request');
});

function checkPatientExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'patient name is required' });
  }
  return next();
} 
  
function checkPatientInArray(req, res, next) {
  const patient = patients[req.params.index];
  if (!patient) {
    return res.status(400).json({ error: 'patient does not exists' });
  }

  req.patient = patient;

  return next();
}

server.get('/patients', (req, res) => {
  return res.json(patients);
}) 

server.get('/patients/:index', checkPatientInArray, (req, res) => {
  return res.json(req.patient);
})

server.post('/patients', checkPatientExists, (req, res) => {
  const { name } = req.body;  
  patients.push(name);

  return res.json(patients);
})

server.put('/patients/:index', checkPatientInArray, checkPatientExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  patients[index] = name;

  return res.json(patients);
});

server.delete('/patients/:index', checkPatientInArray, (req, res) => {
  const { index } = req.params;
  patients.splice(index, 1); 

  return res.send();
});

server.listen(3000);