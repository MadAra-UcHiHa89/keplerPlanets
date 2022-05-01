const { parse } = require("csv-parse");
const fs = require("fs");
const results = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

const keplerReadStream = fs
  .createReadStream(__dirname + "/kepler_Data.csv", {
    encoding: "utf8",
  })
  .pipe(
    parse({
      comment: "#", // Specify the comment character so thosse can be ignored
      columns: true, // this tells to return each row in the csv file as a Js object with the column names as the properties
      relax_column_count: true,
    })
  )
  .on("data", (data) => {
    if (isHabitable(data)) {
      results.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(results);
    console.log(`Total ${results.length} habitable planets found `);
  });

// Created a stream which reads data from the kepler_Data.csv file in chunks and emits the data in the stream.

// keplerReadStream.pipe(
//   parse({
//     Comment: "#", // Specify the comment character
//     columns: true, // this tells to return each row in the csv file as a Js object with the column names as the properties
//   })
// );
// The data chunks from the read stream are passed to the parse function which parses the data and emits the data to the "data" event's callback's argument

// keplerReadStream.on("data", (chunkOfData) => {
//   console.log("Chunk of Data sent");
//   results.push(chunkOfData);
// });

// keplerReadStream.on("end", () => {
//   console.log("All data has been read from the kepler_Data.csv file");
//   console.log(results);
// });

// keplerReadStream.on("error", (error) => {
//   console.log("Error occured while reading the kepler_Data.csv file");
//   console.log(error);
// });
