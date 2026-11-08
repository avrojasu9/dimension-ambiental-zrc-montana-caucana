/* ==========================================================
   DIMENSIÓN AMBIENTAL ZRC MONTAÑA CAUCANA
   GUIDED TOURS: JUNTANZA + CUIDADORES
   BASE SATELITAL: ESRI WORLD IMAGERY
========================================================== */

const RAW_BASE =
  "https://raw.githubusercontent.com/avrojasu9/dimension-ambiental-zrc-montana-caucana/main/";


const DATA_PATHS = {

  zrc:
    RAW_BASE +
    "assets/data/zrc_mc.geojson",

  paramo:
    RAW_BASE +
    "assets/data/paramo_guanacas_purace_coconucos.geojson",

  puntos:
    RAW_BASE +
    "assets/data/puntos_storymap.geojson",

  municipios:
    RAW_BASE +
    "assets/data/limite_municipal_inza_totoro_silvia.geojson"

};


/* ==========================================================
   ESTILO SATELITAL
   ESRI WORLD IMAGERY
========================================================== */

const SATELLITE_STYLE = {

  version: 8,

  sources: {

    satellite: {

      type:
        "raster",

      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      ],

      tileSize:
        256,

      minzoom:
        0,

      maxzoom:
        19,

      attribution:
        "Esri, Maxar, Earthstar Geographics, and the GIS User Community"

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
          0,

        "raster-contrast":
          0.04,

        "raster-brightness-min":
          0.02,

        "raster-brightness-max":
          0.98

      }

    }

  ]

};


/* ==========================================================
   DATOS
========================================================== */

let municipiosInza =
  null;


let zrcInza =
  null;


let paramoData =
  null;


let puntosData =
  null;


/* ==========================================================
   MEDIOS DE JUNTANZA Y CUIDADORES
========================================================== */

const TOUR_MEDIA = {

  juntanza: {

    1: [

      "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_01.jpg",

      "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_02.jpg",

      "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_03.png",

      "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_04.png",

      "assets/images/04_juntanza_01_recorridos_y_conscientizacion_en_territorios_estrategicos_05.jpg"

    ],


    2: [

      "assets/images/04_juntanza_02_siembra_de_frailejones_01.jpg",

      "assets/images/04_juntanza_02_siembra_de_frailejones_02.jpg",

      "assets/images/04_juntanza_02_siembra_de_frailejones_03.jpg"

    ],


    3: [

      "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_01.jpg",

      "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_02.jpg",

      "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_03.jpg",

      "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_04.jpg",

      "assets/images/04_juntanza_03_restauracion_nacimiento_de_agua_guanacas_05.jpg"

    ],


    4: [

      "assets/images/04_juntanza_04_recuperacion_de_semillas_nativas_01.jpg",

      "assets/images/04_juntanza_04_recuperacion_de_semillas_nativas_02.jpg",

      "assets/images/04_juntanza_04_recuperacion_de_semillas_nativas_03.jpg"

    ],


    5: [

      "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_01.jpg",

      "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_02.jpg",

      "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_03.jpg",

      "assets/videos/04_juntanza_05_educacion_ambiental_comunitaria_04.mp4",

      "assets/images/04_juntanza_05_educacion_ambiental_comunitaria_05.jpg"

    ]

  },


  cuidadores: {

    1: [

      "assets/videos/06_cuidadores_01_identificacion_del_oso_andino_danta_y_puma_concolor_01.mp4",

      "assets/videos/06_cuidadores_01_identificacion_del_oso_andino_danta_y_puma_concolor_02.mp4",

      "assets/videos/06_cuidadores_01_identificacion_del_oso_andino_danta_y_puma_concolor_03.mp4"

    ],


    2: [

      "assets/images/06_cuidadores_02_ranita_cristal_01.jpg",

      "assets/images/06_cuidadores_02_ranita_cristal_02.jpg"

    ],


    3: [

      "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_01.jpg",

      "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_02.jpg",

      "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_03.jpg",

      "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_04.jpg",

      "assets/images/06_cuidadores_03_identificacion_y_avistamiento_de_aves_en_guanacas_05.jpg"

    ],


    4: [

      "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_01.jpg",

      "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_02.jpg",

      "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_03.jpg",

      "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_04.jpg",

      "assets/images/06_cuidadores_04_identificacion_de_anfibios_y_reptiles_en_guanacas_05.jpg"

    ],


    5: [

      "assets/images/06_cuidadores_05_aguila_de_montana_01.jpg"

    ],


    6: [

      "assets/images/06_cuidadores_06_identificacion_de_aves_colectivo_turmas_turmina_01.jpg"

    ],


    7: [

      "assets/images/06_cuidadores_07_pollo_de_monte_sericossypha_albocristata_01.jpg"

    ],


    8: [

      "assets/images/06_cuidadores_08_rhinella_sp_01.jpg",

      "assets/images/06_cuidadores_08_rhinella_sp_02.jpg"

    ],


    9: [

      "assets/images/06_cuidadores_09_recorridos_para_identificacion_de_especies_01.jpg"

    ]

  }

};


