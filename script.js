/* ==========================================================
   RUTAS DE DATOS
========================================================== */

const DATA_PATHS = {

  zrc:
    "assets/data/zrc_mc.geojson",

  paramo:
    "assets/data/paramo_guanacas_purace_coconucos.geojson",

  puntos:
    "assets/data/puntos_storymap.geojson",

  municipios:
    "assets/data/limite_municipal_inza_totoro_silvia.geojson"

};


/* ==========================================================
   MAPA BASE
========================================================== */

const map = new maplibregl.Map({

  container:
    "map",

  style: {

    version:
      8,

    sources: {

      osm: {

        type:
          "raster",

        tiles: [
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],

        tileSize:
          256,

        attribution:
          "© OpenStreetMap contributors"

      }

    },

    layers: [

      {

        id:
          "osm",

        type:
          "raster",

        source:
          "osm",

        paint: {

          "raster-saturation":
            -0.35,

          "raster-contrast":
            -0.05,

          "raster-brightness-max":
            0.9

        }

      }

    ]

  },

  center:
    [-76.12, 2.52],

  zoom:
    9,

  pitch:
    0,

  bearing:
    0

});


map.addControl(

  new maplibregl.NavigationControl(),

  "top-right"

);


/* ==========================================================
   VARIABLES GLOBALES
========================================================== */

let zrcData = null;
let paramoData = null;
let puntosData = null;
let municipiosData = null;


/* ==========================================================
   CARGAR GEOJSON
========================================================== */

async function cargarDatosCartograficos() {

  try {

    const responses =
      await Promise.all([

        fetch(DATA_PATHS.zrc),

        fetch(DATA_PATHS.paramo),

        fetch(DATA_PATHS.puntos),

        fetch(DATA_PATHS.municipios)

      ]);


    for (
      const response
      of responses
    ) {

      if (
        !response.ok
      ) {

        throw new Error(
          `No se pudo cargar ${response.url}`
        );

      }

    }


    [

      zrcData,

      paramoData,

      puntosData,

      municipiosData

    ] =
      await Promise.all(

        responses.map(
          response =>
            response.json()
        )

      );


    agregarFuentesYCapas();


    ajustarMapaAZRC();

  } catch (error) {

    console.error(
      "Error cargando cartografía:",
      error
    );

  }

}


/* ==========================================================
   AGREGAR FUENTES
========================================================== */

