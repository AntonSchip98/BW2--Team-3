import {
  selezioneElementiClone,
  generaClone,
  controlloBranoAlbum,
  artisti,
  convertiSecondiConScritte,
  convertiSecondiConPuntini,
  convertiSecondi,
  getCall,
} from "./functions.js";

// AD OGNI RELOAD LA FETCH VIENE ESEGUITA CON UNA PAROLA CASUALE SCELTA DA QUESTO ARRAY
let singer = ["geolier", "annalisa", "angelina", "salmo", "gue"];
let singerCasuale = singer[Math.floor(Math.random() * singer.length)];

let targetHome = document.querySelector("#target-mid-col");

getCall(singerCasuale).then((brani) => {
  let primoBrano = brani.data[0];

  let home = generaClone("#template-mid-cols");

  // CICLO FOR PER LE 6 CARD NELLA SEZIONE BUONASERA
  cicloBuonasera();
  function cicloBuonasera() {
    for (let i = 1; i < 7 && i < brani.data.length; i++) {
      const brano = brani.data[i];

      let colBrano = generaClone("#template-buonasera");

      let { imgCard, titleCard } = selezioneElementiClone(colBrano);

      if (brano.title == brano.album.title) {
        imgCard.src = brano.artist.picture_medium;
      } else {
        imgCard.src = brano.album.cover_medium;
      }
      titleCard.innerHTML = brano.title;

      let target = home.querySelector("#targetBuonasera");
      target.append(colBrano);
    }
  }

  // CICLO FOR PER LE 5 CARD NELLA SEZIONE ALTRO DI CIO CHE TI PIACE
  cicloAltroDiCioCheTiPiace();
  function cicloAltroDiCioCheTiPiace() {
    for (let i = 1; i < 6 && i < brani.data.length; i++) {
      const brano = brani.data[i];

      let colBrano = generaClone("#template-CioCheTiPiace");

      let { imgCard, titleCard } = selezioneElementiClone(colBrano);

      let artistCard = colBrano.querySelector("#artistCard");

      if (brano.title == brano.album.title) {
        imgCard.src = brano.artist.picture_medium;
      } else {
        imgCard.src = brano.album.cover_medium;
      }

      titleCard.innerHTML = brano.title;

      artistCard.innerHTML = artisti(brano.title, brano.artist.name);
      let cardBrano = colBrano.querySelector(".cardBrano");

      cardBrano.addEventListener("click", function () {
        if (brano.title == brano.album.title) {
          targetHome.innerHTML = "";
          let artistPage = generaClone("#template-artistPage");
          // QUI VANNO INSERITI I DATI PER POPOLARE LA PAGINA
          targetHome.append(artistPage);
        } else {
          targetHome.innerHTML = "";
          let albumPage = generaClone("#template-albumPage");
          // QUI VANNO INSERITI I DATI PER POPOLARE LA PAGINA
          targetHome.append(albumPage);
        }
      });
      console.log(brano.artist.name);
      let target = home.querySelector("#targetCioCheTiPiace");
      target.append(colBrano);
    }
  }

  // CICLO FOREACH PER LO SHOWMORE DI TUTTE LE CARD NELLA SEZIONE ALTRO DI CIO CHE TI PIACE
  let isClicked = false;
  let ShowMoreP = home.querySelector("#ShowMoreP");
  ShowMoreP.addEventListener("click", showMore);
  function showMore() {
    if (!isClicked) {
      targetCioCheTiPiace.innerHTML = "";
      ShowMoreP.innerHTML = "Riduci";
      brani.data.shift();
      brani.data.forEach((brano) => {
        let colBrano = generaClone("#template-CioCheTiPiace");

        let { imgCard, titleCard } = selezioneElementiClone(colBrano);

        let artistCard = colBrano.querySelector("#artistCard");

        if (brano.title == brano.album.title) {
          imgCard.src = brano.artist.picture_medium;
        } else {
          imgCard.src = brano.album.cover_medium;
        }

        titleCard.innerHTML = brano.title;

        artistCard.innerHTML = artisti(brano.title, brano.artist.name);

        let cardBrano = colBrano.querySelector(".cardBrano");
        cardBrano.addEventListener("click", function () {
          if (brano.title == brano.album.title) {
            targetHome.innerHTML = "";
            let artistPage = generaClone("#template-artistPage");
            // QUI VANNO INSERITI I DATI PER POPOLARE LA PAGINA
            targetHome.append(artistPage);
          } else {
            targetHome.innerHTML = "";
            let albumPage = generaClone("#template-albumPage");
            // QUI VANNO INSERITI I DATI PER POPOLARE LA PAGINA
            targetHome.append(albumPage);
          }
        });
        console.log(brano.artist.name);
        let target = document.querySelector("#targetCioCheTiPiace");
        target.append(colBrano);
      });
    } else {
      targetCioCheTiPiace.innerHTML = "";
      ShowMoreP.innerHTML = "Visualizza Tutto";
      for (let i = 0; i < 5 && i < brani.data.length; i++) {
        const brano = brani.data[i];

        let colBrano = generaClone("#template-CioCheTiPiace");

        let { imgCard, titleCard } = selezioneElementiClone(colBrano);

        let artistCard = colBrano.querySelector("#artistCard");

        if (brano.title == brano.album.title) {
          imgCard.src = brano.artist.picture_medium;
        } else {
          imgCard.src = brano.album.cover_medium;
        }

        titleCard.innerHTML = brano.title;

        artistCard.innerHTML = artisti(brano.title, brano.artist.name);

        let target = document.querySelector("#targetCioCheTiPiace");
        target.append(colBrano);
      }
    }

    isClicked = !isClicked;
  }

  // INIZIO PRIMO LABUM
  let type = home.querySelector("#type");
  type.innerHTML = controlloBranoAlbum(
    primoBrano.title,
    primoBrano.album.title
  );
  let title = home.querySelector(".album-title");
  title.innerHTML = primoBrano.title;

  let img = home.querySelector("#copertina");
  if (primoBrano.title == primoBrano.album.title) {
    img.src = primoBrano.artist.picture_medium;
  } else {
    img.src = primoBrano.album.cover_medium;
  }

  let artistP = home.querySelector("#artist");
  artistP.innerHTML = artisti(primoBrano.title, primoBrano.artist.name);

  let claimP = home.querySelector("#claim");
  claimP.innerHTML =
    "Ascolta il nuovo " +
    controlloBranoAlbum(primoBrano.title, primoBrano.album.title) +
    " di " +
    artisti(primoBrano.title, primoBrano.artist.name);

  // FINE CARD

  // INIZIO PARTE SINISTRA
  let targetBrani = document.querySelector("#left-col");
  brani.data.forEach((brano) => {
    let a = document.createElement("a");
    a.innerHTML = brano.title;
    a.href = "#"; //album.html
    targetBrani.append(a);
  });

  // INIZIAMO LA PARTE DEL PLAYER
  let playerImg = document.querySelector("#playerImg");

  if (primoBrano.title == primoBrano.album.title) {
    playerImg.src = primoBrano.artist.picture_small;
  } else {
    playerImg.src = primoBrano.album.cover_small;
  }

  let playerTitle = document.querySelector("#playerTitle");
  playerTitle.innerHTML = primoBrano.title;

  targetHome.append(home);
});

