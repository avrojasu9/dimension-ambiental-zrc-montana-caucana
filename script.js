/* ==========================================================
   MAPA
========================================================== */

const map = new maplibregl.Map({
  container: "map",

  style: {
    version: 8,

    sources: {
      osm: {
        type: "raster",

        tiles: [
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],

        tileSize: 256,

        attribution:
          "© OpenStreetMap contributors"
      }
    },

    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm"
      }
    ]
  },

  center: [-76.05, 2.55],

  zoom: 8.5,

  pitch: 0,

  bearing: 0
});


map.addControl(
  new maplibregl.NavigationControl(),
  "top-right"
);


/* ==========================================================
   CAPÍTULOS DEL MAPA
========================================================== */

const chapters = {

  territorio: {
    center: [-76.05, 2.55],
    zoom: 8.5,
    pitch: 0,
    bearing: 0
  },

  guanacas: {
    center: [-76.02, 2.48],
    zoom: 12,
    pitch: 0,
    bearing: 0
  },

  inzá: {
    center: [-76.06, 2.55],
    zoom: 10.5,
    pitch: 0,
    bearing: 0
  }
};


const chapterElements =
  document.querySelectorAll(".chapter");


const observer = new IntersectionObserver(

  (entries) => {

    entries.forEach((entry) => {

      if (!entry.isIntersecting) {
        return;
      }


      const chapterId =
        entry.target.dataset.chapter;


      const chapter =
        chapters[chapterId];


      if (!chapter) {
        return;
      }


      map.flyTo({
        center: chapter.center,
        zoom: chapter.zoom,
        pitch: chapter.pitch,
        bearing: chapter.bearing,
        duration: 1800,
        essential: true
      });

    });

  },

  {
    threshold: 0.55
  }

);


chapterElements.forEach((chapter) => {
  observer.observe(chapter);
});


/* ==========================================================
   DATOS DE GALERÍAS
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
  .querySelectorAll("[data-gallery]")
  .forEach((galleryElement) => {

    const galleryName =
      galleryElement.dataset.gallery;


    const images =
      galleries[galleryName];


    if (!images || images.length === 0) {
      return;
    }


    let currentIndex = 0;


    images.forEach((src, index) => {

      const img =
        document.createElement("img");


      img.src = src;

      img.alt = "";

      img.loading = "lazy";

      img.className =
        "gallery-image";


      if (index === 0) {
        img.classList.add("active");
      }


      galleryElement.appendChild(img);

    });


    const counter =
      document.createElement("div");


    counter.className =
      "gallery-counter";


    counter.textContent =
      `1 / ${images.length}`;


    galleryElement.appendChild(counter);


    const controls =
      document.createElement("div");


    controls.className =
      "gallery-controls";


    const previousButton =
      document.createElement("button");


    previousButton.className =
      "gallery-button";


    previousButton.innerHTML =
      "←";


    previousButton.setAttribute(
      "aria-label",
      "Imagen anterior"
    );


    const nextButton =
      document.createElement("button");


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


    const updateGallery = () => {

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

    };


    previousButton.addEventListener(
      "click",
      () => {

        currentIndex--;

        if (currentIndex < 0) {
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
          currentIndex = 0;
        }

        updateGallery();

      }
    );

  });


/* ==========================================================
   GALERÍA AGROALIMENTARIA
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


if (agroGallery) {

  agroImages.forEach((src) => {

    const img =
      document.createElement("img");


    img.src = src;

    img.alt =
      "Práctica agroalimentaria campesina";

    img.loading =
      "lazy";


    agroGallery.appendChild(img);

  });

}