/* ==========================================================
   GALERÍAS AGRO
========================================================== */

const AGRO_GALLERIES = {

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

  ]

};


/* ==========================================================
   NORMALIZAR TEXTO
========================================================== */

function normalizarTexto(
  value
) {

  return String(
    value ?? ""
  )

    .normalize(
      "NFD"
    )

    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .trim()

    .toUpperCase();

}


/* ==========================================================
   CARGAR GEOJSON
========================================================== */

async function cargarGeoJSON(
  url
) {

  const response =
    await fetch(

      url,

      {

        mode:
          "cors",

        cache:
          "no-store"

      }

    );


  if (
    !response.ok
  ) {

    throw new Error(
      `HTTP ${response.status}: ${url}`
    );

  }


  const data =
    await response.json();


  if (
    !data ||
    data.type !==
      "FeatureCollection" ||
    !Array.isArray(
      data.features
    )
  ) {

    throw new Error(
      `GeoJSON inválido: ${url}`
    );

  }


  return data;

}


/* ==========================================================
   FILTRAR INZÁ
========================================================== */

function filtrarMunicipioInza(
  data
) {

  return {

    type:
      "FeatureCollection",

    features:
      data.features.filter(
        feature =>
          normalizarTexto(
            feature.properties
              ?.NOM_MUNICI
          ) ===
          "INZA"
      )

  };

}


function filtrarZRCInza(
  data
) {

  return {

    type:
      "FeatureCollection",

    features:
      data.features.filter(
        feature =>
          normalizarTexto(
            feature.properties
              ?.NOMB_MPIO
          ) ===
          "INZA"
      )

  };

}


/* ==========================================================
   CREAR MAPA
========================================================== */

function crearMapa(
  containerId,
  center,
  zoom
) {

  const map =
    new maplibregl.Map({

      container:
        containerId,

      style:
        JSON.parse(
          JSON.stringify(
            SATELLITE_STYLE
          )
        ),

      center:
        center,

      zoom:
        zoom,

      pitch:
        0,

      bearing:
        0

    });


  map.addControl(

    new maplibregl.NavigationControl(),

    "top-right"

  );


  return map;

}


/* ==========================================================
   CAPAS DE CONTEXTO
========================================================== */

function addContextLayers(
  map
) {

  if (
    municipiosInza
  ) {

    map.addSource(
      "municipios",

      {

        type:
          "geojson",

        data:
          municipiosInza

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
          "#f4e66d",

        "line-width":
          2.2,

        "line-opacity":
          0.95

      }

    });

  }


  if (
    zrcInza
  ) {

    map.addSource(
      "zrc",

      {

        type:
          "geojson",

        data:
          zrcInza

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

        "fill-color":
          "#4f9465",

        "fill-opacity":
          0.22

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
          1.1,

        "line-opacity":
          0.8

      }

    });

  }

}


/* ==========================================================
   MAPA GENERAL
========================================================== */

function initTerritoryMap() {

  const map =
    crearMapa(

      "territory-map",

      [-76.075, 2.55],

      9.8

    );


  map.on(

    "load",

    () => {

      addContextLayers(
        map
      );


      if (
        paramoData
      ) {

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
              "#62c9df",

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
              "#a7ebfa",

            "line-width":
              2.2,

            "line-opacity":
              0.9

          }

        });

      }


      document
        .querySelectorAll(
          "[data-overview-layer]"
        )
        .forEach(
          checkbox => {

            checkbox.addEventListener(

              "change",

              () => {

                const group =
                  checkbox.dataset
                    .overviewLayer;


                const ids = {

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

                  ]

                }[
                  group
                ];


                (
                  ids ||
                  []
                )
                  .forEach(
                    id => {

                      if (
                        map.getLayer(
                          id
                        )
                      ) {

                        map
                          .setLayoutProperty(

                            id,

                            "visibility",

                            checkbox.checked
                              ? "visible"
                              : "none"

                          );

                      }

                    }
                  );

              }

            );

          }
        );

    }

  );

}


