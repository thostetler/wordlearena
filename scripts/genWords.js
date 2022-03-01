const fs = require("fs");
const path = require("path");

const stream = fs.createReadStream(
  path.resolve(__dirname, "./words_alpha.txt")
);

const out = fs.createWriteStream(path.resolve(__dirname, "../src/words.json"));
let data = [];

stream.on("data", (chunk) => {
  if (chunk) {
    data = data.concat(
      chunk
        .toString()
        .split(/[\r\n]/)
        .filter((w) => w.length === 5)
    );
  }
});

stream.on("end", () => {
  out.write(JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
    }

    console.log("end");
  });
});

stream.on("error", (err) => {
  console.error(err);
});
