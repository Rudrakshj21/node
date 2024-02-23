// import module
// const fs = require("fs");
/////////////////////////////////////////////
// FILE SYSTEM
// Blocking Synchronous way
// get content of file

/*const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

console.log(textIn);
const textAppend = `I still do not like avocados 🤢...\n created on  ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textAppend);
// if not present creates a new file
console.log("file written");
console.log("getting file content");

const outputTxtFile = fs.readFileSync("./txt/output.txt", "utf-8");
console.log(outputTxtFile);
*/
// Non-Blocking Asynchronous Way
/*
fs.readFile("./txt/start.txt", "utf-8", (err, fileName) => {
  if (err) return console.log("❌❌❌");
  //   first async call reads content from start.txt which contains the name of the file
  fs.readFile(`./txt/${fileName}.txt`, "utf-8", (err, fileContent) => {
    // console.log(fileContent);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, file2Content) => {
      //   console.log(file2Content);
      //   now  write content of both files into a single file
      fs.writeFile(
        "./txt/final.txt",
        `${fileContent}\n${file2Content}✅`,
        "utf-8",
        (err) => {
          console.log("filed has been written");
          console.log(err);
        }
      );
    });
  });
});
console.log("reading....");
*/

/////////////////////////////////////////////////////////////
// SERVER
/*
const http = require("http");
const fileData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const fileDataObject = JSON.parse(fileData);
// console.log(fileDataObject);

// if we put reading file operation every time we hit /api it would need to always read the file
// we are using synchronous function as this is top level code and executes only once so it
// does not matter if it is blocking the event loop and also its way easier to handle data (directly store in variable no callbacks)

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const pathName = req.url;
  if (pathName === "/") res.end("you are at home....");
  else if (pathName === "/overview") res.end("you are at overview");
  else if (pathName === "/products") res.end("view products");
  else if (pathName === "/api") {
    res.end(fileData);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "ehhhhhhh u hit the wrong route",
    });
    res.end("<h1>page is not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on the port 8000");
});
*/

///////////////////////////////////

const http = require("http");
const fs = require("fs");
const url = require("url");

// get data

const fileContent = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const fileContentObject = JSON.parse(fileContent);
// console.log(fileContentObject);
/* test
const string = "{$PRODUCTNAME} is found at the {$PRODUCTNAME}";
fileContentObject.map((obj) => {
  console.log(string.replace(/\{\$PRODUCTNAME\}/g, obj.productName));
});
*/

// console.log(fileContentObject);
// replace template

function replaceTemplate(object, template) {
  // console.log("object.......", object);
  // console.log("template....", template);
  // console.log(object.image, object.productName);
  let replaceTemplateWithObjectData = template.replace(
    /\{%IMAGE%\}/g,
    object.image
  ); //g flag for all lines
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%PRODUCT_NAME%\}/g,
    object.productName
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%ID%\}/g,
    object.id
  );

  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%QUANTITY%\}/g,
    object.quantity
  );

  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%PRICE%\}/g,
    object.price
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%NUTRIENTS%\}/g,
    object.nutrients
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%FROM%\}/g,
    object.from
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%DESCRIPTION%\}/g,
    object.description
  );
  // if the product is not organic replace the class to 'not-organic'
  if (!object.organic)
    replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
      /\{%NOT_ORGANIC%\}/gm,
      "not-organic"
    );
  // console.log(replaceTemplateWithObjectData);

  return replaceTemplateWithObjectData;
}

// Get templates

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

function findProductById(objectsArray, targetId) {
  // console.log(objectsArray, targetId);
  const product = objectsArray.filter((object) => {
    return object.id === targetId;
  });
  // console.log(product);
  return product;
}

// server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  // console.log(req.url);
  // console.log(url.parse(req.url, true));
  const urlParseObject = url.parse(req.url, true);
  if (urlParseObject.pathname === "/product") {
    // all product ids are of type Number
    const productId = +urlParseObject.query.id;
    // console.log(productId)
    const targetProductData = findProductById(fileContentObject, productId);
    // return type is array
    // console.log(targetProductData);
    const targetProductHtml = replaceTemplate(
      ...targetProductData,
      templateProduct
    );
    // console.log(urlParseObject);
    res.end(targetProductHtml);
  }
  // Overview
  else if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    // replaced card data
    let replacedTemplateWithObjectDataArray = fileContentObject.map((object) =>
      replaceTemplate(object, templateCard)
    );

    // console.log(typeof replacedTemplateWithObjectDataArray);
    // console.log(replacedTemplateWithObjectDataArray) //array
    // replaced overview with cards
    const output = templateOverview.replace(
      /\{%PRODUCT_CARDS%\}/g,
      replacedTemplateWithObjectDataArray.join("")
    );
    res.end(output); // accepts only string
    // res.end("This is overview page.....");
  }
  // product page
  else if (pathName === "/product") {
  }
  // Api
  else if (pathName === "/api") {
  }
  // Not found
  else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>PAGE 404 NOT FOUND </h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("started server.....");
});
