import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function App() {

  const [usuarios, setUsuarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

  const [fecha, setFecha] = useState("");
  const [horaLlegada, setHoraLlegada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loadingAsistencias, setLoadingAsistencias] = useState(false);
  const [errorAsistencias, setErrorAsistencias] = useState(null);

  // Cargar usuarios
  useEffect(() => {

    const cargarUsuarios = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${API}/usuarios`);
        setUsuarios(res.data);

      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los usuarios desde la API");
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();

  }, []);

  // Abrir modal usuario
  const abrirUsuario = async (usuario) => {

    setSelected(usuario);

    try {
      setLoadingAsistencias(true);
      setErrorAsistencias(null);

      const res = await axios.get(
        `${API}/asistencias/usuario/${usuario.rut}`
      );

      setAsistencias(res.data);

    } catch (err) {
      console.error(err);
      setErrorAsistencias("No se pudieron cargar las asistencias");
    } finally {
      setLoadingAsistencias(false);
    }
  };

  // Agregar asistencia
  const agregarAsistencia = async () => {

    try {

      await axios.post(`${API}/asistencias`, {
        fecha,
        horaLlegada,
        horaSalida,
        usuario: {
          rut: selected.rut
        }
      });

      abrirUsuario(selected);

      setFecha("");
      setHoraLlegada("");
      setHoraSalida("");

    } catch (err) {
      alert("Error al guardar asistencia");
      console.error(err);
    }
  };

  return (
    <div className="container">

      <h1>Gimnasio - Control de Asistencia</h1>

      {loading && <p>Cargando usuarios...</p>}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid">

          {usuarios.length === 0 && (
            <p>No existen usuarios registrados</p>
          )}

          {usuarios.map(u => (
            <div
              key={u.rut}
              className="card"
              onClick={() => abrirUsuario(u)}
            >
              <h3>{u.nombre} {u.apellido}</h3>
              <p>RUT: {u.rut}</p>
              <p>Tel: {u.telefono}</p>
            </div>
          ))}

        </div>
      )}

      {selected && (
        <div className="modal">

          <div className="modal-content">

            <h2>
              {selected.nombre} {selected.apellido}
            </h2>

            <h3>Asistencias</h3>

            {loadingAsistencias && <p>Cargando asistencias...</p>}

            {errorAsistencias && (
              <div className="error">
                {errorAsistencias}
              </div>
            )}

            {!loadingAsistencias && !errorAsistencias && (
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Llegada</th>
                    <th>Salida</th>
                  </tr>
                </thead>

                <tbody>
                  {asistencias.map(a => (
                    <tr key={a.id}>
                      <td>{a.fecha}</td>
                      <td>{a.horaLlegada}</td>
                      <td>{a.horaSalida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h3>Agregar asistencia</h3>

            <div className="form">

              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
              />

              <input
                type="time"
                value={horaLlegada}
                onChange={e => setHoraLlegada(e.target.value)}
              />

              <input
                type="time"
                value={horaSalida}
                onChange={e => setHoraSalida(e.target.value)}
              />

              <button onClick={agregarAsistencia}>
                Guardar
              </button>

            </div>

            <button
              className="close"
              onClick={() => setSelected(null)}
            >
              Cerrar
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;