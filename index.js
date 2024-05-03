const express = require("express");
const morgan = require("morgan");
const { connectdb } = require("./db");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

const PORT = 5070;

app.get("/api/test", (req, res) => {
    res.send({ "message": "Test is successful" }).status(200);
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

const startServer = async () => {
    try {
        connectdb();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Error in starting server", error);
    }
};

startServer();