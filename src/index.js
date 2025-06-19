const express = require("express");
const app = express();
const routes = require("./routes");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", routes);
app.listen(PORT, () => {
    console.log(`Ung dung dang chay voi port ${PORT}`);
});
