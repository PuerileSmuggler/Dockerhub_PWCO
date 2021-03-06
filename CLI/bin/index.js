const mysql = require("mysql");
const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
};

const connection = mysql.createConnection({
  host: "mysql",
  user: "stokarzewski",
  password: "XD",
});

yargs(hideBin(process.argv))
  .command(
    "create",
    "create new database",
    (yargs) => {
      yargs.argv;
    },
    (argv) => {
      connection.connect((err) => {
        if (err) throw err;
        connection.query(
          `CREATE DATABASE IF NOT EXISTS ${"testdb"}`,
          (err, result) => {
            if (err) throw err;
            console.log(
              boxen(
                chalk.blue.bold(`Database ${"testdb"} created successfully`),
                boxenOptions
              )
            );
            process.exit();
          }
        );
      });
    }
  )
  .command(
    "delete",
    "delete database",
    (yargs) => {
      yargs.argv;
    },
    (argv) => {
      connection.connect((err) => {
        if (err) throw err;
        connection.query(`DROP DATABASE ${"testdb"}`, (err, result) => {
          if (err) throw err;
          console.log(
            boxen(
              chalk.blue.bold(`Database ${"testdb"} deleted successfully`),
              boxenOptions
            )
          );
          process.exit();
        });
      });
    }
  )
  .command(
    "create-table",
    "create table",
    (yargs) => {
      yargs.argv;
    },
    (argv) => {
      connection.connect((err) => {
        if (err) throw err;
        connection.query(
          `CREATE TABLE IF NOT EXISTS testdb.testTable (
            Id int NOT NULL AUTO_INCREMENT,
            FirstName varchar(255) NOT NULL,
            LastName varchar(255),
            PRIMARY KEY (Id)
        );`,
          (err, result) => {
            if (err) throw err;
            console.log(
              boxen(
                chalk.blue.bold(`Table ${"testTable"} created successfully`),
                boxenOptions
              )
            );
            process.exit();
          }
        );
      });
    }
  )
  .command(
    "insert [firstName] [lastName]",
    "create table",
    (yargs) => {
      yargs.argv;
    },
    (argv) => {
      if (!argv.firstName || !argv.lastName) {
        console.log(chalk.red.bold("Incorrect amount of parameters."));
        process.exit(1);
      }
      connection.connect((err) => {
        if (err) throw err;
        connection.query(
          `INSERT INTO testdb.testTable (FirstName,LastName) VALUES ("${argv.firstName}","${argv.lastName}");`,
          (err, result) => {
            if (err) throw err;
            console.log(
              boxen(
                `Successfully created new row with id = ${result.insertId}`,
                boxenOptions
              )
            );
            process.exit();
          }
        );
      });
    }
  )
  .command(
    "delete [id]",
    "create table",
    (yargs) => {
      yargs.argv;
    },
    (argv) => {
      connection.connect((err) => {
        if (err) throw err;
        connection.query(
          `DELETE FROM testdb.testTable WHERE id=${argv.id}`,
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
              console.log(
                boxen(`Couldn't find row with id = ${argv.id}`, boxenOptions)
              );
            } else {
              console.log(
                boxen(
                  `Successfully deleted a row with id = ${argv.id}`,
                  boxenOptions
                )
              );
            }
            process.exit();
          }
        );
      });
    }
  )
  .command(
    "print",
    "print table rows",
    (yargs) => {
      yargs.argv;
    },
    (argv) => {
      connection.connect((err) => {
        if (err) throw err;
        connection.query("SELECT * FROM testdb.testTable", (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
            console.log(boxen("Table is empty", boxenOptions));
          } else {
            const resultMap = result
              .map(({ Id, FirstName, LastName }) => {
                return `${Id}   ${FirstName}  ${LastName}\n`;
              })
              .join("");
            console.log(
              boxen(`ID  Name    Surname\n${resultMap}`, boxenOptions)
            );
          }

          process.exit();
        });
      });
    }
  )
  .command(
    "edit [id]",
    "print table rows",
    (yargs) => {
      yargs
        .option("f", {
          alias: "firstName",
          describe: "First name",
          type: "string",
          demandOption: false,
        })
        .option("l", {
          alias: "lastName",
          describe: "Last name",
          type: "string",
          demandOption: false,
        }).argv;
    },
    (argv) => {
      if (!argv.id || (!argv.firstName && !argv.lastName)) {
        console.log(boxen(`Not enough parameters`, boxenOptions));
        process.exit(1);
      }
      connection.connect((err) => {
        if (err) throw err;
        connection.query(
          `UPDATE testdb.testTable SET ${
            argv.firstName ? `FirstName = "${argv.firstName}" ` : ""
          }${argv.lastName ? `LastName = "${argv.lastName}"` : ""} WHERE id=${
            argv.id
          }`,
          (err, result) => {
            if (err) throw err;
            console.log(
              boxen(
                `Successfully updated row with id = ${argv.id}`,
                boxenOptions
              )
            );

            process.exit();
          }
        );
      });
    }
  ).argv;
