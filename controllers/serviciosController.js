//Endpoint para crear servicio

const db = require("../config/db");

exports.crearServicio = (req, res) => {

  const { id_cliente, id_sucursal, trabajo_realizado, fecha, hora } = req.body;

  const query = `
  INSERT INTO servicios
  (id_cliente,id_sucursal,trabajo_realizado,fecha,hora,estado)
  VALUES (?,?,?,?,?,'programado')
  `;

  db.query(query,
    [id_cliente,id_sucursal,trabajo_realizado,fecha,hora],
    (err,result)=>{
      if(err){
        console.error(err);
        res.status(500).send("Error al crear servicio");
      }else{
        res.json({mensaje:"Servicio creado",id:result.insertId});
      }
    });
};

//Endpoint para ver servicios

exports.obtenerServicios = (req,res)=>{

const query = `
SELECT s.id_servicio,c.nombre,s.trabajo_realizado,s.fecha,s.hora
FROM servicios s
JOIN clientes c ON s.id_cliente=c.id_cliente
`;

db.query(query,(err,result)=>{
   if(err){
     res.status(500).send(err);
   }else{
     res.json(result);
   }
});

};

//Endpoint para reagendar servicio
exports.reagendarServicio = (req,res)=>{

const id=req.params.id;
const {fecha,hora}=req.body;

const query="UPDATE servicios SET fecha=?,hora=? WHERE id_servicio=?";

db.query(query,[fecha,hora,id],(err,result)=>{
 if(err){
   res.status(500).send(err);
 }else{
   res.json({mensaje:"Servicio reagendado"});
 }
});

};