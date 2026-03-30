import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware.js";
/* ROUTE IMPORT */
import authRoutes from "./routes/authRoutes.js";
// import tenantRoutes from "./routes/tenantRoutes.js";
// import managerRoutes from "./routes/managerRoutes.js";
// import propertyRoutes from "./routes/propertyRoutes";
// import leaseRoutes from "./routes/leaseRoutes";
// import applicationRoutes from "./routes/applicationRoutes";
// Configurations
dotenv.config();
const app = express();
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});
app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
app.get("/", (req, res) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    res.send("this is home");
});
app.get("/user", (req, res) => {
    res.send("this is home");
});
// app.use("/applications", applicationRoutes);
// app.use("/properties", propertyRoutes);
// app.use("/leases", leaseRoutes);
// app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
// app.use("/managers", authMiddleware(["manager"]), managerRoutes);
/* SERVER */
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map