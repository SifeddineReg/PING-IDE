import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

// Define the Employe model
const Employe = sequelize.define('Employe', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  NAME: {
    type: Sequelize.STRING,
    allowNull: false
  },
  POSTE: {
    type: Sequelize.INTEGER,
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
  }
});

// Define the Files model
const Files = sequelize.define('Files', {
  ID: {
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

// Create the tables in the database
sequelize.sync()
  .then(() => {
    console.log('Tables created successfully');
  })
  .catch((error) => {
    console.error('Error creating tables:', error);
  });

  const fs = require('fs');
const { exec } = require('child_process');
const diff = require('diff');

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
  } catch (error) {
    console.error(error);
  }
}

function runClangTidy(filePath) {
    return new Promise((resolve, reject) => {
      exec(`clang-tidy ${filePath} -- -I.`, (error, stdout, stderr) => {
        if (error) {
          reject(`Error running clang-tidy: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  }
  
  function countWarnings(clangTidyOutput) {
    const warningLines = clangTidyOutput.split('\n').filter(line => line.includes('warning:'));
    return warningLines.length;
  }
  
  async function checkWarnings(filePath) {
    try {
      const clangTidyOutput = await runClangTidy(filePath);
      const warningCount = countWarnings(clangTidyOutput);
      console.log(`Number of warnings in ${filePath}: ${warningCount}`);
    } catch (error) {
      console.error(error);
    }
  }

  const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to compile the C++ file
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

// Function to measure the runtime of the compiled program
function measureRuntime(executablePath) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    exec(executablePath, (error, stdout, stderr) => {
      const end = process.hrtime(start);
      if (error) {
        reject(`Error running executable: ${stderr}`);
      } else {
        const runtime = (end[0] * 1e9 + end[1]) / 1e9; // Convert to seconds
        resolve(runtime);
      }
    });
  });
}

// Main function to compile and measure runtime
async function estimateRuntime(filePath) {
  try {
    const outputPath = path.join(__dirname, 'outputExecutable');
    await compileCpp(filePath, outputPath);
    const runtime = await measureRuntime(outputPath);
    console.log(`Estimated runtime of ${filePath}: ${runtime.toFixed(6)} seconds`);
  } catch (error) {
    console.error(error);
  }
}

// Example usage
const filePath = 'path/to/your/file.cpp';
estimateRuntime(filePath);