function agregarFuentesYCapas() {

  /* --------------------------
     MUNICIPIOS
  -------------------------- */

  map.addSource(
    "municipios",
    {

      type:
        "geojson",

      data:
        municipiosData

    }
  );


  map.addLayer({

    id:
      "municipios-fill",

    type:
      "fill",

    source:
      "municipios",

    paint: {

      "fill-color":
        "#ffffff",

      "fill-opacity":
        0.02

    }

  });


  map.addLayer({

    id:
      "municipios-line",

    type:
      "line",

    source:
      "municipios",

    paint: {

      "line-color":
        "#3e4440",

      "line-width":
        1.6,

      "line-opacity":
        0.85

    }

  });


  /* --------------------------
     PÁRAMO
  -------------------------- */

  map.addSource(
    "paramo",
    {

      type:
        "geojson",

      data:
        paramoData

    }
  );


  map.addLayer({

    id:
      "paramo-fill",

    type:
      "fill",

    source:
      "paramo",

    paint: {

      "fill-color":
        "#4c91ad",

      "fill-opacity":
        0.18

    }

  });


  map.addLayer({

    id:
      "paramo-line",

    type:
      "line",

    source:
      "paramo",

    paint: {

      "line-color":
        "#356f88",

      "line-width":
        2,

      "line-dasharray":
        [3, 2],

      "line-opacity":
        0.9

    }

  });


  /* --------------------------
     ZRC
  -------------------------- */

  map.addSource(
    "zrc",
    {

      type:
        "geojson",

      data:
        zrcData

    }
  );


  map.addLayer({

    id:
      "zrc-fill",

    type:
      "fill",

    source:
      "zrc",

    paint: {

      "fill-color": [

        "match",

        [
          "get",
          "Zona"
        ],

        "Alta",
        "#b94c4c",

        "Centro",
        "#2e8eac",

        "Occidente",
        "#8aa735",

        "Turmina",
        "#855483",

        "Baja",
        "#d98932",

        "Media",
        "#d5bc39",

        "Pedregal",
        "#c975ad",

        "San Miguel",
        "#9c7147",

        "Quebrada de Topa",
        "#3e9f8c",

        "San Andres",
        "#6767bd",

        "#487958"

      ],

      "fill-opacity":
        0.46

    }

  });


  map.addLayer({

    id:
      "zrc-line",

    type:
      "line",

    source:
      "zrc",

    paint: {

      "line-color":
        "#26382c",

      "line-width":
        1,

      "line-opacity":
        0.82

    }

  });


  /* --------------------------
     PUNTOS STORYMAP
  -------------------------- */

  map.addSource(
    "puntos-storymap",
    {

      type:
        "geojson",

      data:
        puntosData

    }
  );


  map.addLayer({

    id:
      "puntos-storymap-circle",

    type:
      "circle",

    source:
      "puntos-storymap",

    paint: {

      "circle-radius": [

        "interpolate",

        ["linear"],

        ["zoom"],

        8,
        5,

        12,
        8,

        15,
        10

      ],

      "circle-color": [

        "match",

        [
          "get",
          "section"
        ],

        "Juntanza por el agua",
        "#24754b",

        "Cuidadores de la montaña",
        "#c58d34",

        "#4a6554"

      ],

      "circle-stroke-color":
        "#ffffff",

      "circle-stroke-width":
        2,

      "circle-opacity":
        0.95

    }

  });


  configurarPopups();


  configurarCursor();

}


/* ==========================================================
   BOUNDS
========================================================== */

function recorrerCoordenadas(
  coordinates,
  callback
) {

  if (
    !Array.isArray(
      coordinates
    )
  ) {
    return;
  }


  if (

    coordinates.length >= 2 &&

    typeof coordinates[0] ===
      "number" &&

    typeof coordinates[1] ===
      "number"

  ) {

    callback(
      coordinates
    );

    return;

  }


  coordinates.forEach(
    coordinate => {

      recorrerCoordenadas(
        coordinate,
        callback
      );

    }
  );

}


function obtenerBounds(
  geojson
) {

  const bounds =
    new maplibregl.LngLatBounds();


  geojson.features.forEach(
    feature => {

      recorrerCoordenadas(

        feature.geometry.coordinates,

        coordinate => {

          bounds.extend(
            coordinate
          );

        }

      );

    }
  );


  return bounds;

}


function ajustarMapaAZRC() {

  if (
    !zrcData
  ) {
    return;
  }


  const bounds =
    obtenerBounds(
      zrcData
    );


  map.fitBounds(

    bounds,

    {

      padding: {

        top:
          100,

        bottom:
          70,

        left:
          90,

        right:
          90

      },

      duration:
        1200

    }

  );

}


/* ==========================================================
   POPUPS
========================================================== */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function construirPopupPunto(
  properties
) {

  const section =
    escapeHTML(
      properties.section
    );


  const title =
    escapeHTML(
      properties.title
    );


  const description =
    escapeHTML(
      properties.description
    );


  const media =
    properties.media || "";


  let mediaHTML =
    "";


  if (
    media.toLowerCase()
      .endsWith(".mp4")
  ) {

    mediaHTML = `

      <video
        controls
        playsinline
        preload="metadata"
      >

        <source
          src="${escapeHTML(media)}"
          type="video/mp4"
        >

      </video>

    `;

  } else if (
    media
  ) {

    mediaHTML = `

      <img
        src="${escapeHTML(media)}"
        alt="${title}"
      >

    `;

  }


  return `

    <div class="map-popup">

      ${mediaHTML}

      <div class="map-popup-body">

        <span class="map-popup-section">
          ${section}
        </span>

        <h4>
          ${title}
        </h4>

        ${
          description
            ? `
              <p>
                ${description}
              </p>
            `
            : ""
        }

      </div>

    </div>

  `;

}


