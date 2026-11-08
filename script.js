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
   MAPA BASE SATELITAL
   EOxCloudless Sentinel-2 2024
========================================================== */

const map = new maplibregl.Map({

  container:
    "map",

  style: {

    version:
      8,

    sources: {

      satellite: {

        type:
          "raster",

        tiles: [

          "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg"

        ],

        tileSize:
          256,

        minzoom:
          0,

        maxzoom:
          16,

        attribution:
          'EOxCloudless by EOX IT Services GmbH — Contains modified Copernicus Sentinel data 2024'

      }

    },

    layers: [

      {

        id:
          "satellite",

        type:
          "raster",

        source:
          "satellite",

        paint: {

          "raster-opacity":
            1,

          "raster-saturation":
            0.08,

          "raster-contrast":
            0.06

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
   DATOS
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
   FUENTES Y CAPAS
========================================================== */

function agregarFuentesYCapas() {

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
        0.01

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
        "#ffffff",

      "line-width":
        2.2,

      "line-opacity":
        0.9

    }

  });


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
        "#72b5cc",

      "fill-opacity":
        0.22

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
        "#bcecff",

      "line-width":
        2.5,

      "line-dasharray":
        [3, 2],

      "line-opacity":
        0.95

    }

  });


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

        ["get", "Zona"],

        "Alta",
        "#c94e4e",

        "Centro",
        "#279dcc",

        "Occidente",
        "#9cc238",

        "Turmina",
        "#a35ca0",

        "Baja",
        "#f19a35",

        "Media",
        "#f1d640",

        "Pedregal",
        "#e27ac2",

        "San Miguel",
        "#a8764d",

        "Quebrada de Topa",
        "#43b49d",

        "San Andres",
        "#7777dc",

        "#4d8b62"

      ],

      "fill-opacity":
        0.36

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
        "#ffffff",

      "line-width":
        1,

      "line-opacity":
        0.8

    }

  });


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
        6,

        12,
        9,

        16,
        12

      ],

      "circle-color": [

        "match",

        ["get", "section"],

        "Juntanza por el agua",
        "#1fa162",

        "Cuidadores de la montaña",
        "#e0a53c",

        "#ffffff"

      ],

      "circle-stroke-color":
        "#ffffff",

      "circle-stroke-width":
        2.5,

      "circle-opacity":
        1

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
    media
      .toLowerCase()
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
                <strong>Municipio:</strong>
                ${escapeHTML(municipio)}
              </p>
            `
            : ""
        }

        ${
          zona
            ? `
              <p>
                <strong>Zona:</strong>
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
                <strong>Área:</strong>
                ${Number(area).toLocaleString(
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


function configurarPopups() {

  map.on(

    "click",

    "puntos-storymap-circle",

    event => {

      const feature =
        event.features[0];


      new maplibregl.Popup({

        offset:
          16

      })

        .setLngLat(
          feature.geometry.coordinates
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

}


/* ==========================================================
   CURSOR
========================================================== */

function configurarCursor() {

  [

    "puntos-storymap-circle",
    "zrc-fill",
    "municipios-fill",
    "paramo-fill"

  ].forEach(
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
   FILTROS DE PUNTOS
========================================================== */

function mostrarPuntosJuntanza() {

  map.setFilter(

    "puntos-storymap-circle",

    [

      "==",

      ["get", "section"],

      "Juntanza por el agua"

    ]

  );

}


function mostrarPuntosCuidadores() {

  map.setFilter(

    "puntos-storymap-circle",

    [

      "==",

      ["get", "section"],

      "Cuidadores de la montaña"

    ]

  );

}


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
   CAPÍTULOS
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
          1500,

        maxZoom:
          11

      }

    );

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


    const data =
      filtrarGeoJSONPorSeccion(

        puntosData,

        "Juntanza por el agua"

      );


    map.fitBounds(

      obtenerBounds(data),

      {

        padding:
          90,

        duration:
          1500,

        maxZoom:
          13

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


    const data =
      filtrarGeoJSONPorSeccion(

        puntosData,

        "Cuidadores de la montaña"

      );


    map.fitBounds(

      obtenerBounds(data),

      {

        padding:
          90,

        duration:
          1500,

        maxZoom:
          13

      }

    );

  }

}


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
   CARGAR MAPA
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


  "agro-01": [

    "assets/images/05_agroalimentarias_galeria_01_01.jpg",
    "assets/images/05_agroalimentarias_galeria_01_02.jpg",
    "assets/images/05_agroalimentarias_galeria_01_03.jpg",
    "assets/images/05_agroalimentarias_galeria_01_04.jpg",
    "assets/images/05_agroalimentarias_galeria_01_05.jpg"

  ],


  "agro-02": [

    "assets/images/05_agroalimentarias_galeria_02_01.jpg",
    "assets/images/05_agroalimentarias_galeria_02_02.jpg",
    "assets/images/05_agroalimentarias_galeria_02_03.jpg",
    "assets/images/05_agroalimentarias_galeria_02_04.jpg"

  ],


  "agro-03": [

    "assets/images/05_agroalimentarias_galeria_03_01.jpg",
    "assets/images/05_agroalimentarias_galeria_03_02.jpg",
    "assets/images/05_agroalimentarias_galeria_03_03.jpg",
    "assets/images/05_agroalimentarias_galeria_03_04.jpg",
    "assets/images/05_agroalimentarias_galeria_03_05.jpg",
    "assets/images/05_agroalimentarias_galeria_03_06.jpg",
    "assets/images/05_agroalimentarias_galeria_03_07.jpg",
    "assets/images/05_agroalimentarias_galeria_03_08.jpg",
    "assets/images/05_agroalimentarias_galeria_03_09.jpg",
    "assets/images/05_agroalimentarias_galeria_03_10.jpg"

  ],


  "agro-04": [

    "assets/images/05_agroalimentarias_galeria_04_01.jpg",
    "assets/images/05_agroalimentarias_galeria_04_02.jpg"

  ],


  "agro-05": [

    "assets/images/05_agroalimentarias_galeria_05_01.jpg",
    "assets/images/05_agroalimentarias_galeria_05_02.jpg",
    "assets/images/05_agroalimentarias_galeria_05_03.jpg",
    "assets/images/05_agroalimentarias_galeria_05_04.jpg",
    "assets/images/05_agroalimentarias_galeria_05_05.jpg"

  ],


  "agro-06": [

    "assets/images/05_agroalimentarias_galeria_06_01.jpg",
    "assets/images/05_agroalimentarias_galeria_06_02.jpg"

  ],


  "agro-07": [

    "assets/images/05_agroalimentarias_galeria_07_01.jpg",
    "assets/images/05_agroalimentarias_galeria_07_02.jpg",
    "assets/images/05_agroalimentarias_galeria_07_03.jpg",
    "assets/images/05_agroalimentarias_galeria_07_04.jpg"

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
   VIDEOS
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