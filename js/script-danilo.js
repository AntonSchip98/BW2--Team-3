import {
  selezioneElementiClone,
  generaClone,
  controlloBranoAlbum,
  artisti,
  convertiSecondiConScritte,
  convertiSecondiConPuntini,
  convertiSecondi,
  getCall,
  getCallArtistAlbum,
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

      // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT
      let cardBrano = colBrano.querySelector(".cardBrano");

      cardBrano.addEventListener("click", function () {
        if (brano.title == brano.album.title) {
          // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
          let id = brano.artist.id;
          getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
            targetHome.innerHTML = "";
            let artistPage = generaClone("#template-artistPage");
            let artistName = artistPage.querySelector("#artistName");
            let fanNumber = artistPage.querySelector("#fanNumber");
            let targetBranoPopolare = artistPage.querySelector(
              "#target-branoPopolare"
            );

            artistName.innerHTML = artista.name;
            fanNumber.innerHTML = artista.nb_fan + " fan";

            fetch(
              `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
            )
              .then((response) => response.json())
              .then((tracks) => {
                tracks.data.forEach((track, indice) => {
                  // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let branoPopolare = generaClone("#template-branoPopolare");
                  // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let indiceDiv = branoPopolare.querySelector(".indice");
                  let titleTrack = branoPopolare.querySelector(".titleTrack");
                  let rankTrack = branoPopolare.querySelector(".rankTrack");
                  let trackDuration =
                    branoPopolare.querySelector(".tarckDuration");
                  let trackImgBranoPopolare = branoPopolare.querySelector(
                    ".trackImgBranoPopolare"
                  );

                  // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  indiceDiv.innerHTML = indice + 1;
                  titleTrack.innerHTML = track.title_short;
                  rankTrack.innerHTML = track.rank;
                  trackDuration.innerHTML = convertiSecondiConPuntini(
                    track.duration
                  );
                  trackImgBranoPopolare.src =
                    track.contributors[0].picture_small;
                  // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                  targetBranoPopolare.append(branoPopolare);
                });
              });
            targetHome.append(artistPage);
          });
        } else {
          // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
          getCallArtistAlbum("album", brano.album.id).then((album) => {
            console.log(album);
            targetHome.innerHTML = "";
            // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
            let albumPage = generaClone("#template-albumPage");
            // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
            let titleAlbum = albumPage.querySelector(".titleAlbum");
            let didascaliaAlbumP = albumPage.querySelector(".didascaliaAlbum");
            let albumImg = albumPage.querySelector(".albumImg");
            let artistImgAlbumPage = albumPage.querySelector(
              ".artistImgAlbumPage"
            );
            // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
            titleAlbum.innerHTML = album.title;
            albumImg.src = album.cover_medium;
            artistImgAlbumPage.src = album.contributors[0].picture_small;
            didascaliaAlbum();
            function didascaliaAlbum() {
              didascaliaAlbumP.innerHTML =
                album.contributors[0].name +
                " ⋅ " +
                album.release_date.slice(0, 4) +
                " ⋅ " +
                album.nb_tracks +
                " brani, " +
                convertiSecondiConScritte(album.duration) +
                ".";
            }
            // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
            targetHome.append(albumPage);

            let targetAlbumPageBrano = document.querySelector(
              "#target-templateBranoAlbum"
            );
            album.tracks.data.forEach((track, indice) => {
              // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
              // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
              let albumPageBrano = generaClone("#template-BranoAlbum");

              // SELEZIONO GLI ELMENTI DEL CLONE
              let titleAlbumTrack =
                albumPageBrano.querySelector(".titleAlbumTrack");
              console.log(titleAlbumTrack);
              let nameArtistAlbumTrack = albumPageBrano.querySelector(
                ".nameArtistAlbumTrack"
              );
              let rankAlbumTrack =
                albumPageBrano.querySelector(".rankAlbumTrack");
              let durationAlbumTrack = albumPageBrano.querySelector(
                ".durationAlbumTrack"
              );
              let indiceDiv = albumPageBrano.querySelector(".indice");
              // MODIFICO GLI ELMENTI DEL CLONE
              indiceDiv.innerHTML = indice + 1;
              titleAlbumTrack.innerHTML = track.title_short;
              nameArtistAlbumTrack.innerHTML = track.artist.name;
              rankAlbumTrack.innerHTML = track.rank;
              durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
                track.duration
              );

              // FACCIO L'APPEND DEL ELMENTI DEL CLONE
              targetAlbumPageBrano.append(albumPageBrano);
            });
          });
        }
      });
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

      // RESPONSIVE PER IL TITOLO
      const breakpoint = 1200;

      function checkBreakpoint() {
        return window.innerWidth > breakpoint;
      }

      function titleResponsive() {
        if (checkBreakpoint() && brano.title.length > 9) {
          titleCard.innerHTML = brano.title.slice(0, 10) + "...";
        } else {
          titleCard.innerHTML = brano.title;
        }
      }
      window.addEventListener("resize", titleResponsive);
      titleResponsive()

      artistCard.innerHTML = artisti(brano.title, brano.artist.name);

      // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT
      let cardBrano = colBrano.querySelector(".cardBrano");

      cardBrano.addEventListener("click", function () {
        if (brano.title == brano.album.title) {
          // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
          let id = brano.artist.id;
          getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
            targetHome.innerHTML = "";
            let artistPage = generaClone("#template-artistPage");
            let artistName = artistPage.querySelector("#artistName");
            let fanNumber = artistPage.querySelector("#fanNumber");
            let targetBranoPopolare = artistPage.querySelector(
              "#target-branoPopolare"
            );

            artistName.innerHTML = artista.name;
            fanNumber.innerHTML = artista.nb_fan + " fan";

            fetch(
              `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
            )
              .then((response) => response.json())
              .then((tracks) => {
                tracks.data.forEach((track, indice) => {
                  // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let branoPopolare = generaClone("#template-branoPopolare");
                  // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let indiceDiv = branoPopolare.querySelector(".indice");
                  let titleTrack = branoPopolare.querySelector(".titleTrack");
                  let rankTrack = branoPopolare.querySelector(".rankTrack");
                  let trackDuration =
                    branoPopolare.querySelector(".tarckDuration");
                  let trackImgBranoPopolare = branoPopolare.querySelector(
                    ".trackImgBranoPopolare"
                  );

                  // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  indiceDiv.innerHTML = indice + 1;
                  titleTrack.innerHTML = track.title_short;
                  rankTrack.innerHTML = track.rank;
                  trackDuration.innerHTML = convertiSecondiConPuntini(
                    track.duration
                  );
                  trackImgBranoPopolare.src =
                    track.contributors[0].picture_small;
                  // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                  targetBranoPopolare.append(branoPopolare);
                });
              });
            targetHome.append(artistPage);
          });
        } else {
          // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
          getCallArtistAlbum("album", brano.album.id).then((album) => {
            console.log(album);
            targetHome.innerHTML = "";
            // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
            let albumPage = generaClone("#template-albumPage");
            // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
            let titleAlbum = albumPage.querySelector(".titleAlbum");
            let didascaliaAlbumP = albumPage.querySelector(".didascaliaAlbum");
            let albumImg = albumPage.querySelector(".albumImg");
            let artistImgAlbumPage = albumPage.querySelector(
              ".artistImgAlbumPage"
            );
            // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
            titleAlbum.innerHTML = album.title;
            albumImg.src = album.cover_medium;
            artistImgAlbumPage.src = album.contributors[0].picture_small;
            didascaliaAlbum();
            function didascaliaAlbum() {
              didascaliaAlbumP.innerHTML =
                album.contributors[0].name +
                " ⋅ " +
                album.release_date.slice(0, 4) +
                " ⋅ " +
                album.nb_tracks +
                " brani, " +
                convertiSecondiConScritte(album.duration) +
                ".";
            }
            // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
            targetHome.append(albumPage);

            let targetAlbumPageBrano = document.querySelector(
              "#target-templateBranoAlbum"
            );
            album.tracks.data.forEach((track, indice) => {
              // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
              // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
              let albumPageBrano = generaClone("#template-BranoAlbum");

              // SELEZIONO GLI ELMENTI DEL CLONE
              let titleAlbumTrack =
                albumPageBrano.querySelector(".titleAlbumTrack");
              console.log(titleAlbumTrack);
              let nameArtistAlbumTrack = albumPageBrano.querySelector(
                ".nameArtistAlbumTrack"
              );
              let rankAlbumTrack =
                albumPageBrano.querySelector(".rankAlbumTrack");
              let durationAlbumTrack = albumPageBrano.querySelector(
                ".durationAlbumTrack"
              );
              let indiceDiv = albumPageBrano.querySelector(".indice");
              // MODIFICO GLI ELMENTI DEL CLONE
              indiceDiv.innerHTML = indice + 1;
              titleAlbumTrack.innerHTML = track.title_short;
              nameArtistAlbumTrack.innerHTML = track.artist.name;
              rankAlbumTrack.innerHTML = track.rank;
              durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
                track.duration
              );

              // FACCIO L'APPEND DEL ELMENTI DEL CLONE
              targetAlbumPageBrano.append(albumPageBrano);
            });
          });
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
    let p = document.createElement("p");
    p.innerHTML = brano.title;

    // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT IN REALTA QUESTO COMMENTO TI SERVE SOLO PER TROVARE ANCHE QUESTO ADD EVENT LISTENER CHE HO MESSO SUL P NELLA LEFT COL MA FUNZIONA SU UN P NON SU CARD BRANO
    p.addEventListener("click", function () {
      if (brano.title == brano.album.title) {
        // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
        let id = brano.artist.id;
        getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
          targetHome.innerHTML = "";
          let artistPage = generaClone("#template-artistPage");
          let artistName = artistPage.querySelector("#artistName");
          let fanNumber = artistPage.querySelector("#fanNumber");
          let targetBranoPopolare = artistPage.querySelector(
            "#target-branoPopolare"
          );

          artistName.innerHTML = artista.name;
          fanNumber.innerHTML = artista.nb_fan + " fan";

          fetch(
            `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
          )
            .then((response) => response.json())
            .then((tracks) => {
              tracks.data.forEach((track, indice) => {
                // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                let branoPopolare = generaClone("#template-branoPopolare");
                // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                let indiceDiv = branoPopolare.querySelector(".indice");
                let titleTrack = branoPopolare.querySelector(".titleTrack");
                let rankTrack = branoPopolare.querySelector(".rankTrack");
                let trackDuration =
                  branoPopolare.querySelector(".tarckDuration");
                let trackImgBranoPopolare = branoPopolare.querySelector(
                  ".trackImgBranoPopolare"
                );

                // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                indiceDiv.innerHTML = indice + 1;
                titleTrack.innerHTML = track.title_short;
                rankTrack.innerHTML = track.rank;
                trackDuration.innerHTML = convertiSecondiConPuntini(
                  track.duration
                );
                trackImgBranoPopolare.src = track.contributors[0].picture_small;
                // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                targetBranoPopolare.append(branoPopolare);
              });
            });
          targetHome.append(artistPage);
        });
      } else {
        // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
        getCallArtistAlbum("album", brano.album.id).then((album) => {
          console.log(album);
          targetHome.innerHTML = "";
          // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
          let albumPage = generaClone("#template-albumPage");
          // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
          let titleAlbum = albumPage.querySelector(".titleAlbum");
          let didascaliaAlbumP = albumPage.querySelector(".didascaliaAlbum");
          let albumImg = albumPage.querySelector(".albumImg");
          let artistImgAlbumPage = albumPage.querySelector(
            ".artistImgAlbumPage"
          );
          // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
          titleAlbum.innerHTML = album.title;
          albumImg.src = album.cover_medium;
          artistImgAlbumPage.src = album.contributors[0].picture_small;
          didascaliaAlbum();
          function didascaliaAlbum() {
            didascaliaAlbumP.innerHTML =
              album.contributors[0].name +
              " ⋅ " +
              album.release_date.slice(0, 4) +
              " ⋅ " +
              album.nb_tracks +
              " brani, " +
              convertiSecondiConScritte(album.duration) +
              ".";
          }
          // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
          targetHome.append(albumPage);

          let targetAlbumPageBrano = document.querySelector(
            "#target-templateBranoAlbum"
          );
          album.tracks.data.forEach((track, indice) => {
            // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
            // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
            let albumPageBrano = generaClone("#template-BranoAlbum");

            // SELEZIONO GLI ELMENTI DEL CLONE
            let titleAlbumTrack =
              albumPageBrano.querySelector(".titleAlbumTrack");
            console.log(titleAlbumTrack);
            let nameArtistAlbumTrack = albumPageBrano.querySelector(
              ".nameArtistAlbumTrack"
            );
            let rankAlbumTrack =
              albumPageBrano.querySelector(".rankAlbumTrack");
            let durationAlbumTrack = albumPageBrano.querySelector(
              ".durationAlbumTrack"
            );
            let indiceDiv = albumPageBrano.querySelector(".indice");
            // MODIFICO GLI ELMENTI DEL CLONE
            indiceDiv.innerHTML = indice + 1;
            titleAlbumTrack.innerHTML = track.title_short;
            nameArtistAlbumTrack.innerHTML = track.artist.name;
            rankAlbumTrack.innerHTML = track.rank;
            durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
              track.duration
            );

            // FACCIO L'APPEND DEL ELMENTI DEL CLONE
            targetAlbumPageBrano.append(albumPageBrano);
          });
        });
      }
    });
    targetBrani.append(p);
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

// AD OGNI CLICK SULL'ICONA DELLA HOME RIPARTE LA STESSA FETCH CHE STA ALLA RIGA 19
let homeIcon = document.querySelector(".home");
homeIcon.addEventListener("click", function () {
  targetHome.innerHTML = "";
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

        // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT
        let cardBrano = colBrano.querySelector(".cardBrano");

        cardBrano.addEventListener("click", function () {
          if (brano.title == brano.album.title) {
            // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
            let id = brano.artist.id;
            getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
              targetHome.innerHTML = "";
              let artistPage = generaClone("#template-artistPage");
              let artistName = artistPage.querySelector("#artistName");
              let fanNumber = artistPage.querySelector("#fanNumber");
              let targetBranoPopolare = artistPage.querySelector(
                "#target-branoPopolare"
              );

              artistName.innerHTML = artista.name;
              fanNumber.innerHTML = artista.nb_fan + " fan";

              fetch(
                `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
              )
                .then((response) => response.json())
                .then((tracks) => {
                  tracks.data.forEach((track, indice) => {
                    // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    let branoPopolare = generaClone("#template-branoPopolare");
                    // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    let indiceDiv = branoPopolare.querySelector(".indice");
                    let titleTrack = branoPopolare.querySelector(".titleTrack");
                    let rankTrack = branoPopolare.querySelector(".rankTrack");
                    let trackDuration =
                      branoPopolare.querySelector(".tarckDuration");
                    let trackImgBranoPopolare = branoPopolare.querySelector(
                      ".trackImgBranoPopolare"
                    );

                    // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    indiceDiv.innerHTML = indice + 1;
                    titleTrack.innerHTML = track.title_short;
                    rankTrack.innerHTML = track.rank;
                    trackDuration.innerHTML = convertiSecondiConPuntini(
                      track.duration
                    );
                    trackImgBranoPopolare.src =
                      track.contributors[0].picture_small;
                    // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                    targetBranoPopolare.append(branoPopolare);
                  });
                });
              targetHome.append(artistPage);
            });
          } else {
            // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
            getCallArtistAlbum("album", brano.album.id).then((album) => {
              console.log(album);
              targetHome.innerHTML = "";
              // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
              let albumPage = generaClone("#template-albumPage");
              // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
              let titleAlbum = albumPage.querySelector(".titleAlbum");
              let didascaliaAlbumP =
                albumPage.querySelector(".didascaliaAlbum");
              let albumImg = albumPage.querySelector(".albumImg");
              let artistImgAlbumPage = albumPage.querySelector(
                ".artistImgAlbumPage"
              );
              // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
              titleAlbum.innerHTML = album.title;
              albumImg.src = album.cover_medium;
              artistImgAlbumPage.src = album.contributors[0].picture_small;
              didascaliaAlbum();
              function didascaliaAlbum() {
                didascaliaAlbumP.innerHTML =
                  album.contributors[0].name +
                  " ⋅ " +
                  album.release_date.slice(0, 4) +
                  " ⋅ " +
                  album.nb_tracks +
                  " brani, " +
                  convertiSecondiConScritte(album.duration) +
                  ".";
              }
              // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
              targetHome.append(albumPage);

              let targetAlbumPageBrano = document.querySelector(
                "#target-templateBranoAlbum"
              );
              album.tracks.data.forEach((track, indice) => {
                // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
                // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
                let albumPageBrano = generaClone("#template-BranoAlbum");

                // SELEZIONO GLI ELMENTI DEL CLONE
                let titleAlbumTrack =
                  albumPageBrano.querySelector(".titleAlbumTrack");
                console.log(titleAlbumTrack);
                let nameArtistAlbumTrack = albumPageBrano.querySelector(
                  ".nameArtistAlbumTrack"
                );
                let rankAlbumTrack =
                  albumPageBrano.querySelector(".rankAlbumTrack");
                let durationAlbumTrack = albumPageBrano.querySelector(
                  ".durationAlbumTrack"
                );
                let indiceDiv = albumPageBrano.querySelector(".indice");
                // MODIFICO GLI ELMENTI DEL CLONE
                indiceDiv.innerHTML = indice + 1;
                titleAlbumTrack.innerHTML = track.title_short;
                nameArtistAlbumTrack.innerHTML = track.artist.name;
                rankAlbumTrack.innerHTML = track.rank;
                durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
                  track.duration
                );

                // FACCIO L'APPEND DEL ELMENTI DEL CLONE
                targetAlbumPageBrano.append(albumPageBrano);
              });
            });
          }
        });
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

        // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT
        let cardBrano = colBrano.querySelector(".cardBrano");

        cardBrano.addEventListener("click", function () {
          if (brano.title == brano.album.title) {
            // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
            let id = brano.artist.id;
            getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
              targetHome.innerHTML = "";
              let artistPage = generaClone("#template-artistPage");
              let artistName = artistPage.querySelector("#artistName");
              let fanNumber = artistPage.querySelector("#fanNumber");
              let targetBranoPopolare = artistPage.querySelector(
                "#target-branoPopolare"
              );

              artistName.innerHTML = artista.name;
              fanNumber.innerHTML = artista.nb_fan + " fan";

              fetch(
                `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
              )
                .then((response) => response.json())
                .then((tracks) => {
                  tracks.data.forEach((track, indice) => {
                    // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    let branoPopolare = generaClone("#template-branoPopolare");
                    // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    let indiceDiv = branoPopolare.querySelector(".indice");
                    let titleTrack = branoPopolare.querySelector(".titleTrack");
                    let rankTrack = branoPopolare.querySelector(".rankTrack");
                    let trackDuration =
                      branoPopolare.querySelector(".tarckDuration");
                    let trackImgBranoPopolare = branoPopolare.querySelector(
                      ".trackImgBranoPopolare"
                    );

                    // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    indiceDiv.innerHTML = indice + 1;
                    titleTrack.innerHTML = track.title_short;
                    rankTrack.innerHTML = track.rank;
                    trackDuration.innerHTML = convertiSecondiConPuntini(
                      track.duration
                    );
                    trackImgBranoPopolare.src =
                      track.contributors[0].picture_small;
                    // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                    targetBranoPopolare.append(branoPopolare);
                  });
                });
              targetHome.append(artistPage);
            });
          } else {
            // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
            getCallArtistAlbum("album", brano.album.id).then((album) => {
              console.log(album);
              targetHome.innerHTML = "";
              // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
              let albumPage = generaClone("#template-albumPage");
              // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
              let titleAlbum = albumPage.querySelector(".titleAlbum");
              let didascaliaAlbumP =
                albumPage.querySelector(".didascaliaAlbum");
              let albumImg = albumPage.querySelector(".albumImg");
              let artistImgAlbumPage = albumPage.querySelector(
                ".artistImgAlbumPage"
              );
              // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
              titleAlbum.innerHTML = album.title;
              albumImg.src = album.cover_medium;
              artistImgAlbumPage.src = album.contributors[0].picture_small;
              didascaliaAlbum();
              function didascaliaAlbum() {
                didascaliaAlbumP.innerHTML =
                  album.contributors[0].name +
                  " ⋅ " +
                  album.release_date.slice(0, 4) +
                  " ⋅ " +
                  album.nb_tracks +
                  " brani, " +
                  convertiSecondiConScritte(album.duration) +
                  ".";
              }
              // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
              targetHome.append(albumPage);

              let targetAlbumPageBrano = document.querySelector(
                "#target-templateBranoAlbum"
              );
              album.tracks.data.forEach((track, indice) => {
                // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
                // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
                let albumPageBrano = generaClone("#template-BranoAlbum");

                // SELEZIONO GLI ELMENTI DEL CLONE
                let titleAlbumTrack =
                  albumPageBrano.querySelector(".titleAlbumTrack");
                console.log(titleAlbumTrack);
                let nameArtistAlbumTrack = albumPageBrano.querySelector(
                  ".nameArtistAlbumTrack"
                );
                let rankAlbumTrack =
                  albumPageBrano.querySelector(".rankAlbumTrack");
                let durationAlbumTrack = albumPageBrano.querySelector(
                  ".durationAlbumTrack"
                );
                let indiceDiv = albumPageBrano.querySelector(".indice");
                // MODIFICO GLI ELMENTI DEL CLONE
                indiceDiv.innerHTML = indice + 1;
                titleAlbumTrack.innerHTML = track.title_short;
                nameArtistAlbumTrack.innerHTML = track.artist.name;
                rankAlbumTrack.innerHTML = track.rank;
                durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
                  track.duration
                );

                // FACCIO L'APPEND DEL ELMENTI DEL CLONE
                targetAlbumPageBrano.append(albumPageBrano);
              });
            });
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
      let p = document.createElement("p");
      p.innerHTML = brano.title;

      // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT IN REALTA QUESTO COMMENTO TI SERVE SOLO PER TROVARE ANCHE QUESTO ADD EVENT LISTENER CHE HO MESSO SUL P NELLA LEFT COL MA FUNZIONA SU UN P NON SU CARD BRANO
      p.addEventListener("click", function () {
        if (brano.title == brano.album.title) {
          // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
          let id = brano.artist.id;
          getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
            targetHome.innerHTML = "";
            let artistPage = generaClone("#template-artistPage");
            let artistName = artistPage.querySelector("#artistName");
            let fanNumber = artistPage.querySelector("#fanNumber");
            let targetBranoPopolare = artistPage.querySelector(
              "#target-branoPopolare"
            );

            artistName.innerHTML = artista.name;
            fanNumber.innerHTML = artista.nb_fan + " fan";

            fetch(
              `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
            )
              .then((response) => response.json())
              .then((tracks) => {
                tracks.data.forEach((track, indice) => {
                  // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let branoPopolare = generaClone("#template-branoPopolare");
                  // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let indiceDiv = branoPopolare.querySelector(".indice");
                  let titleTrack = branoPopolare.querySelector(".titleTrack");
                  let rankTrack = branoPopolare.querySelector(".rankTrack");
                  let trackDuration =
                    branoPopolare.querySelector(".tarckDuration");
                  let trackImgBranoPopolare = branoPopolare.querySelector(
                    ".trackImgBranoPopolare"
                  );

                  // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  indiceDiv.innerHTML = indice + 1;
                  titleTrack.innerHTML = track.title_short;
                  rankTrack.innerHTML = track.rank;
                  trackDuration.innerHTML = convertiSecondiConPuntini(
                    track.duration
                  );
                  trackImgBranoPopolare.src =
                    track.contributors[0].picture_small;
                  // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                  targetBranoPopolare.append(branoPopolare);
                });
              });
            targetHome.append(artistPage);
          });
        } else {
          // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
          getCallArtistAlbum("album", brano.album.id).then((album) => {
            console.log(album);
            targetHome.innerHTML = "";
            // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
            let albumPage = generaClone("#template-albumPage");
            // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
            let titleAlbum = albumPage.querySelector(".titleAlbum");
            let didascaliaAlbumP = albumPage.querySelector(".didascaliaAlbum");
            let albumImg = albumPage.querySelector(".albumImg");
            let artistImgAlbumPage = albumPage.querySelector(
              ".artistImgAlbumPage"
            );
            // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
            titleAlbum.innerHTML = album.title;
            albumImg.src = album.cover_medium;
            artistImgAlbumPage.src = album.contributors[0].picture_small;
            didascaliaAlbum();
            function didascaliaAlbum() {
              didascaliaAlbumP.innerHTML =
                album.contributors[0].name +
                " ⋅ " +
                album.release_date.slice(0, 4) +
                " ⋅ " +
                album.nb_tracks +
                " brani, " +
                convertiSecondiConScritte(album.duration) +
                ".";
            }
            // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
            targetHome.append(albumPage);

            let targetAlbumPageBrano = document.querySelector(
              "#target-templateBranoAlbum"
            );
            album.tracks.data.forEach((track, indice) => {
              // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
              // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
              let albumPageBrano = generaClone("#template-BranoAlbum");

              // SELEZIONO GLI ELMENTI DEL CLONE
              let titleAlbumTrack =
                albumPageBrano.querySelector(".titleAlbumTrack");
              console.log(titleAlbumTrack);
              let nameArtistAlbumTrack = albumPageBrano.querySelector(
                ".nameArtistAlbumTrack"
              );
              let rankAlbumTrack =
                albumPageBrano.querySelector(".rankAlbumTrack");
              let durationAlbumTrack = albumPageBrano.querySelector(
                ".durationAlbumTrack"
              );
              let indiceDiv = albumPageBrano.querySelector(".indice");
              // MODIFICO GLI ELMENTI DEL CLONE
              indiceDiv.innerHTML = indice + 1;
              titleAlbumTrack.innerHTML = track.title_short;
              nameArtistAlbumTrack.innerHTML = track.artist.name;
              rankAlbumTrack.innerHTML = track.rank;
              durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
                track.duration
              );

              // FACCIO L'APPEND DEL ELMENTI DEL CLONE
              targetAlbumPageBrano.append(albumPageBrano);
            });
          });
        }
      });
      targetBrani.append(p);
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

        // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT
        let cardBrano = colScegliBrano.querySelector(".cardBrano");
        cardBrano.addEventListener("click", function () {
          if (brano.title == brano.album.title) {
            // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
            let id = brano.artist.id;
            getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
              targetHome.innerHTML = "";
              let artistPage = generaClone("#template-artistPage");
              let artistName = artistPage.querySelector("#artistName");
              let fanNumber = artistPage.querySelector("#fanNumber");
              let targetBranoPopolare = artistPage.querySelector(
                "#target-branoPopolare"
              );

              artistName.innerHTML = artista.name;
              fanNumber.innerHTML = artista.nb_fan + " fan";

              fetch(
                `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
              )
                .then((response) => response.json())
                .then((tracks) => {
                  tracks.data.forEach((track, indice) => {
                    // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    let branoPopolare = generaClone("#template-branoPopolare");
                    // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    let indiceDiv = branoPopolare.querySelector(".indice");
                    let titleTrack = branoPopolare.querySelector(".titleTrack");
                    let rankTrack = branoPopolare.querySelector(".rankTrack");
                    let trackDuration =
                      branoPopolare.querySelector(".tarckDuration");
                    let trackImgBranoPopolare = branoPopolare.querySelector(
                      ".trackImgBranoPopolare"
                    );

                    // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                    indiceDiv.innerHTML = indice + 1;
                    titleTrack.innerHTML = track.title_short;
                    rankTrack.innerHTML = track.rank;
                    trackDuration.innerHTML = convertiSecondiConPuntini(
                      track.duration
                    );
                    trackImgBranoPopolare.src =
                      track.contributors[0].picture_small;
                    // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                    targetBranoPopolare.append(branoPopolare);
                  });
                });
              targetHome.append(artistPage);
            });
          } else {
            // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
            getCallArtistAlbum("album", brano.album.id).then((album) => {
              console.log(album);
              targetHome.innerHTML = "";
              // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
              let albumPage = generaClone("#template-albumPage");
              // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
              let titleAlbum = albumPage.querySelector(".titleAlbum");
              let didascaliaAlbumP =
                albumPage.querySelector(".didascaliaAlbum");
              let albumImg = albumPage.querySelector(".albumImg");
              let artistImgAlbumPage = albumPage.querySelector(
                ".artistImgAlbumPage"
              );
              // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
              titleAlbum.innerHTML = album.title;
              albumImg.src = album.cover_medium;
              artistImgAlbumPage.src = album.contributors[0].picture_small;
              didascaliaAlbum();
              function didascaliaAlbum() {
                didascaliaAlbumP.innerHTML =
                  album.contributors[0].name +
                  " ⋅ " +
                  album.release_date.slice(0, 4) +
                  " ⋅ " +
                  album.nb_tracks +
                  " brani, " +
                  convertiSecondiConScritte(album.duration) +
                  ".";
              }
              // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
              targetHome.append(albumPage);

              let targetAlbumPageBrano = document.querySelector(
                "#target-templateBranoAlbum"
              );
              album.tracks.data.forEach((track, indice) => {
                // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
                // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
                let albumPageBrano = generaClone("#template-BranoAlbum");

                // SELEZIONO GLI ELMENTI DEL CLONE
                let titleAlbumTrack =
                  albumPageBrano.querySelector(".titleAlbumTrack");
                console.log(titleAlbumTrack);
                let nameArtistAlbumTrack = albumPageBrano.querySelector(
                  ".nameArtistAlbumTrack"
                );
                let rankAlbumTrack =
                  albumPageBrano.querySelector(".rankAlbumTrack");
                let durationAlbumTrack = albumPageBrano.querySelector(
                  ".durationAlbumTrack"
                );
                let indiceDiv = albumPageBrano.querySelector(".indice");
                // MODIFICO GLI ELMENTI DEL CLONE
                indiceDiv.innerHTML = indice + 1;
                titleAlbumTrack.innerHTML = track.title_short;
                nameArtistAlbumTrack.innerHTML = track.artist.name;
                rankAlbumTrack.innerHTML = track.rank;
                durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
                  track.duration
                );

                // FACCIO L'APPEND DEL ELMENTI DEL CLONE
                targetAlbumPageBrano.append(albumPageBrano);
              });
            });
          }
        });

        if (brano.title == brano.album.title) {
          imgCard.src = brano.artist.picture_medium;
        } else {
          imgCard.src = brano.album.cover_medium;
        }

        titleCard.innerHTML = brano.title_short;

        artistCard.innerHTML = artisti(brano.title, brano.artist.name);

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
          let p = document.createElement("p");
          p.innerHTML = brano.title;

          // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT IN REALTA QUESTO COMMENTO TI SERVE SOLO PER TROVARE ANCHE QUESTO ADD EVENT LISTENER CHE HO MESSO SUL P NELLA LEFT COL MA FUNZIONA SU UN P NON SU CARD BRANO
          p.addEventListener("click", function () {
            if (brano.title == brano.album.title) {
              // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
              let id = brano.artist.id;
              getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
                targetHome.innerHTML = "";
                let artistPage = generaClone("#template-artistPage");
                let artistName = artistPage.querySelector("#artistName");
                let fanNumber = artistPage.querySelector("#fanNumber");
                let targetBranoPopolare = artistPage.querySelector(
                  "#target-branoPopolare"
                );

                artistName.innerHTML = artista.name;
                fanNumber.innerHTML = artista.nb_fan + " fan";

                fetch(
                  `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
                )
                  .then((response) => response.json())
                  .then((tracks) => {
                    tracks.data.forEach((track, indice) => {
                      // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                      let branoPopolare = generaClone(
                        "#template-branoPopolare"
                      );
                      // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                      let indiceDiv = branoPopolare.querySelector(".indice");
                      let titleTrack =
                        branoPopolare.querySelector(".titleTrack");
                      let rankTrack = branoPopolare.querySelector(".rankTrack");
                      let trackDuration =
                        branoPopolare.querySelector(".tarckDuration");
                      let trackImgBranoPopolare = branoPopolare.querySelector(
                        ".trackImgBranoPopolare"
                      );

                      // MODIFICO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                      indiceDiv.innerHTML = indice + 1;
                      titleTrack.innerHTML = track.title_short;
                      rankTrack.innerHTML = track.rank;
                      trackDuration.innerHTML = convertiSecondiConPuntini(
                        track.duration
                      );
                      trackImgBranoPopolare.src =
                        track.contributors[0].picture_small;
                      // INSERISCO I TEMPLATE CLOANTI ONGI VOLTA NEL LORO ATRGET OVVERO UN DIV NEL TEMPLATE ARTIST
                      targetBranoPopolare.append(branoPopolare);
                    });
                  });
                targetHome.append(artistPage);
              });
            } else {
              // SE IL BRANO è UNA TRACCIA DI UN ALBUM LA FETCH TROVERà IL SUO ALBUM
              getCallArtistAlbum("album", brano.album.id).then((album) => {
                console.log(album);
                targetHome.innerHTML = "";
                // GENERO IL CLONE DELLA PAGINA ALBUM DA INSERIRE NALL COLONNA CENTRALE
                let albumPage = generaClone("#template-albumPage");
                // SELEZIONO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
                let titleAlbum = albumPage.querySelector(".titleAlbum");
                let didascaliaAlbumP =
                  albumPage.querySelector(".didascaliaAlbum");
                let albumImg = albumPage.querySelector(".albumImg");
                let artistImgAlbumPage = albumPage.querySelector(
                  ".artistImgAlbumPage"
                );
                // MODIFICO GLI ELEMENTI DEL CLONE DELLA PAGINA ALBUM
                titleAlbum.innerHTML = album.title;
                albumImg.src = album.cover_medium;
                artistImgAlbumPage.src = album.contributors[0].picture_small;
                didascaliaAlbum();
                function didascaliaAlbum() {
                  didascaliaAlbumP.innerHTML =
                    album.contributors[0].name +
                    " ⋅ " +
                    album.release_date.slice(0, 4) +
                    " ⋅ " +
                    album.nb_tracks +
                    " brani, " +
                    convertiSecondiConScritte(album.duration) +
                    ".";
                }
                // INSERISCO IL TEMPLATE DEL CLONE DELLA PAGINA ALBUM
                targetHome.append(albumPage);

                let targetAlbumPageBrano = document.querySelector(
                  "#target-templateBranoAlbum"
                );
                album.tracks.data.forEach((track, indice) => {
                  // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
                  // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
                  let albumPageBrano = generaClone("#template-BranoAlbum");

                  // SELEZIONO GLI ELMENTI DEL CLONE
                  let titleAlbumTrack =
                    albumPageBrano.querySelector(".titleAlbumTrack");
                  console.log(titleAlbumTrack);
                  let nameArtistAlbumTrack = albumPageBrano.querySelector(
                    ".nameArtistAlbumTrack"
                  );
                  let rankAlbumTrack =
                    albumPageBrano.querySelector(".rankAlbumTrack");
                  let durationAlbumTrack = albumPageBrano.querySelector(
                    ".durationAlbumTrack"
                  );
                  let indiceDiv = albumPageBrano.querySelector(".indice");
                  // MODIFICO GLI ELMENTI DEL CLONE
                  indiceDiv.innerHTML = indice + 1;
                  titleAlbumTrack.innerHTML = track.title_short;
                  nameArtistAlbumTrack.innerHTML = track.artist.name;
                  rankAlbumTrack.innerHTML = track.rank;
                  durationAlbumTrack.innerHTML = convertiSecondiConPuntini(
                    track.duration
                  );

                  // FACCIO L'APPEND DEL ELMENTI DEL CLONE
                  targetAlbumPageBrano.append(albumPageBrano);
                });
              });
            }
          });
          targetBrani.append(p);
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