function construirPopupZRC(
  properties
) {

  const vereda =
    properties.NOMBRE_VER ||
    "Zona de Reserva Campesina";


  const municipio =
    properties.NOMB_MPIO ||
    "";


  const zona =
    properties.Zona ||
    "";


  const area =
    properties.AREA_HA;


  return `

    <div class="map-popup">

      <div class="map-popup-body">

        <span class="map-popup-section">
          Zona de Reserva Campesina
        </span>

        <h4>
          ${escapeHTML(vereda)}
        </h4>

        ${
          municipio
            ? `
              <p>
                <strong>
                  Municipio:
                </strong>
                ${escapeHTML(municipio)}
              </p>
            `
            : ""
        }

        ${
          zona
            ? `
              <p>
                <strong>
                  Zona:
                </strong>
                ${escapeHTML(zona)}
              </p>
            `
            : ""
        }

        ${
          area !== undefined &&
          area !== null
            ? `
              <p>
                <strong>
                  Área:
                </strong>
                ${Number(area)
                  .toLocaleString(
                    "es-CO",
                    {
                      maximumFractionDigits:
                        2
                    }
                  )}
                ha
              </p>
            `
            : ""
        }

      </div>

    </div>

  `;

}


function construirPopupMunicipio(
  properties
) {

  const municipio =
    properties.NOM_MUNICI ||
    "Municipio";


  return `

    <div class="map-popup">

      <div class="map-popup-body">

        <span class="map-popup-section">
          Límite municipal
        </span>

        <h4>
          ${escapeHTML(municipio)}
        </h4>

      </div>

    </div>

  `;

}


function construirPopupParamo(
  properties
) {

  const nombre =
    properties.Nombre ||
    "Complejo de páramo";


  return `

    <div class="map-popup">

      <div class="map-popup-body">

        <span class="map-popup-section">
          Ecosistema estratégico
        </span>

        <h4>
          ${escapeHTML(nombre)}
        </h4>

      </div>

    </div>

  `;

}


function configurarPopups() {

  map.on(

    "click",

    "puntos-storymap-circle",

    event => {

      const feature =
        event.features[0];


      const coordinates =
        feature.geometry.coordinates
          .slice();


      new maplibregl.Popup({

        offset:
          16,

        maxWidth:
          "330px"

      })

        .setLngLat(
          coordinates
        )

        .setHTML(

          construirPopupPunto(
            feature.properties
          )

        )

        .addTo(
          map
        );

    }

  );


  map.on(

    "click",

    "zrc-fill",

    event => {

      const feature =
        event.features[0];


      new maplibregl.Popup({

        offset:
          8

      })

        .setLngLat(
          event.lngLat
        )

        .setHTML(

          construirPopupZRC(
            feature.properties
          )

        )

        .addTo(
          map
        );

    }

  );


  map.on(

    "click",

    "municipios-fill",

    event => {

      const feature =
        event.features[0];


      new maplibregl.Popup({

        offset:
          8

      })

        .setLngLat(
          event.lngLat
        )

        .setHTML(

          construirPopupMunicipio(
            feature.properties
          )

        )

        .addTo(
          map
        );

    }

  );


  map.on(

    "click",

    "paramo-fill",

    event => {

      const feature =
        event.features[0];


      new maplibregl.Popup({

        offset:
          8

      })

        .setLngLat(
          event.lngLat
        )

        .setHTML(

          construirPopupParamo(
            feature.properties
          )

        )

        .addTo(
          map
        );

    }

  );

}


