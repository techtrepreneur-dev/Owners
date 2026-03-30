import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { authMiddleware } from "./middleware/authMiddleware.js";

/* ROUTE IMPORT */
import authRoutes from "./routes/authRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
// import leaseRoutes from "./routes/leaseRoutes";
import applicationRoutes from "./routes/applicationRoutes.js";

// Configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("this is home")
})

app.use("/auth", authRoutes);


app.use("/applications", authMiddleware, applicationRoutes);
app.use("/properties", propertyRoutes);
// app.use("/leases", leaseRoutes);
app.use("/tenants", authMiddleware, tenantRoutes);
app.use("/managers", authMiddleware, managerRoutes);

/* SERVER */
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

