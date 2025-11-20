import dotenv from "dotenv";
import { Pool } from "pg";
import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { graphqlHTTP } from "express-graphql";
//import { makeExecutableSchema } from "@graphql-tools/schema";
//import { authDirective, guestDirective } from "./directives/index.js";
//import typeDefs from "./graphql/typeDefs/index.js";
//import resolvers from "./resolvers/index.js";
import morgan from "morgan";
import os from "os";
import dataGridRoutes from "./REST_routes/dataGridRoutes.js";
import fullCalendarRoutes from "./REST_routes/fullCalendarRoutes.js";
import { sequelize } from "./models/index.js"; // Sequelize instance
import buildSchema from "./graphql/schema.js";

dotenv.config({ path: "./server/src/.env" });

const IN_PROD = process.env.NODE_ENV === "production";

// -----------------------------
// Detect LAN IP for local network access
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
// PostgreSQL connection (pg.Pool)
// -----------------------------
if (!process.env.DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: IN_PROD ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  });

// Run a test query
pool.query("SELECT current_database(), current_user, version()")
  .then(res => {
    console.log("🎯 Connected to DB:", res.rows[0].current_database);
    console.log("👤 Connected as user:", res.rows[0].current_user);
    console.log("🛠 PostgreSQL version:", res.rows[0].version);
  })
  .catch(err => {
    console.error("❌ Test query failed:", err);
  });

// -----------------------------
// Express app setup
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

// Debug incoming requests
app.use((req, res, next) => {
  console.log("👉 Incoming request from origin:", req.headers.origin || "(no origin header)");
  next();
});

app.disable("x-powered-by");

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// Session setup with PostgreSQL
// -----------------------------
const PgStore = connectPgSimple(session);

app.use(
  session({
    store: new PgStore({
      pool,
      tableName: "session",
    }),
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

// -----------------------------
// REST API routes
// -----------------------------
app.use("/api/v1/dataGrid", dataGridRoutes);
app.use("/api/v1/fullCalendar", fullCalendarRoutes);

// -----------------------------
// GraphQL schema with directives
// -----------------------------
// const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective();
// const { guestDirectiveTypeDefs, guestDirectiveTransformer } = guestDirective();

// let schema = makeExecutableSchema({
//   typeDefs: [authDirectiveTypeDefs, guestDirectiveTypeDefs, typeDefs],
//   resolvers,
// });

// schema = authDirectiveTransformer(schema);
// schema = guestDirectiveTransformer(schema);

const schema = buildSchema();
// -----------------------------
// GraphQL endpoint
// -----------------------------
app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    graphiql: !IN_PROD,
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
// Serve React frontend in production
// -----------------------------
if (IN_PROD) {
  const __dirname = path.resolve();
  const clientDistPath = path.join(__dirname, "dist");

  app.use(express.static(clientDistPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// -----------------------------
// 404 handler
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// -----------------------------
// Global error handler
// -----------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    error: IN_PROD ? "Something went wrong!" : err.message,
    ...(IN_PROD ? {} : { stack: err.stack }),
  });
});

// -----------------------------
// Start server (no Sequelize sync)
// -----------------------------
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

const startServer = async () => {
  try {
    // ✅ Just test the Sequelize connection, don’t sync
    await sequelize.authenticate();
    console.log("✅ Sequelize connected (no sync performed)");

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${LAN_IP}:${PORT}/graphql`);
      if (isLAN) {
        console.log(
          `💡 LAN testing: Access from any phone/laptop at http://${LAN_IP}:${PORT}/graphql`
        );
      }
    });
  } catch (err) {
    console.error("❌ Sequelize connection error:", err);
    process.exit(1);
  }
};

startServer();