/* ==========================================================
   CURSOR DEL MAPA
========================================================== */

function configurarCursor() {

  const interactiveLayers = [

    "puntos-storymap-circle",

    "zrc-fill",

    "municipios-fill",

    "paramo-fill"

  ];


  interactiveLayers.forEach(
    layerId => {

      map.on(

        "mouseenter",

        layerId,

        () => {

          map.getCanvas().style.cursor =
            "pointer";

        }

      );


      map.on(

        "mouseleave",

        layerId,

        () => {

          map.getCanvas().style.cursor =
            "";

        }

      );

    }
  );

}


/* ==========================================================
   CONTROL DE CAPAS
========================================================== */

const layerGroups = {

  municipios: [

    "municipios-fill",

    "municipios-line"

  ],

  zrc: [

    "zrc-fill",

    "zrc-line"

  ],

  paramo: [

    "paramo-fill",

    "paramo-line"

  ],

  puntos: [

    "puntos-storymap-circle"

  ]

};


function setGroupVisibility(
  groupName,
  visible
) {

  const layers =
    layerGroups[groupName];


  if (
    !layers
  ) {
    return;
  }


  layers.forEach(
    layerId => {

      if (
        map.getLayer(
          layerId
        )
      ) {

        map.setLayoutProperty(

          layerId,

          "visibility",

          visible
            ? "visible"
            : "none"

        );

      }

    }
  );

}


document
  .querySelectorAll(
    "[data-layer-group]"
  )
  .forEach(
    checkbox => {

      checkbox.addEventListener(
        "change",
        () => {

          setGroupVisibility(

            checkbox.dataset.layerGroup,

            checkbox.checked

          );

        }
      );

    }
  );


/* ==========================================================
   FILTRO DE PUNTOS
========================================================== */

function mostrarTodosLosPuntos() {

  if (
    !map.getLayer(
      "puntos-storymap-circle"
    )
  ) {
    return;
  }


  map.setFilter(

    "puntos-storymap-circle",

    null

  );

}


function mostrarPuntosJuntanza() {

  if (
    !map.getLayer(
      "puntos-storymap-circle"
    )
  ) {
    return;
  }


  map.setFilter(

    "puntos-storymap-circle",

    [

      "==",

      [
        "get",
        "section"
      ],

      "Juntanza por el agua"

    ]

  );

}


function mostrarPuntosCuidadores() {

  if (
    !map.getLayer(
      "puntos-storymap-circle"
    )
  ) {
    return;
  }


  map.setFilter(

    "puntos-storymap-circle",

    [

      "==",

      [
        "get",
        "section"
      ],

      "Cuidadores de la montaña"

    ]

  );

}


/* ==========================================================
   CAPÍTULOS DEL MAPA
========================================================== */

const chapterElements =
  document.querySelectorAll(
    ".chapter"
  );


