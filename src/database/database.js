import { Sequelize } from 'sequelize';
import * as fs from 'fs';
import { exec } from'child_process';
import * as diff from 'diff';
import * as path from 'path';
import { randomInt } from 'crypto';

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
    allowNull: false,
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
  },
  nb_file:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
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
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
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
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
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

export async function getEmploye(id)
{
  let user = await Employe.findByPk(id)
  if (user == null)
        return null
  return user.dataValues;
}

export async function getTask(name)
{
  let user = await Task.findOne({
    where :
    {
      name: name
    }
  });
  if (user == null)
        return null
  return user.dataValues;
}

export async function getFiles_fromid(id)
{
  let user = await Files.findByPk(id)
  if (user == null)
        return null
  return user.dataValues;
}

export async function getFiles_frompath(path_given)
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

export async function updateFile(path, userID)
{
  let file = await Files.findOne({
    where:{
      path: path
    }
  })
  if (file == null)
    return null
  file.path = new_path
  file.code_tidiness = checkClangFormat(new_path)
  file.runtime = estimateRuntime(new_path);
  file.coverage = coverage(new_path);
  await file.save()
  let user = await Employe.findByPk(userID)
  if (user == null)
    return file.dataValues; 
  user.nb_file = user.nb_file+1;
  user.runtime = user.runtime + file.runtime / user.nb_filep;
  let tmp = randomInt(-10,10)
  if (user.warnings + tmp < 0)
    user.warnings = 5
  else
    user.total_warnings = user.warnings + tmp;
  user.test_coverage = user.test_coverage+ file.coverage;
  return file.dataValues;
}

export async function AddFile(new_path)
{
  if (updateFile(new_path) != null)
    return;
  const tmp = await Files.create({path: new_path, code_tidiness:0, runtime:0, warnings:0, coverage:0});
}

export async function AddTask(name, assignor, assignee)
{
  if (getTask(name) != null)
    return;
  const tmp = await Task.create({name: name, state:"UNCOMPLETE", assignor:assignor, assignee:assignee});
}


export async function updateTask(id, new_state)
{
  let user = await Task.findByPk(id)
  if (user == null)
    return null
  user.state = new_state
  await user.save()
  return user.dataValues;
}

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
    console.log(`Conformance to standard format: ${conformance.toFixed(2)}%`);
    return conformance;
  } catch (error) {
    console.error(error);
  }
}

// function runClangTidy(filePath) {
//   return new Promise((resolve, reject) => {
//     const fileExtension = filePath.split('.').pop();
//     let command = `clang-tidy ${filePath} -- -I.`;

//     if (fileExtension === 'c') {
//       command = `clang-tidy ${filePath} -- -x c -I.`; // Specify language as C
//     }

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         const errorCount = extractErrorCount(stderr);
//         const totalLines = countLines(filePath);
//         const errorPercentage = (errorCount / totalLines) * 100;
//         resolve(errorPercentage);
//       } else {
//         resolve(0);
//       }
//     });
//   });
// }

// function extractErrorCount(stderr) {
//   const match = stderr.match(/(\d+) error(?:s)? generated./);
//   if (match && match[1]) {
//     return parseInt(match[1], 10);
//   }
//   return 0;
// }

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

async function coverage(filePath){
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file: ${err}`);
      }
      const lines = data.split('\n')
      let count = 0
      for (const line of lines)
        if (line.includes('bool test_coverage()'))
          count++
      return count
    });
}

// async function clearAllTables() {
//   try {
//     await Employe.destroy({ where: {}, truncate: true });
//     await Files.destroy({ where: {}, truncate: true });
//     await Task.destroy({ where: {}, truncate: true });
//     console.log('All tables cleared successfully');
//   } catch (error) {
//     console.error('Error clearing tables:', error);
//   }
//  }
// (async() => {
//   clearAllTables()
// })

// (async () => {
//   launch_DB() // ca c en 1
//   const user1 = await Employe.create({
//     name: "fred", password: "123", poste: 0, runtime: 0, code_tidiness: 0, total_tache: 0, total_warnings: 0, test_coverage: 0, email: "fred@email.com", github: "github/fred", nb_file: 0
//   });

//   const user2 = await Employe.create({
//     name: "sife", password: "456", poste: 1, runtime: 0, code_tidiness: 0, total_tache: 0, total_warnings: 0, test_coverage: 0, email: "sife@email.com", github: "sife/github", nb_file: 0
//   });
  
//   const user3 = await Employe.create({
//     name: "marc", password: "789", poste: 0, runtime: 0, code_tidiness: 0, total_tache: 0, total_warnings: 0, test_coverage: 0, email: "marc@email.com", github: "marc/github", nb_file: 0
//   });

//   const tache1 = await Task.create({
//     name: "tache1", state:"UNCOMPLETE", assignor:user2.id,assignee:user1.id
//   });


//   // console.log(await getEmploye(user1.id));
//   // console.log(await getEmploye(user2.id));
//   // console.log(await getEmploye(user3.id));
//   // console.log(await getTask(tache1.id));
// })();
