
const gruposPorEstilo = {
  Rock: [
    { id: "queen", nombre: "Queen" },
    { id: "rolling", nombre: "The Rolling Stones" },
    { id: "nirvana", nombre: "Nirvana" },
  ],
  Pop: [
    { id: "madonna", nombre: "Madonna" },
    { id: "mj", nombre: "Michael Jackson" },
    { id: "taylor", nombre: "Taylor Swift" },
  ],
  Jazz: [
    { id: "miles", nombre: "Miles Davis" },
    { id: "coltrane", nombre: "John Coltrane" },
    { id: "ella", nombre: "Ella Fitzgerald" },
  ],
};

const formGrupos = document.getElementById("formGrupos");
const btnProcesar = document.getElementById("btnProcesar");
const salidaEl = document.getElementById("salida");

// Generar inputs para calificar cada grupo
function crearFormulario() {
  for (const estilo in gruposPorEstilo) {
    const grupos = gruposPorEstilo[estilo];
    const tituloEstilo = document.createElement("h3");
    tituloEstilo.textContent = estilo;
    formGrupos.appendChild(tituloEstilo);

    grupos.forEach((grupo) => {
      const div = document.createElement("div");
      div.classList.add("grupo");

      const label = document.createElement("label");
      label.setAttribute("for", grupo.id);
      label.textContent = grupo.nombre;

      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 10;
      input.value = 5; // valor inicial
      input.id = grupo.id;
      input.name = grupo.id;

      div.appendChild(label);
      div.appendChild(input);
      formGrupos.appendChild(div);
    });
  }
}

function procesarInformacion() {
  // Obtener calificaciones del formulario
  const calificaciones = {};
  for (const estilo in gruposPorEstilo) {
    gruposPorEstilo[estilo].forEach(({ id }) => {
      const valor = parseInt(document.getElementById(id).value);
      calificaciones[id] = isNaN(valor) ? 0 : valor;
    });
  }

  // Sumar calificaciones por estilo
  const sumasPorEstilo = Object.entries(gruposPorEstilo).map(([estilo, grupos]) => {
    const suma = grupos.reduce((acc, g) => acc + (calificaciones[g.id] || 0), 0);
    return { estilo, suma };
  });

  // Crear tensor para usar argMax y encontrar estilo favorito
  const tensor = tf.tensor1d(sumasPorEstilo.map((e) => e.suma));
  const maxIndex = tensor.argMax().arraySync();

  // Ordenar estilos de mayor a menor suma
  const rankingOrdenado = sumasPorEstilo.slice().sort((a, b) => b.suma - a.suma);

  salidaEl.innerHTML = "<h2>Ranking de estilos según tus calificaciones:</h2>";
  rankingOrdenado.forEach(({ estilo, suma }, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${estilo} (Puntaje total: ${suma})`;
    salidaEl.appendChild(p);
  });

  // Mostrar recomendaciones: Top 3 grupos del estilo favorito según calificación
  const estiloFavorito = rankingOrdenado[0].estilo;
  const gruposDelFavorito = gruposPorEstilo[estiloFavorito];

  const gruposOrdenados = gruposDelFavorito.slice().sort((a, b) => {
    return (calificaciones[b.id] || 0) - (calificaciones[a.id] || 0);
  });

  const recomendados = gruposOrdenados.slice(0, 3);

  const recTitle = document.createElement("h3");
  recTitle.textContent = `Recomendaciones para ti en estilo ${estiloFavorito}:`;
  salidaEl.appendChild(recTitle);

  recomendados.forEach(({ nombre, id }) => {
    const p = document.createElement("p");
    p.textContent = `- ${nombre} (Calificación: ${calificaciones[id]})`;
    salidaEl.appendChild(p);
  });
}

// Eventos
btnProcesar.addEventListener("click", (e) => {
  e.preventDefault();
  procesarInformacion();
});

// Inicializar formulario
crearFormulario();