function activarCapitulo(
  chapterId
) {

  if (
    !zrcData
  ) {
    return;
  }


  if (
    chapterId ===
    "territorio"
  ) {

    setGroupVisibility(
      "municipios",
      true
    );

    setGroupVisibility(
      "zrc",
      true
    );

    setGroupVisibility(
      "paramo",
      false
    );

    setGroupVisibility(
      "puntos",
      false
    );


    ajustarMapaAZRC();

  }


  if (
    chapterId ===
    "paramo"
  ) {

    setGroupVisibility(
      "municipios",
      true
    );

    setGroupVisibility(
      "zrc",
      true
    );

    setGroupVisibility(
      "paramo",
      true
    );

    setGroupVisibility(
      "puntos",
      false
    );


    if (
      paramoData
    ) {

      const bounds =
        obtenerBounds(
          paramoData
        );


      map.fitBounds(

        bounds,

        {

          padding:
            70,

          duration:
            1500

        }

      );

    }

  }


  if (
    chapterId ===
    "juntanza-puntos"
  ) {

    setGroupVisibility(
      "municipios",
      false
    );

    setGroupVisibility(
      "zrc",
      true
    );

    setGroupVisibility(
      "paramo",
      true
    );

    setGroupVisibility(
      "puntos",
      true
    );


    mostrarPuntosJuntanza();


    const juntanza =
      filtrarGeoJSONPorSeccion(
        puntosData,
        "Juntanza por el agua"
      );


    const bounds =
      obtenerBounds(
        juntanza
      );


    map.fitBounds(

      bounds,

      {

        padding:
          90,

        duration:
          1500,

        maxZoom:
          12.5

      }

    );

  }


  if (
    chapterId ===
    "cuidadores-puntos"
  ) {

    setGroupVisibility(
      "municipios",
      false
    );

    setGroupVisibility(
      "zrc",
      true
    );

    setGroupVisibility(
      "paramo",
      true
    );

    setGroupVisibility(
      "puntos",
      true
    );


    mostrarPuntosCuidadores();


    const cuidadores =
      filtrarGeoJSONPorSeccion(
        puntosData,
        "Cuidadores de la montaña"
      );


    const bounds =
      obtenerBounds(
        cuidadores
      );


    map.fitBounds(

      bounds,

      {

        padding:
          90,

        duration:
          1500,

        maxZoom:
          12.5

      }

    );

  }

}


/* ==========================================================
   FILTRAR GEOJSON
========================================================== */

function filtrarGeoJSONPorSeccion(
  geojson,
  section
) {

  return {

    type:
      "FeatureCollection",

    features:
      geojson.features.filter(
        feature =>
          feature.properties.section ===
          section
      )

  };

}


/* ==========================================================
   OBSERVADOR DE CAPÍTULOS
========================================================== */

const chapterObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            !entry.isIntersecting
          ) {
            return;
          }


          chapterElements.forEach(
            element => {

              element.classList.remove(
                "active"
              );

            }
          );


          entry.target.classList.add(
            "active"
          );


          activarCapitulo(
            entry.target.dataset.chapter
          );

        }
      );

    },

    {

      threshold:
        0.5

    }

  );


chapterElements.forEach(
  chapter => {

    chapterObserver.observe(
      chapter
    );

  }
);


/* ==========================================================
   INICIAR DATOS DEL MAPA
========================================================== */

map.on(

  "load",

  () => {

    cargarDatosCartograficos();

  }

);


/* ==========================================================
   GALERÍAS
========================================================== */

const galleries = {

  "juntanza-recorridos": [

    "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_01.jpg",

    "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_02.jpg",

    "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_03.png",

    "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_04.png",

    "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_05.jpg"

  ],


  frailejones: [

    "assets/images/04_juntanza_02_siembra_de_frailejones_01.jpg",

    "assets/images/04_juntanza_02_siembra_de_frailejones_02.jpg",

    "assets/images/04_juntanza_02_siembra_de_frailejones_03.jpg"

  ],


  nacimiento: [

    "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_01.jpg",

    "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_02.jpg",

    "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_03.jpg",

    "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_04.jpg",

    "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_05.jpg"

  ],


  "semillas-nativas": [

    "assets/images/04_juntanza_04_recuperacion_de_semillas_nativas_01.jpg",

    "assets/images/04_juntanza_04_recuperacion_de_semillas_nativas_02.jpg",

    "assets/images/04_juntanza_04_recuperacion_de_semillas_nativas_03.jpg"

  ],


  educacion: [

    "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_01.jpg",

    "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_02.jpg",

    "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_03.jpg",

    "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_05.jpg"

  ],


  "rana-cristal": [

    "assets/images/06_cuidadores_02_ranita_cristal_01.jpg",

    "assets/images/06_cuidadores_02_ranita_cristal_02.jpg"

  ],


  "aves-guanacas": [

    "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_01.jpg",

    "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_02.jpg",

    "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_03.jpg",

    "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_04.jpg",

    "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_05.jpg"

  ],


  anfibios: [

    "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_01.jpg",

    "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_02.jpg",

    "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_03.jpg",

    "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_04.jpg",

    "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_05.jpg"

  ]

};


