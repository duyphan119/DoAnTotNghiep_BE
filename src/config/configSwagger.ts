import path from "path";

const configSwagger = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API shop bán quần áo",
      version: "1.0.0",
      description: "",
      license: {
        name: "MIT",
        url: "https://thecodebuzz.com",
      },
      contact: {
        name: "Phan Khánh Duy",
        url: "https://www.facebook.com/duydusk1",
        email: "duy.910.2015@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/v1",
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/v1/*")],
};

export default configSwagger;