/* ==========================================================
   CREAR MEDIO
========================================================== */

function createMediaElement(
  path
) {

  const isVideo =
    path
      .toLowerCase()
      .endsWith(
        ".mp4"
      );


  if (
    isVideo
  ) {

    const video =
      document.createElement(
        "video"
      );


    video.controls =
      true;


    video.playsInline =
      true;


    video.preload =
      "metadata";


    const source =
      document.createElement(
        "source"
      );


    source.src =
      path;


    source.type =
      "video/mp4";


    video.appendChild(
      source
    );


    return video;

  }


  const img =
    document.createElement(
      "img"
    );


  img.src =
    path;


  img.alt =
    "";


  img.loading =
    "lazy";


  return img;

}


/* ==========================================================
   TARJETA DE RECORRIDO
========================================================== */

function createTourCard(
  feature,
  type
) {

  const order =
    Number(
      feature.properties
        .order
    );


  const media =
    TOUR_MEDIA[type][order] ||
    [
      feature.properties.media
    ];


  const article =
    document.createElement(
      "article"
    );


  article.className =
    "tour-card";


  article.dataset.order =
    String(
      order
    );


  const inner =
    document.createElement(
      "div"
    );


  inner.className =
    "tour-card-inner";


  const mediaWrap =
    document.createElement(
      "div"
    );


  mediaWrap.className =
    "tour-media";


  let currentIndex =
    0;


/* ==========================================================
   CAMBIAR FOTO/VIDEO
========================================================== */

  function renderMedia() {

    mediaWrap
      .querySelectorAll(
        "img, video"
      )
      .forEach(
        item =>
          item.remove()
      );


    const element =
      createMediaElement(

        media[
          currentIndex
        ]

      );


    mediaWrap.prepend(
      element
    );


    const counter =
      mediaWrap
        .querySelector(
          ".tour-counter"
        );


    if (
      counter
    ) {

      counter.textContent =
        `${currentIndex + 1} / ${media.length}`;

    }

  }


/* ==========================================================
   CONTROLES
========================================================== */

  if (
    media.length >
      1
  ) {

    const counter =
      document.createElement(
        "div"
      );


    counter.className =
      "tour-counter";


    const controls =
      document.createElement(
        "div"
      );


    controls.className =
      "tour-gallery-controls";


    const prev =
      document.createElement(
        "button"
      );


    prev.type =
      "button";


    prev.className =
      "tour-gallery-btn";


    prev.textContent =
      "←";


    const next =
      document.createElement(
        "button"
      );


    next.type =
      "button";


    next.className =
      "tour-gallery-btn";


    next.textContent =
      "→";


    prev.addEventListener(

      "click",

      () => {

        currentIndex =
          (
            currentIndex -
            1 +
            media.length
          ) %
          media.length;


        renderMedia();

      }

    );


    next.addEventListener(

      "click",

      () => {

        currentIndex =
          (
            currentIndex +
            1
          ) %
          media.length;


        renderMedia();

      }

    );


    controls.append(

      prev,

      next

    );


    mediaWrap.append(

      counter,

      controls

    );

  }


  renderMedia();


/* ==========================================================
   TEXTO
========================================================== */

  const content =
    document.createElement(
      "div"
    );


  content.className =
    "tour-content";


  const number =
    document.createElement(
      "span"
    );


  number.className =
    "tour-number";


  number.textContent =
    String(
      order
    )
      .padStart(
        2,
        "0"
      );


  const label =
    document.createElement(
      "span"
    );


  label.className =
    "tour-section-label";


  label.textContent =
    type ===
      "juntanza"

      ? "Juntanza por el agua"

      : "Cuidadores de la montaña";


  const title =
    document.createElement(
      "h3"
    );


  title.textContent =
    feature.properties
      .title;


  const description =
    document.createElement(
      "p"
    );


  description.textContent =
    feature.properties
      .description;


  content.append(

    number,

    label,

    title,

    description

  );


  inner.append(

    mediaWrap,

    content

  );


  article.append(
    inner
  );


  return article;

}


/* ==========================================================
   MARCADOR NUMERADO
========================================================== */

function createNumberMarker(
  order,
  type
) {

  const element =
    document.createElement(
      "div"
    );


  element.className =
    `tour-marker ${
      type ===
      "cuidadores"

        ? "cuidadores"

        : ""
    }`;


  element.textContent =
    String(
      order
    );


  return element;

}