/* ==========================================================
   CREAR GALERÍAS
========================================================== */

document
  .querySelectorAll(
    "[data-gallery]"
  )
  .forEach(
    galleryElement => {

      const galleryName =
        galleryElement.dataset.gallery;


      const images =
        galleries[galleryName];


      if (
        !images ||
        images.length === 0
      ) {
        return;
      }


      let currentIndex =
        0;


      images.forEach(
        (src, index) => {

          const img =
            document.createElement(
              "img"
            );


          img.src =
            src;


          img.alt =
            "";


          img.loading =
            "lazy";


          img.className =
            "gallery-image";


          if (
            index === 0
          ) {

            img.classList.add(
              "active"
            );

          }


          galleryElement.appendChild(
            img
          );

        }
      );


      const counter =
        document.createElement(
          "div"
        );


      counter.className =
        "gallery-counter";


      counter.textContent =
        `1 / ${images.length}`;


      galleryElement.appendChild(
        counter
      );


      const controls =
        document.createElement(
          "div"
        );


      controls.className =
        "gallery-controls";


      const previousButton =
        document.createElement(
          "button"
        );


      previousButton.className =
        "gallery-button";


      previousButton.innerHTML =
        "←";


      previousButton.setAttribute(
        "aria-label",
        "Imagen anterior"
      );


      const nextButton =
        document.createElement(
          "button"
        );


      nextButton.className =
        "gallery-button";


      nextButton.innerHTML =
        "→";


      nextButton.setAttribute(
        "aria-label",
        "Imagen siguiente"
      );


      controls.appendChild(
        previousButton
      );


      controls.appendChild(
        nextButton
      );


      galleryElement.appendChild(
        controls
      );


      function updateGallery() {

        const galleryImages =
          galleryElement.querySelectorAll(
            ".gallery-image"
          );


        galleryImages.forEach(
          (img, index) => {

            img.classList.toggle(

              "active",

              index ===
                currentIndex

            );

          }
        );


        counter.textContent =
          `${currentIndex + 1} / ${images.length}`;

      }


      previousButton.addEventListener(

        "click",

        () => {

          currentIndex--;


          if (
            currentIndex < 0
          ) {

            currentIndex =
              images.length - 1;

          }


          updateGallery();

        }

      );


      nextButton.addEventListener(

        "click",

        () => {

          currentIndex++;


          if (
            currentIndex >=
            images.length
          ) {

            currentIndex =
              0;

          }


          updateGallery();

        }

      );

    }
  );


/* ==========================================================
   GALERÍA AGRO
========================================================== */

const agroGallery =
  document.getElementById(
    "agro-gallery"
  );


