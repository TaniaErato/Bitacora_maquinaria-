const express = require("express");
const cors = require("cors");

const serviciosRoutes = require("./routes/serviciosRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", serviciosRoutes);

app.get("/", (req,res)=>{
    res.send("API Bitácora Maquinaria funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});