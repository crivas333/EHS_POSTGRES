
// server/src/index.js
import dotenv from "dotenv";
import { Pool } from "pg";
import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { graphqlHTTP } from "express-graphql";
import cookieParser from "cookie-parser";
import { renderPlaygroundPage } from "graphql-playground-html"; // ← CORRECTED EXPORT

import morgan from "morgan";
import os from "os";
import dataGridRoutes from "./rest/routes/dataGridRoutes.js";
import fullCalendarRoutes from "./rest/routes/fullCalendarRoutes.js";
import { sequelize } from "./models/index.js";
import buildSchema from "./graphql/schema.js";

dotenv.config({ path: "./server/src/.env" });

const IN_PROD = process.env.NODE_ENV === "production";

// -----------------------------
// Detect LAN IP
// -----------------------------
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}
const LAN_IP = getLocalIP();
const LAN_SUBNET = LAN_IP.split(".").slice(0, 3).join(".");
const isLAN = IN_PROD && true;

// -----------------------------
// PostgreSQL pool
// -----------------------------
if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: IN_PROD ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
    process.exit(1);
  });

pool.query("SELECT current_database(), current_user, version()")
  .then(res => {
    console.log("Connected to DB:", res.rows[0].current_database);
    console.log("Connected as user:", res.rows[0].current_user);
    console.log("PostgreSQL version:", res.rows[0].version);
  })
  .catch(err => {
    console.error("Test query failed:", err);
  });

// -----------------------------
// Express app
// -----------------------------
const app = express();
if (!IN_PROD) app.use(morgan("dev"));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        const hostname = url.hostname;
        if (hostname === "localhost") return callback(null, true);
        if (hostname.startsWith(LAN_SUBNET)) return callback(null, true);
        return callback(new Error("CORS policy: Origin not allowed"));
      } catch (err) {
        return callback(new Error("CORS policy: Invalid origin"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("Incoming request from origin:", req.headers.origin || "(no origin)");
  next();
});

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ← FIXED
app.use(cookieParser());

// Session (kept for fallback)
const PgStore = connectPgSimple(session);
app.use(
  session({
    store: new PgStore({ pool, tableName: "session" }),
    name: process.env.SESS_NAME || "sid",
    secret: process.env.SESS_SECRET,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESS_LIFETIME) || 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: isLAN ? "lax" : IN_PROD ? "strict" : "lax",
      secure: isLAN ? false : IN_PROD,
    },
  })
);

// REST routes
app.use("/api/v1/dataGrid", dataGridRoutes);
app.use("/api/v1/fullCalendar", fullCalendarRoutes);

// -----------------------------
// GraphQL API (no UI)
// -----------------------------
const schema = buildSchema();

app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    graphiql: false,
    context: { req, res, pool },
    customFormatErrorFn: (err) => {
      console.error("GraphQL Error:", err.message);
      if (err.extensions?.code === "UNAUTHORIZED") {
        req.session?.destroy(() => {});
        res.clearCookie(process.env.SESS_NAME || "sid");
      }
      return {
        message: err.message,
        code: err.extensions?.code || "INTERNAL_ERROR",
        path: err.path,
      };
    },
  }))
);

// -----------------------------
// FULL GRAPHQL PLAYGROUND WITH HEADERS TAB
// -----------------------------
app.get("/playground", (req, res) => {
  const playground = renderPlaygroundPage({
    endpoint: "/graphql",
    subscriptionEndpoint: "/subscriptions", // optional
    settings: {
      "request.credentials": "include", // sends cookies
    },
  });
  res.setHeader("Content-Type", "text/html");
  res.send(playground);
});

// Production frontend
if (IN_PROD) {
  const __dirname = path.resolve();
  const clientDistPath = path.join(__dirname, "dist");
  app.use(express.static(clientDistPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// 404 & error handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    error: IN_PROD ? "Something went wrong!" : err.message,
    ...(IN_PROD ? {} : { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected (no sync)");

    app.listen(PORT, HOST, () => {
      console.log(`Server running at http://${LAN_IP}:${PORT}/graphql`);
      console.log(`FULL PLAYGROUND → http://${LAN_IP}:${PORT}/playground`);
      if (isLAN) {
        console.log(`LAN access: http://${LAN_IP}:${PORT}/playground`);
      }
    });
  } catch (err) {
    console.error("Sequelize connection error:", err);
    process.exit(1);
  }
};

startServer();