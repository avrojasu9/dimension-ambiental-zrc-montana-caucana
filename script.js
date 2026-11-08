/* ==========================================================
   RUTAS DE DATOS
========================================================== */

const DATA_PATHS = {
  zrc: "assets/data/zrc_mc.geojson",
  paramo: "assets/data/paramo_guanacas_purace_coconucos.geojson",
  puntos: "assets/data/puntos_storymap.geojson",
  municipios: "assets/data/limite_municipal_inza_totoro_silvia.geojson"
};


/* ==========================================================
   MAPA BASE SATELITAL
   EOxCloudless Sentinel-2 2024
========================================================== */

const map = new maplibregl.Map({
  container: "map",

  style: {
    version: 8,

    sources: {
      satellite: {
        type: "raster",

        tiles: [
          "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg"
        ],

        tileSize: 256,
        minzoom: 0,
        maxzoom: 16,

        attribution:
          "EOxCloudless — Contains modified Copernicus Sentinel data 2024"
      }
    },

    layers: [
      {
        id: "satellite",
        type: "raster",
        source: "satellite",

        paint: {
          "raster-opacity": 1,
          "raster-saturation": 0.08,
          "raster-contrast": 0.06
        }
      }
    ]
  },

  center: [-76.135, 2.515],
  zoom: 9.2,
  pitch: 0,
  bearing: 0
});


map.addControl(
  new maplibregl.NavigationControl(),
  "top-right"
);


/* ==========================================================
   ESTADO
========================================================== */

let cartografiaLista = false;
let currentChapter = null;
let scrollTicking = false;


/* ==========================================================
   VISTAS EXPLÍCITAS DE CADA CAPÍTULO
========================================================== */

const CHAPTER_VIEWS = {
  territorio: {
    center: [-76.135, 2.515],
    zoom: 9.15,
    duration: 1600
  },

  paramo: {
    center: [-76.205, 2.515],
    zoom: 11.15,
    duration: 1800
  },

  "juntanza-puntos": {
    center: [-76.13424, 2.51313],
    zoom: 10.65,
    duration: 1800
  },

  "cuidadores-puntos": {
    center: [-76.14271, 2.51052],
    zoom: 10.65,
    duration: 1800
  }
};


/* ==========================================================
   AGREGAR FUENTES Y CAPAS
========================================================== */

function agregarFuentesYCapas() {

  map.addSource("municipios", {
    type: "geojson",
    data: DATA_PATHS.municipios
  });

  map.addLayer({
    id: "municipios-fill",
    type: "fill",
    source: "municipios",

    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": 0.01
    }
  });

  map.addLayer({
    id: "municipios-line",
    type: "line",
    source: "municipios",

    paint: {
      "line-color": "#ffffff",
      "line-width": 2.3,
      "line-opacity": 0.95
    }
  });


  map.addSource("paramo", {
    type: "geojson",
    data: DATA_PATHS.paramo
  });

  map.addLayer({
    id: "paramo-fill",
    type: "fill",
    source: "paramo",

    layout: {
      visibility: "none"
    },

    paint: {
      "fill-color": "#72b5cc",
      "fill-opacity": 0.23
    }
  });

  map.addLayer({
    id: "paramo-line",
    type: "line",
    source: "paramo",

    layout: {
      visibility: "none"
    },

    paint: {
      "line-color": "#bcecff",
      "line-width": 2.6,
      "line-dasharray": [3, 2],
      "line-opacity": 0.96
    }
  });


  map.addSource("zrc", {
    type: "geojson",
    data: DATA_PATHS.zrc
  });

  map.addLayer({
    id: "zrc-fill",
    type: "fill",
    source: "zrc",

    paint: {
      "fill-color": [
        "match",
        ["get", "Zona"],

        "Alta", "#c94e4e",
        "Centro", "#279dcc",
        "Occidente", "#9cc238",
        "Turmina", "#a35ca0",
        "Turminá", "#a35ca0",
        "Baja", "#f19a35",
        "Media", "#f1d640",
        "Pedregal", "#e27ac2",
        "San Miguel", "#a8764d",
        "Quebrada de Topa", "#43b49d",
        "San Andres", "#7777dc",
        "San Andrés", "#7777dc",

        "#4d8b62"
      ],

      "fill-opacity": 0.42
    }
  });

  map.addLayer({
    id: "zrc-line",
    type: "line",
    source: "zrc",

    paint: {
      "line-color": "#ffffff",
      "line-width": 1.2,
      "line-opacity": 0.9
    }
  });


  map.addSource("puntos-storymap", {
    type: "geojson",
    data: DATA_PATHS.puntos
  });

  map.addLayer({
    id: "puntos-storymap-circle",
    type: "circle",
    source: "puntos-storymap",

    layout: {
      visibility: "none"
    },

    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 6,
        12, 9,
        16, 12
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

      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2.5,
      "circle-opacity": 1
    }
  });


  configurarPopups();
  configurarCursor();

  cartografiaLista = true;

  console.log("Capas cartográficas registradas en MapLibre.");

  sincronizarCapituloConScroll(true);
}