// INIZIO SCRIPT INPUT
let cerca = document.querySelector("#cerca");
let inputCerca = document.querySelector("#inputCerca");

cerca.addEventListener("click", function () {
  inputCerca.classList.toggle("displayNone");
});

inputCerca.addEventListener("input", callSearch);

async function callSearch() {
  let valoreRicerca = inputCerca.value;

  if (valoreRicerca) {
    getCall(valoreRicerca).then((brani) => {
      // CONTENUTO GENERATO CON LA RICERCA
      targetHome.innerHTML = "";
      let h3 = document.createElement("h3");
      h3.innerHTML = "Risultati più rilevanti";
      h3.classList.add("mt-3", "ms-4", "fw-bold");
      targetHome.append(h3);

      brani.data.forEach((brano) => {
        let colScegliBrano = generaClone("#template-CioCheTiPiace");
        let { imgCard, titleCard } = selezioneElementiClone(colScegliBrano);

        let artistCard = colScegliBrano.querySelector("#artistCard");
        let titleDuration = colScegliBrano.querySelector(".titleDuration");
        let cardBrano = colScegliBrano.querySelector(".cardBrano");

        if (brano.title == brano.album.title) {
          imgCard.src = brano.artist.picture_medium;
        } else {
          imgCard.src = brano.album.cover_medium;
        }

        titleCard.innerHTML = brano.title_short;

        artistCard.innerHTML = artisti(brano.title, brano.artist.name);

        // AGGIUNGO L'ADD EVENT LISTENER SULLA CARD
        cardBrano.addEventListener("click", function () {
          if (brano.title == brano.album.title) {
            targetHome.innerHTML = "";
            let artistPage = generaClone("#template-artistPage");
            // QUI VANNO INSERITI I DATI PER POPOLARE LA PAGINA
            targetHome.append(artistPage);
          } else {
            targetHome.innerHTML = "";
            let albumPage = generaClone("#template-albumPage");
            // QUI VANNO INSERITI I DATI PER POPOLARE LA PAGINA
            targetHome.append(albumPage);
          }
        });
        titleDuration.classList.remove("d-none");
        titleDuration.innerHTML = convertiSecondiConPuntini(brano.duration);
        targetHome.classList.add(
          "row",
          "d-flex",
          "justify-content-evenly",
          "container"
        );
        targetHome.append(colScegliBrano);
      });
    });
  } else {
    setTimeout(() => {
      targetHome.innerHTML = "";
      targetHome.classList.remove(
        "row",
        "d-flex",
        "justify-content-evenly",
        "container"
      );
      getCall(singerCasuale).then((brani) => {
        let primoBrano = brani.data[0];

        let home = generaClone("#template-mid-cols");

        // CICLO FOR PER LE 6 CARD NELLA SEZIONE BUONASERA

        for (let i = 1; i < 7 && i < brani.data.length; i++) {
          const brano = brani.data[i];

          let colBrano = generaClone("#template-buonasera");

          let { imgCard, titleCard } = selezioneElementiClone(colBrano);

          if (brano.title == brano.album.title) {
            imgCard.src = brano.artist.picture_medium;
          } else {
            imgCard.src = brano.album.cover_medium;
          }
          titleCard.innerHTML = brano.title;

          let target = home.querySelector("#targetBuonasera");
          target.append(colBrano);
        }

        // CICLO FOR PER LE 5 CARD NELLA SEZIONE ALTRO DI CIO CHE TI PIACE

        for (let i = 1; i < 6 && i < brani.data.length; i++) {
          const brano = brani.data[i];

          let colBrano = generaClone("#template-CioCheTiPiace");

          let { imgCard, titleCard } = selezioneElementiClone(colBrano);

          let artistCard = colBrano.querySelector("#artistCard");

          if (brano.title == brano.album.title) {
            imgCard.src = brano.artist.picture_medium;
          } else {
            imgCard.src = brano.album.cover_medium;
          }

          titleCard.innerHTML = brano.title;

          artistCard.innerHTML = artisti(brano.title, brano.artist.name);

          console.log(brano.artist.name);
          let target = home.querySelector("#targetCioCheTiPiace");
          target.append(colBrano);
        }

        // CICLO FOREACH PER LO SHOWMORE DI TUTTE LE CARD NELLA SEZIONE ALTRO DI CIO CHE TI PIACE
        let isClicked = false;
        let ShowMoreP = home.querySelector("#ShowMoreP");
        ShowMoreP.addEventListener("click", showMore);
        function showMore() {
          if (!isClicked) {
            targetCioCheTiPiace.innerHTML = "";
            ShowMoreP.innerHTML = "Riduci";
            brani.data.shift();
            brani.data.forEach((brano) => {
              let colBrano = generaClone("#template-CioCheTiPiace");

              let { imgCard, titleCard } = selezioneElementiClone(colBrano);

              let artistCard = colBrano.querySelector("#artistCard");

              if (brano.title == brano.album.title) {
                imgCard.src = brano.artist.picture_medium;
              } else {
                imgCard.src = brano.album.cover_medium;
              }

              titleCard.innerHTML = brano.title;

              artistCard.innerHTML = artisti(brano.title, brano.artist.name);

              console.log(brano.artist.name);
              let target = document.querySelector("#targetCioCheTiPiace");
              target.append(colBrano);
            });
          } else {
            targetCioCheTiPiace.innerHTML = "";
            ShowMoreP.innerHTML = "Visualizza Tutto";
            for (let i = 0; i < 5 && i < brani.data.length; i++) {
              const brano = brani.data[i];

              let colBrano = generaClone("#template-CioCheTiPiace");

              let { imgCard, titleCard } = selezioneElementiClone(colBrano);

              let artistCard = colBrano.querySelector("#artistCard");

              if (brano.title == brano.album.title) {
                imgCard.src = brano.artist.picture_medium;
              } else {
                imgCard.src = brano.album.cover_medium;
              }

              titleCard.innerHTML = brano.title;

              artistCard.innerHTML = artisti(brano.title, brano.artist.name);

              console.log(brano.artist.name);
              let target = document.querySelector("#targetCioCheTiPiace");
              target.append(colBrano);
            }
          }

          isClicked = !isClicked;
        }

        let type = home.querySelector("#type");
        type.innerHTML = controlloBranoAlbum(
          primoBrano.title,
          primoBrano.album.title
        );
        let title = home.querySelector(".album-title");
        title.innerHTML = primoBrano.title;

        let img = home.querySelector("#copertina");
        if (primoBrano.title == primoBrano.album.title) {
          img.src = primoBrano.artist.picture_medium;
        } else {
          img.src = primoBrano.album.cover_medium;
        }

        let artistP = home.querySelector("#artist");
        artistP.innerHTML = artisti(primoBrano.title, primoBrano.artist.name);

        let claimP = home.querySelector("#claim");
        claimP.innerHTML =
          "Ascolta il nuovo " +
          controlloBranoAlbum(primoBrano.title, primoBrano.album.title) +
          " di " +
          artisti(primoBrano.title, primoBrano.artist.name);

        // FINE CARD

        // INIZIO PARTE SINISTRA
        let targetBrani = document.querySelector("#left-col");
        brani.data.forEach((brano) => {
          let a = document.createElement("a");
          a.innerHTML = brano.title;
          a.href = "#"; //album.html
          targetBrani.append(a);
        });

        // INIZIAMO LA PARTE DEL PLAYER
        let playerImg = document.querySelector("#playerImg");

        if (primoBrano.title == primoBrano.album.title) {
          playerImg.src = primoBrano.artist.picture_small;
        } else {
          playerImg.src = primoBrano.album.cover_small;
        }

        let playerTitle = document.querySelector("#playerTitle");
        playerTitle.innerHTML = primoBrano.title;

        targetHome.append(home);
      });
    }, 250);
  }
}

