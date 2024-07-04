import express from 'express';
import { getEmploye, getTask, getFiles_fromid, getFiles_frompath, updateFile, updateTask, AddFile, AddTask }  from '../database/database.js';

const app = express();
const port = 3000;

app.use(express.json());

// GET endpoints
app.get('/employe/:id', async (req, res) => {
  const id = req.params.id;
  const employe = await getEmploye(id);
  if (employe) {
    return employe;
  } else {
    res.status(404).send('Employe not found');
  }
});

app.get('/task/:id', async (req, res) => {
  const id = req.params.id;
  const task = await getTask(id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.get('/files/:id', async (req, res) => {
  const id = req.params.id;
  const file = await getFiles_fromid(id);
  if (file) {
    res.json(file);
  } else {
    res.status(404).send('File not found');
  }
});

app.get('/files/path/:path', async (req, res) => {
  const path = req.params.path;
  const file = await getFiles_frompath(path);
  if (file) {
    res.json(file);
  } else {
    res.status(404).send('File not found');
  }
});

// UPDATE endpoints
app.put('/file/:id', async (req, res) => {
  const id = req.params.id;
  const { new_path, userID } = req.body;
  const file = await updateFile(id, new_path, userID);
  if (file) {
    res.json(file);
  } else {
    res.status(404).send('File not found');
  }
});

app.put('/task/:id', async (req, res) => {
  const id = req.params.id;
  const { new_state } = req.body;
  const task = await updateTask(id, new_state);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.put('/file/add',async (req,res) => {
  const path = req.params.path;
  await AddFile(path)
})

app.put('/task/add',async (req,res) => {
  const name = req.params.name;
  const assignee = req.params.assignee;
  const assignor = req.params.assignor;
  await AddTask(name,assignee,assignor)
})

app.listen(port, () => {
  console.log("Server listening at http://localhost:${port}");
});