/* ==========================================================
   INICIAR RECORRIDO
========================================================== */

function initGuidedTour({
  type,
  mapId,
  cardsId,
  sectionName,
  defaultCenter,
  defaultZoom
}) {

  const features =
    puntosData
      .features
      .filter(
        feature =>
          feature.properties
            .section ===
          sectionName
      )
      .sort(
        (
          a,
          b
        ) =>
          Number(
            a.properties.order
          ) -
          Number(
            b.properties.order
          )
      );


  const cardsContainer =
    document
      .getElementById(
        cardsId
      );


  features.forEach(
    feature => {

      cardsContainer
        .appendChild(

          createTourCard(
            feature,
            type
          )

        );

    }
  );


  const map =
    crearMapa(

      mapId,

      defaultCenter,

      defaultZoom

    );


  const markers =
    new Map();


/* ==========================================================
   MAPA CARGADO
========================================================== */

  map.on(

    "load",

    () => {

      addContextLayers(
        map
      );


      features.forEach(
        feature => {

          const order =
            Number(
              feature.properties
                .order
            );


          const markerElement =
            createNumberMarker(

              order,

              type

            );


          const marker =
            new maplibregl.Marker({

              element:
                markerElement,

              anchor:
                "center"

            })

              .setLngLat(
                feature.geometry
                  .coordinates
              )

              .addTo(
                map
              );


          markers.set(

            order,

            {

              marker,

              element:
                markerElement

            }

          );


          markerElement
            .addEventListener(

              "click",

              () => {

                const card =
                  cardsContainer
                    .querySelector(

                      `.tour-card[data-order="${order}"]`

                    );


                card
                  ?.scrollIntoView({

                    behavior:
                      "smooth",

                    block:
                      "center"

                  });

              }

            );

        }
      );


      activateTourStep(

        features[0],

        cardsContainer,

        map,

        markers

      );

    }

  );


/* ==========================================================
   OBSERVADOR DEL SCROLL
========================================================== */

  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            if (
              !entry
                .isIntersecting
            ) {

              return;

            }


            const order =
              Number(
                entry.target
                  .dataset
                  .order
              );


            const feature =
              features.find(
                item =>
                  Number(
                    item.properties
                      .order
                  ) ===
                  order
              );


            if (
              !feature
            ) {

              return;

            }


            activateTourStep(

              feature,

              cardsContainer,

              map,

              markers

            );

          }
        );

      },

      {

        root:
          null,

        threshold:
          0,

        rootMargin:
          "-43% 0px -43% 0px"

      }

    );


  cardsContainer
    .querySelectorAll(
      ".tour-card"
    )
    .forEach(
      card => {

        observer.observe(
          card
        );

      }
    );

}


/* ==========================================================
   ACTIVAR PUNTO
========================================================== */

function activateTourStep(
  feature,
  cardsContainer,
  map,
  markers
) {

  const order =
    Number(
      feature.properties
        .order
    );


  cardsContainer
    .querySelectorAll(
      ".tour-card"
    )
    .forEach(
      card => {

        card.classList.toggle(

          "active",

          Number(
            card.dataset
              .order
          ) ===
          order

        );

      }
    );


  markers.forEach(
    (
      value,
      key
    ) => {

      value.element
        .classList.toggle(

          "active",

          key ===
          order

        );

    }
  );


  const coordinates =
    feature.geometry
      .coordinates;


  map.stop();


  map.flyTo({

    center:
      coordinates,

    zoom:
      order ===
        1

        ? 12

        : 12.8,

    duration:
      1400,

    essential:
      true

  });

}


/* ==========================================================
   GALERÍAS AGRO
========================================================== */

