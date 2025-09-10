require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");
const path = require("path");

// init passport
try {
  require("./config/passport");
} catch (e) {}

// Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(passport.initialize());

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// Swagger setup
const BASE_URL =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "E-commerce backend API documentation",
    },
    servers: [{ url: BASE_URL }],
  },
  apis: [path.resolve(__dirname, "routes/*.js")], // absolute path
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect DB and start server
connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopdb")
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running at ${BASE_URL}`);
      console.log(`📄 Swagger docs available at ${BASE_URL}/api/docs`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connect error", err);
    process.exit(1);
  });