// PAGINA ALBUM ELEMENTI DA INSERIRE

// let url = new URLSearchParams(location.search);
// let id = url.get("id");
// fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${id}`)
// callAlbum();
// async function callAlbum() {
//   const response = await fetch(
//     "https://striveschool-api.herokuapp.com/api/deezer/album/75621062"
//   );
//   const album = await response.json();
//   console.log(album);
//   didascaliaAlbum();
//   function didascaliaAlbum() {
//     let artista = document.querySelector("#artista");
//     let anno = document.querySelector("#anno");
//     let brani = document.querySelector("#brani");
//     let durata = document.querySelector("#durata");

//     artista.innerHTML = album.artist.name + "⋅";
//     anno.innerHTML = album.release_date.slice(0, 4) + "⋅";
//     durata.innerHTML = convertiSecondiConScritte(album.duration) + ".";

//     if (album.nb_tracks == 1) {
//       brani.innerHTML = album.nb_tracks + " brano,";
//     } else {
//       brani.innerHTML = album.nb_tracks + " brani,";
//     }
//   }

//   album.tracks.data.forEach((track) => {
//     // prendere gli eleneti dell html per popolarli
//     // popolarli con questi elementi
//     console.log(track.title_short);
//     console.log(track.artist.name);
//     console.log(track.rank);
//     console.log(convertiSecondiConPuntini(track.duration));
//   });
//   // console.log(album.title);
//   // console.log(album.cover_big);
//   // console.log(album.record_type);
//   // console.log(album.release_date);
//   // console.log(album.duration);
//   // console.log(album.nb_tracks);
//   // console.log(album.artist.name);
//   // console.log(album.artist.picture_small);
// }
