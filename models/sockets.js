const {
  usuarioConectado,
  usuarioDesconectado,
  getUsuarios,
  grabarMensaje,
} = require("../controllers/socket");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);

      if (!valido) {
        return socket.disconnect();
      }

      await usuarioConectado(uid);
      //unir al usuario a una sala de chat
      socket.join(uid);
      //TODO: Validar Jwt
      //si no es valido desconectar
      //saber q usuario esta activo
      //emitir todos los usuarios conectados
      this.io.emit("lista-usuarios", await getUsuarios());
      //Socket join
      //escuchar cuando manda un mensaje
      socket.on("mensaje-personal", async (payload) => {
        const mensaje = await grabarMensaje(payload);
        this.io.to(payload.para).emit("mensaje-personal", mensaje);
        this.io.to(payload.de).emit("mensaje-personal", mensaje);
      });
      //disconnect marcar q usuario se desconecto
      socket.on("disconnect", async () => {
        await usuarioDesconectado(uid);
        this.io.emit("lista-usuarios", await getUsuarios());
      });
      //emitir todos los usuarios conectados
    });
  }
}

module.exports = Sockets;