/* ==========================================================
   VISIBILIDAD DE GRUPOS
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


  if (!layers) {
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


function actualizarCheckbox(
  groupName,
  checked
) {

  const checkbox =
    document.querySelector(
      `[data-layer-group="${groupName}"]`
    );


  if (checkbox) {
    checkbox.checked = checked;
  }

}


/* ==========================================================
   CHECKBOXES MANUALES
========================================================== */

document
  .querySelectorAll(
    "[data-layer-group]"
  )
  .forEach(
    checkbox => {

      checkbox.addEventListener(
        "change",
        () => {

          if (!cartografiaLista) {
            return;
          }


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
      ["get", "section"],
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
      ["get", "section"],
      "Cuidadores de la montaña"
    ]
  );

}


/* ==========================================================
   CAMBIAR CÁMARA
========================================================== */

function moverCamara(
  chapterId
) {

  const view =
    CHAPTER_VIEWS[chapterId];


  if (!view) {
    return;
  }


  map.stop();


  map.easeTo({
    center: view.center,
    zoom: view.zoom,
    pitch: 0,
    bearing: 0,
    duration: view.duration,
    essential: true
  });

}


/* ==========================================================
   CAPÍTULO 01
========================================================== */

function mostrarTerritorio() {

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


  actualizarCheckbox(
    "municipios",
    true
  );

  actualizarCheckbox(
    "zrc",
    true
  );

  actualizarCheckbox(
    "paramo",
    false
  );

  actualizarCheckbox(
    "puntos",
    false
  );


  moverCamara(
    "territorio"
  );

}


/* ==========================================================
   CAPÍTULO 02
========================================================== */

function mostrarParamo() {

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


  actualizarCheckbox(
    "municipios",
    true
  );

  actualizarCheckbox(
    "zrc",
    true
  );

  actualizarCheckbox(
    "paramo",
    true
  );

  actualizarCheckbox(
    "puntos",
    false
  );


  moverCamara(
    "paramo"
  );

}


/* ==========================================================
   CAPÍTULO 03
========================================================== */

function mostrarJuntanza() {

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


  actualizarCheckbox(
    "municipios",
    false
  );

  actualizarCheckbox(
    "zrc",
    true
  );

  actualizarCheckbox(
    "paramo",
    true
  );

  actualizarCheckbox(
    "puntos",
    true
  );


  mostrarPuntosJuntanza();


  moverCamara(
    "juntanza-puntos"
  );

}


/* ==========================================================
   CAPÍTULO 04
========================================================== */

function mostrarCuidadores() {

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


  actualizarCheckbox(
    "municipios",
    false
  );

  actualizarCheckbox(
    "zrc",
    true
  );

  actualizarCheckbox(
    "paramo",
    true
  );

  actualizarCheckbox(
    "puntos",
    true
  );


  mostrarPuntosCuidadores();


  moverCamara(
    "cuidadores-puntos"
  );

}


/* ==========================================================
   ACTIVAR CAPÍTULO
========================================================== */

function activarCapitulo(
  chapterId,
  force = false
) {

  if (
    !cartografiaLista
  ) {
    return;
  }


  if (
    !force &&
    chapterId === currentChapter
  ) {
    return;
  }


  currentChapter =
    chapterId;


  console.log(
    "Capítulo activo:",
    chapterId
  );


  document
    .querySelectorAll(
      ".chapter"
    )
    .forEach(
      element => {

        element.classList.toggle(
          "active",
          element.dataset.chapter ===
            chapterId
        );

      }
    );


  switch (
    chapterId
  ) {

    case "territorio":

      mostrarTerritorio();

      break;


    case "paramo":

      mostrarParamo();

      break;


    case "juntanza-puntos":

      mostrarJuntanza();

      break;


    case "cuidadores-puntos":

      mostrarCuidadores();

      break;

  }

}


/* ==========================================================
   DETERMINAR CAPÍTULO VISIBLE
========================================================== */

function obtenerCapituloVisible() {

  const chapters =
    Array.from(
      document.querySelectorAll(
        ".chapter"
      )
    );


  if (
    chapters.length === 0
  ) {
    return null;
  }


  const viewportCenter =
    window.innerHeight * 0.5;


  let closestChapter =
    null;

  let closestDistance =
    Infinity;


  chapters.forEach(
    chapter => {

      const rect =
        chapter.getBoundingClientRect();


      const chapterCenter =
        rect.top +
        rect.height / 2;


      const distance =
        Math.abs(
          chapterCenter -
          viewportCenter
        );


      if (
        distance <
        closestDistance
      ) {

        closestDistance =
          distance;


        closestChapter =
          chapter;

      }

    }
  );


  return closestChapter;

}


/* ==========================================================
   SINCRONIZAR CON SCROLL
========================================================== */

function sincronizarCapituloConScroll(
  force = false
) {

  if (
    !cartografiaLista
  ) {
    return;
  }


  const mapSection =
    document.querySelector(
      ".story-map-section"
    );


  if (
    !mapSection
  ) {
    return;
  }


  const sectionRect =
    mapSection.getBoundingClientRect();


  if (
    sectionRect.bottom <= 0 ||
    sectionRect.top >= window.innerHeight
  ) {
    return;
  }


  const visibleChapter =
    obtenerCapituloVisible();


  if (
    !visibleChapter
  ) {
    return;
  }


  activarCapitulo(
    visibleChapter.dataset.chapter,
    force
  );

}


/* ==========================================================
   SCROLL
========================================================== */

window.addEventListener(
  "scroll",
  () => {

    if (
      scrollTicking
    ) {
      return;
    }


    scrollTicking =
      true;


    window.requestAnimationFrame(
      () => {

        sincronizarCapituloConScroll();

        scrollTicking =
          false;

      }
    );

  },
  {
    passive: true
  }
);


/* ==========================================================
   RESIZE
========================================================== */

window.addEventListener(
  "resize",
  () => {

    map.resize();

    sincronizarCapituloConScroll(
      true
    );

  }
);


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
                ${Number(area).toLocaleString(
                  "es-CO",
                  {
                    maximumFractionDigits: 2
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
        offset: 16
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
        offset: 8
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
   ERRORES DEL MAPA
========================================================== */

map.on(
  "error",
  event => {

    console.warn(
      "Aviso MapLibre:",
      event?.error?.message || event
    );

  }
);


/* ==========================================================
   INICIAR MAPA
========================================================== */

map.on(
  "load",
  () => {

    agregarFuentesYCapas();

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
              index === currentIndex
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

  },
  {
    passive: true
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
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
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
   SELECTOR DE VIDEOS
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