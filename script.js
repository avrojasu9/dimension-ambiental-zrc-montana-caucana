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
        attribution: "© OpenStreetMap contributors"
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

/*
=========================================
CAPÍTULOS
=========================================
Más adelante reemplazaremos estas vistas
por las ubicaciones exactas del StoryMap.
*/

const chapters = {
  ubicacion: {
    center: [-76.05, 2.55],
    zoom: 8.5,
    pitch: 0,
    bearing: 0
  },

  juntanza: {
    center: [-76.03, 2.54],
    zoom: 11,
    pitch: 0,
    bearing: 0
  },

  agroalimentarias: {
    center: [-76.08, 2.50],
    zoom: 11.5,
    pitch: 0,
    bearing: 0
  },

  cuidadores: {
    center: [-76.02, 2.58],
    zoom: 11,
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