const agroImages = [

  "assets/images/05_agroalimentarias_galeria_01_01.jpg",
  "assets/images/05_agroalimentarias_galeria_01_02.jpg",
  "assets/images/05_agroalimentarias_galeria_01_03.jpg",
  "assets/images/05_agroalimentarias_galeria_01_04.jpg",
  "assets/images/05_agroalimentarias_galeria_01_05.jpg",

  "assets/images/05_agroalimentarias_galeria_02_01.jpg",
  "assets/images/05_agroalimentarias_galeria_02_02.jpg",
  "assets/images/05_agroalimentarias_galeria_02_03.jpg",
  "assets/images/05_agroalimentarias_galeria_02_04.jpg",

  "assets/images/05_agroalimentarias_galeria_03_01.jpg",
  "assets/images/05_agroalimentarias_galeria_03_02.jpg",
  "assets/images/05_agroalimentarias_galeria_03_03.jpg",
  "assets/images/05_agroalimentarias_galeria_03_04.jpg",
  "assets/images/05_agroalimentarias_galeria_03_05.jpg",
  "assets/images/05_agroalimentarias_galeria_03_06.jpg",
  "assets/images/05_agroalimentarias_galeria_03_07.jpg",
  "assets/images/05_agroalimentarias_galeria_03_08.jpg",
  "assets/images/05_agroalimentarias_galeria_03_09.jpg",
  "assets/images/05_agroalimentarias_galeria_03_10.jpg",

  "assets/images/05_agroalimentarias_galeria_04_01.jpg",
  "assets/images/05_agroalimentarias_galeria_04_02.jpg",

  "assets/images/05_agroalimentarias_galeria_05_01.jpg",
  "assets/images/05_agroalimentarias_galeria_05_02.jpg",
  "assets/images/05_agroalimentarias_galeria_05_03.jpg",
  "assets/images/05_agroalimentarias_galeria_05_04.jpg",
  "assets/images/05_agroalimentarias_galeria_05_05.jpg",

  "assets/images/05_agroalimentarias_galeria_06_01.jpg",
  "assets/images/05_agroalimentarias_galeria_06_02.jpg",

  "assets/images/05_agroalimentarias_galeria_07_01.jpg",
  "assets/images/05_agroalimentarias_galeria_07_02.jpg",
  "assets/images/05_agroalimentarias_galeria_07_03.jpg",
  "assets/images/05_agroalimentarias_galeria_07_04.jpg"

];


if (
  agroGallery
) {

  agroImages.forEach(
    src => {

      const img =
        document.createElement(
          "img"
        );


      img.src =
        src;


      img.alt =
        "Práctica agroalimentaria campesina";


      img.loading =
        "lazy";


      agroGallery.appendChild(
        img
      );

    }
  );

}


/* ==========================================================
   NAVEGACIÓN
========================================================== */

const topNav =
  document.getElementById(
    "top-nav"
  );


const menuToggle =
  document.getElementById(
    "menu-toggle"
  );


const navLinks =
  document.getElementById(
    "nav-links"
  );


window.addEventListener(

  "scroll",

  () => {

    if (
      window.scrollY > 80
    ) {

      topNav.classList.add(
        "scrolled"
      );

    } else {

      topNav.classList.remove(
        "scrolled"
      );

    }

  }

);


menuToggle.addEventListener(

  "click",

  () => {

    const isOpen =
      navLinks.classList.toggle(
        "open"
      );


    menuToggle.setAttribute(

      "aria-expanded",

      isOpen

    );

  }

);


navLinks
  .querySelectorAll(
    "a"
  )
  .forEach(
    link => {

      link.addEventListener(

        "click",

        () => {

          navLinks.classList.remove(
            "open"
          );


          menuToggle.setAttribute(

            "aria-expanded",

            "false"

          );

        }

      );

    }
  );


/* ==========================================================
   ANIMACIONES
========================================================== */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


const revealObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );


            revealObserver.unobserve(
              entry.target
            );

          }

        }
      );

    },

    {

      threshold:
        0.15,

      rootMargin:
        "0px 0px -50px 0px"

    }

  );


revealElements.forEach(
  element => {

    revealObserver.observe(
      element
    );

  }
);


/* ==========================================================
   SELECTOR VIDEOS
========================================================== */

const biodiversityVideo =
  document.getElementById(
    "biodiversity-video"
  );


const biodiversityVideoSource =
  document.getElementById(
    "biodiversity-video-source"
  );


const videoButtons =
  document.querySelectorAll(
    ".video-select"
  );


videoButtons.forEach(
  button => {

    button.addEventListener(

      "click",

      () => {

        const videoPath =
          button.dataset.video;


        if (
          !videoPath ||
          !biodiversityVideo ||
          !biodiversityVideoSource
        ) {
          return;
        }


        biodiversityVideo.pause();


        biodiversityVideoSource.src =
          videoPath;


        biodiversityVideo.load();


        videoButtons.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );

      }

    );

  }
);