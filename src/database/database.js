import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('postgres',process.env.USERNAME,process.env.PASSWORD,{
    host: 'localhost',
    port: '5432',
    dialect: 'postgres'
});

const Employe = sequelize.define('Employes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false
  },
  poste: {
    type: Sequelize.STRING,
    allowNull: false
  },
  runtime: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  code_tidiness: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  total_tache: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  total_warnings: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  test_coverage: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false
  },
  github:{
    type: Sequelize.STRING,
    allowNull: true
  }
});

const Files = sequelize.define('Files', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code_tidiness: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  runtime: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  warnings: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  coverage: {
    type: Sequelize.FLOAT,
    allowNull: false
  }
});

const Task = sequelize.define('Tasks',{
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name:{
    type: Sequelize.STRING,
    allowNull: false
  },
  state:{
    type: Sequelize.STRING,
    allowNull: false
  },
  assignor:{
    type: Sequelize.INTEGER,
    allowNull: false,
    
  },
  assignee:{
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

async function launch_DB(){
  sequelize.sync()
  .then(() => {
    console.log('Tables created successfully');
  })
  .catch((error) => {
    console.error('Error creating tables:', error);
});
return sequelize;
}

async function getEmploye(id)
{
  let user = await Employe.findByPk(id)
  if (user == null)
        return null
  return user.dataValues;
}

async function getFiles_fromid(id)
{
  let user = await Files.findByPk(id)
  if (user == null)
        return null
  return user.dataValues;
}

async function getFiles_frompath(path_given)
{
  let user = await Files.findOne({
    where :
    {
      path: path_given
    }
  });
  if (user == null)
        return null
  return user.dataValues;
}

async function updateFile(id,new_path, userID)
{
  let user = await Files.findByPk(id)
  if (user == null)
    return null
  user.path = new_path
  await user.save()
  /*RUN ALL test coverage and update */
  return user.dataValues;
}

async function updateTask(id, new_state)
{
  let user = await Task.findByPk(id)
  if (user == null)
    return null
  user.state = new_state
  await user.save()
  return user.dataValues;
}

import * as fs from 'fs';
import { exec } from'child_process';
import * as diff from 'diff';

function formatFile(filePath) {
  return new Promise((resolve, reject) => {
    exec(`clang-format ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error formatting file: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file: ${err}`);
      } else {
        resolve(data);
      }
    });
  });
}

function compareFiles(original, formatted) {
  const originalLines = original.split('\n');
  const formattedLines = formatted.split('\n');

  const differences = diff.diffLines(original, formatted);
  const totalLines = originalLines.length;
  const unchangedLines = differences.reduce((acc, part) => {
    return part.added || part.removed ? acc : acc + part.count;
  }, 0);

  return (unchangedLines / totalLines) * 100;
}

async function checkClangFormat(filePath) {
  try {
    const original = await readFile(filePath);
    const formatted = await formatFile(filePath);
    const conformance = compareFiles(original, formatted);
    console.log(`Conformance to .clang-format: ${conformance.toFixed(2)}%`);
    return conformance;
  } catch (error) {
    console.error(error);
  }
}

function runClangTidy(filePath) {
  return new Promise((resolve, reject) => {
    const fileExtension = filePath.split('.').pop();
    let command = `clang-tidy ${filePath} -- -I.`;

    if (fileExtension === 'c') {
      command = `clang-tidy ${filePath} -- -x c -I.`; // Specify language as C
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        const errorCount = extractErrorCount(stderr);
        const totalLines = countLines(filePath);
        const errorPercentage = (errorCount / totalLines) * 100;
        resolve(errorPercentage);
      } else {
        resolve(0);
      }
    });
  });
}

function extractErrorCount(stderr) {
  const match = stderr.match(/(\d+) error(?:s)? generated./);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 0;
}

import * as path from 'path';

function compileCpp(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    exec(`g++ ${filePath} -o ${outputPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error compiling file: ${stderr}`);
      } else {
        resolve(outputPath);
      }
    });
  });
}

function measureRuntime(executablePath) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    exec(executablePath, (error, stdout, stderr) => {
      const end = process.hrtime(start);
      if (error) {
        reject(`Error running executable: ${stderr}`);
      } else {
        const runtime = (end[0] * 1e9 + end[1]) / 1e9; 
        resolve(runtime);
      }
    });
  });
}

async function estimateRuntime(filePath) {
  try {
    const outputPath = path.join(process.cwd(), 'outputExecutable');
    await compileCpp(filePath, outputPath);
    const runtime = await measureRuntime(outputPath);
    console.log(`Estimated runtime of ${filePath}: ${runtime.toFixed(6)} seconds`);
  } catch (error) {
    console.error(error);
  }
}

const filePath = 'test.c';
estimateRuntime(filePath);

export {launch_DB, getEmploye, getFiles_fromid, getFiles_frompath, updateFile, updateTask, checkClangFormat, runClangTidy, compileCpp, measureRuntime, estimateRuntime};