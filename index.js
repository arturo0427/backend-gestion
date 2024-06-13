import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

const app = express();

// Config
dotenv.config({ path: ".env" });
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor corriendo");
});

// Conexion a la base de datos
mongoose
  .connect(process.env.BD_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Conectado");
  })
  .catch((err) => {
    console.log(err);
  });

//   ******MODELS******
const departamentoSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

const Departamento = mongoose.model("Departamento", departamentoSchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  puesto: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  departamentoId: {
    type: Schema.Types.ObjectId,
    ref: "Departamento",
  },
});

const User = mongoose.model("User", userSchema);

// ************* CRUD ****************

// READ
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

app.get("/departamentos", async (req, res) => {
  try {
    const departamentos = await Departamento.find();
    res.json(departamentos);
  } catch (error) {
    console.log(error);
  }
});

// CREATE
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();
    res.json(saveUser);
  } catch (error) {
    console.log(error);
  }
});

app.post("/departamentos", async (req, res) => {
  try {
    const newDepartamento = new Departamento(req.body);
    const saveDepartamento = await newDepartamento.save();
    res.json(saveDepartamento);
  } catch (error) {
    console.log(error);
  }
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/departamentos/:id", async (req, res) => {
  try {
    const deleteDepartamentos = await Departamento.findByIdAndDelete(
      req.params.id
    );
    if (!deleteDepartamentos) {
      return res.status(404).send("Departamento no encontrado");
    }
    res.json({ message: "Departamento eliminado" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
