const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const {adminAuth, userAuth} = require("./middleware/auth.js");

const PORT = 3300;

app.set("view engine", "ejs");

connectDB();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./controller/route"));

app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
    res.cookie("jwt", "", {maxAge: "1"});
    res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/user/:id", userAuth, (req, res) => res.render("user"));
app.get("/user/:id/make_request", userAuth, (req, res) => res.render("apply_for_aid"));
app.get("/bank", (req, res) => res.render("bank"));
app.get("/donor/:id", userAuth, (req, res) => res.render("donor"));
app.get("/donor/:id/make_donation", userAuth, (req, res) => res.render("make_donation"));
const server = app.listen(PORT, () =>
    console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1));
});