function initAgroGalleries() {

  document
    .querySelectorAll(
      "[data-gallery]"
    )
    .forEach(
      galleryElement => {

        const name =
          galleryElement
            .dataset
            .gallery;


        const images =
          AGRO_GALLERIES[
            name
          ];


        if (
          !images ||
          images.length ===
            0
        ) {

          return;

        }


        let currentIndex =
          0;


        images.forEach(
          (
            src,
            index
          ) => {

            const img =
              document
                .createElement(
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
              index ===
                0
            ) {

              img.classList
                .add(
                  "active"
                );

            }


            galleryElement
              .appendChild(
                img
              );

          }
        );


        const counter =
          document
            .createElement(
              "div"
            );


        counter.className =
          "gallery-counter";


        const controls =
          document
            .createElement(
              "div"
            );


        controls.className =
          "gallery-controls";


        const prev =
          document
            .createElement(
              "button"
            );


        prev.type =
          "button";


        prev.className =
          "gallery-button";


        prev.textContent =
          "←";


        const next =
          document
            .createElement(
              "button"
            );


        next.type =
          "button";


        next.className =
          "gallery-button";


        next.textContent =
          "→";


        function update() {

          galleryElement
            .querySelectorAll(
              ".gallery-image"
            )
            .forEach(
              (
                img,
                index
              ) => {

                img.classList
                  .toggle(

                    "active",

                    index ===
                    currentIndex

                  );

              }
            );


          counter.textContent =
            `${currentIndex + 1} / ${images.length}`;

        }


        prev.addEventListener(

          "click",

          () => {

            currentIndex =
              (
                currentIndex -
                1 +
                images.length
              ) %
              images.length;


            update();

          }

        );


        next.addEventListener(

          "click",

          () => {

            currentIndex =
              (
                currentIndex +
                1
              ) %
              images.length;


            update();

          }

        );


        controls.append(

          prev,

          next

        );


        galleryElement.append(

          counter,

          controls

        );


        update();

      }
    );

}


/* ==========================================================
   INICIAR TODO
========================================================== */

async function init() {

  try {

    const [
      municipiosOriginal,
      zrcOriginal,
      loadedParamo,
      loadedPuntos
    ] =
      await Promise.all(
        [

          cargarGeoJSON(
            DATA_PATHS
              .municipios
          ),

          cargarGeoJSON(
            DATA_PATHS
              .zrc
          ),

          cargarGeoJSON(
            DATA_PATHS
              .paramo
          ),

          cargarGeoJSON(
            DATA_PATHS
              .puntos
          )

        ]
      );


    municipiosInza =
      filtrarMunicipioInza(
        municipiosOriginal
      );


    zrcInza =
      filtrarZRCInza(
        zrcOriginal
      );


    paramoData =
      loadedParamo;


    puntosData =
      loadedPuntos;


    initTerritoryMap();


    initGuidedTour({

      type:
        "juntanza",

      mapId:
        "juntanza-map",

      cardsId:
        "juntanza-cards",

      sectionName:
        "Juntanza por el agua",

      defaultCenter:
        [-76.13, 2.515],

      defaultZoom:
        10.5

    });


    initGuidedTour({

      type:
        "cuidadores",

      mapId:
        "cuidadores-map",

      cardsId:
        "cuidadores-cards",

      sectionName:
        "Cuidadores de la montaña",

      defaultCenter:
        [-76.12, 2.515],

      defaultZoom:
        10.3

    });


    initAgroGalleries();

  } catch (
    error
  ) {

    console.error(

      "Error inicializando la experiencia:",

      error

    );

  }

}


/* ==========================================================
   NAVEGACIÓN
========================================================== */

const topNav =
  document
    .getElementById(
      "top-nav"
    );


const menuToggle =
  document
    .getElementById(
      "menu-toggle"
    );


const navLinks =
  document
    .getElementById(
      "nav-links"
    );


window.addEventListener(

  "scroll",

  () => {

    if (
      topNav
    ) {

      topNav.classList
        .toggle(

          "scrolled",

          window.scrollY >
            80

        );

    }

  },

  {
    passive:
      true
  }

);


if (
  menuToggle &&
  navLinks
) {

  menuToggle
    .addEventListener(

      "click",

      () => {

        const isOpen =
          navLinks.classList
            .toggle(
              "open"
            );


        menuToggle
          .setAttribute(

            "aria-expanded",

            String(
              isOpen
            )

          );

      }

    );


  navLinks
    .querySelectorAll(
      "a"
    )
    .forEach(
      link => {

        link
          .addEventListener(

            "click",

            () => {

              navLinks
                .classList
                .remove(
                  "open"
                );


              menuToggle
                .setAttribute(

                  "aria-expanded",

                  "false"

                );

            }

          );

      }
    );

}


/* ==========================================================
   ANIMACIONES
========================================================== */

const revealObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            !entry
              .isIntersecting
          ) {

            return;

          }


          entry.target
            .classList
            .add(
              "visible"
            );


          revealObserver
            .unobserve(
              entry.target
            );

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


document
  .querySelectorAll(
    ".reveal"
  )
  .forEach(
    element => {

      revealObserver
        .observe(
          element
        );

    }
  );


/* ==========================================================
   EJECUTAR
========================================================== */

init();