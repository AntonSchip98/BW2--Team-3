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

let audio = document.querySelector("#song");

let targetHome = document.querySelector("#target-mid-col");

getCall(singerCasuale).then((brani) => {
  let primoBrano = brani.data[0];
  // INIZIO MODIFICHE PER PRELEVARE LE CANZONI
  brani.data.forEach((brano) => {
    canzoni.push(brano);
  });
  // FINE MODIFICHE PER PRELEVARE LE CANZONI

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
            let coverArtist = artistPage.querySelector(".coverArtist");
            let fanNumber = artistPage.querySelector("#fanNumber");
            let targetBranoPopolare = artistPage.querySelector(
              "#target-branoPopolare"
            );

            artistName.innerHTML = artista.name;
            coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
            fanNumber.innerHTML = artista.nb_fan + " fan";

            fetch(
              `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`
            )
              .then((response) => response.json())
              .then((tracks) => {
                let playerImg = document.querySelector("#playerImg");
                tracks.data.forEach((track, indice) => {
                  // GENERO IL CLONE DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let branoPopolare = generaClone("#template-branoPopolare");
                  // SELEZIONO GLI ELEMENTI DAL TEMPLATE CHE CLONERO TANTE VOLTE QUANTI SONO I BRANI POPOLARI
                  let indiceDiv = branoPopolare.querySelector(".indice");
                  let titleTrack = branoPopolare.querySelector(".titleTrack");
                  let rankTrack = branoPopolare.querySelector(".rankTrack");
                  let trackDuration =
                    branoPopolare.querySelector(".trackDuration");
                  let trackImgBranoPopolare = branoPopolare.querySelector(
                    ".trackImgBranoPopolare"
                  );

                  let cardBranoPoplare = branoPopolare.querySelector(".branoPopolare");

                  cardBranoPoplare.addEventListener("click", function () {
                    playerChange(track);
                    playerImg.src = track.contributors[0].picture_small;
                    if (audio.paused) {
                      audio.play();
                      let element = document.querySelector(".bi-play-fill");
                      element.classList.remove("bi-play-fill");
                      element.classList.add("bi-pause-fill");
                    }
                  });

                  playPause.addEventListener("click", toggleSongPlayState);

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
              console.log(track);
              // SELEZIONO IL TARGET DOVE FARO L'APPEND DEL CLONE
              // GENERO IL CLONE DEL TEMPLATE DEI BRANI DELL'ALBUM SELEZIONATO CHE CLOENRO TANTE VOLTE QUANTE SONO LE TRACCE DELL'ALBUM
              let albumPageBrano = generaClone("#template-BranoAlbum");

              // SELEZIONO GLI ELMENTI DEL CLONE
              let titleAlbumTrack =
                albumPageBrano.querySelector(".titleAlbumTrack");
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

              let cardBranoPoplare = albumPageBrano.querySelector(".branoPopolare");

                  cardBranoPoplare.addEventListener("click", function () {
                    playerChange(track);
                    if (audio.paused) {
                      audio.play();
                      let element = document.querySelector(".bi-play-fill");
                      element.classList.remove("bi-play-fill");
                      element.classList.add("bi-pause-fill");
                    }
                  });

                  playPause.addEventListener("click", toggleSongPlayState);

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
      titleResponsive();

      artistCard.innerHTML = artisti(brano.title, brano.artist.name);

      // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT
      let cardBrano = colBrano.querySelector(".cardBrano");
      cardBrano.addEventListener("click", function () {
        playerChange(brano);

        if (brano.title == brano.album.title) {
          // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
          let id = brano.artist.id;
          getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
            targetHome.innerHTML = "";
            let artistPage = generaClone("#template-artistPage");
            let artistName = artistPage.querySelector("#artistName");
            let coverArtist = artistPage.querySelector(".coverArtist");
            let fanNumber = artistPage.querySelector("#fanNumber");
            let targetBranoPopolare = artistPage.querySelector(
              "#target-branoPopolare"
            );

            artistName.innerHTML = artista.name;
            coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                    branoPopolare.querySelector(".trackDuration");
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
      let target = home.querySelector("#targetCioCheTiPiace");
      target.append(colBrano);
    }
  }

  // CICLO FOREACH PER LO SHOWMORE DI TUTTE LE CARD NELLA SEZIONE ALTRO DI CIO CHE TI PIACE
  let isClicked = false;
  let ShowMoreP = home.querySelector("#ShowMoreP");
  ShowMoreP.addEventListener("click", showMore);
  function showMore() {
    isClicked = !isClicked;
    if (isClicked) {
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
          playerChange(brano);
          if (brano.title == brano.album.title) {
            // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
            let id = brano.artist.id;
            getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
              targetHome.innerHTML = "";
              let artistPage = generaClone("#template-artistPage");
              let artistName = artistPage.querySelector("#artistName");
              let coverArtist = artistPage.querySelector(".coverArtist");
              let fanNumber = artistPage.querySelector("#fanNumber");
              let targetBranoPopolare = artistPage.querySelector(
                "#target-branoPopolare"
              );

              artistName.innerHTML = artista.name;
              coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                      branoPopolare.querySelector(".trackDuration");
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

        let cardBrano = colBrano.querySelector(".cardBrano");

        cardBrano.addEventListener("click", function () {
          playerChange(brano);
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
                      branoPopolare.querySelector(".trackDuration");
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
        let target = document.querySelector("#targetCioCheTiPiace");
        target.append(colBrano);
      }
    }
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
      playerChange(brano);
      if (brano.title == brano.album.title) {
        // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
        let id = brano.artist.id;
        getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
          targetHome.innerHTML = "";
          let artistPage = generaClone("#template-artistPage");
          let artistName = artistPage.querySelector("#artistName");
          let coverArtist = artistPage.querySelector(".coverArtist");
          let fanNumber = artistPage.querySelector("#fanNumber");
          let targetBranoPopolare = artistPage.querySelector(
            "#target-branoPopolare"
          );

          artistName.innerHTML = artista.name;
          coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                  branoPopolare.querySelector(".trackDuration");
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
  let playerArtist = document.querySelector(".playerArtist");
  let playerTitle = document.querySelector("#playerTitle");
  playerChange(primoBrano);

  function playerChange(brano) {
    if (brano.title == brano.album.title) {
      playerImg.src = brano.artist.picture_small;
    } else {
      playerImg.src = brano.album.cover_small;
    }

    playerTitle.innerHTML = brano.title;

    playerArtist.innerHTML = brano.artist.name;

    let audio = document.querySelector("#song");
    audio.src = brano.preview;
  }
  targetHome.append(home);
});

// AD OGNI CLICK SULL'ICONA DELLA HOME RIPARTE LA STESSA FETCH CHE STA ALLA RIGA 19
let homeIcon = document.querySelector(".home");
homeIcon.addEventListener("click", function () {
  targetHome.classList.remove(
    "row",
    "d-flex",
    "justify-content-evenly",
    "container"
  );
  targetHome.innerHTML = "";
  getCall(singerCasuale).then((brani) => {
    console.log(progressed.value);
    let primoBrano = brani.data[0];
    console.log(primoBrano);
    // INIZIO MODIFICHE PER PRELEVARE LE CANZONI
    brani.data.forEach((brano) => {
      let songs = brano.preview;
      console.log(songs);
    });
    // FINE MODIFICHE PER PRELEVARE LE CANZONI

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
          playerChange(brano);
          if (brano.title == brano.album.title) {
            // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
            let id = brano.artist.id;
            getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
              targetHome.innerHTML = "";
              let artistPage = generaClone("#template-artistPage");
              let artistName = artistPage.querySelector("#artistName");
              let coverArtist = artistPage.querySelector(".coverArtist");
              let fanNumber = artistPage.querySelector("#fanNumber");
              let targetBranoPopolare = artistPage.querySelector(
                "#target-branoPopolare"
              );

              artistName.innerHTML = artista.name;
              coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                      branoPopolare.querySelector(".trackDuration");
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
        titleResponsive();

        artistCard.innerHTML = artisti(brano.title, brano.artist.name);

        // ADD EVENT LISTENER CON SELEZIONE DI CARDBRANO DA RENDERE EXPORT
        let cardBrano = colBrano.querySelector(".cardBrano");
        cardBrano.addEventListener("click", function () {
          playerChange(brano);

          if (brano.title == brano.album.title) {
            // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
            let id = brano.artist.id;
            getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
              targetHome.innerHTML = "";
              let artistPage = generaClone("#template-artistPage");
              let artistName = artistPage.querySelector("#artistName");
              let coverArtist = artistPage.querySelector(".coverArtist");
              let fanNumber = artistPage.querySelector("#fanNumber");
              let targetBranoPopolare = artistPage.querySelector(
                "#target-branoPopolare"
              );

              artistName.innerHTML = artista.name;
              coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                      branoPopolare.querySelector(".trackDuration");
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
      isClicked = !isClicked;
      if (isClicked) {
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
            playerChange(brano);
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
                        branoPopolare.querySelector(".trackDuration");
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

          let cardBrano = colBrano.querySelector(".cardBrano");

          cardBrano.addEventListener("click", function () {
            playerChange(brano);
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
                        branoPopolare.querySelector(".trackDuration");
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
          let target = document.querySelector("#targetCioCheTiPiace");
          target.append(colBrano);
        }
      }
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
        playerChange(brano);
        if (brano.title == brano.album.title) {
          // SE IL BRANO è UN SINGOLO LA FETCH TROVERà IL SUO ARTISTA
          let id = brano.artist.id;
          getCallArtistAlbum("artist", brano.artist.id).then((artista) => {
            targetHome.innerHTML = "";
            let artistPage = generaClone("#template-artistPage");
            let artistName = artistPage.querySelector("#artistName");
            let coverArtist = artistPage.querySelector(".coverArtist");
            let fanNumber = artistPage.querySelector("#fanNumber");
            let targetBranoPopolare = artistPage.querySelector(
              "#target-branoPopolare"
            );

            artistName.innerHTML = artista.name;
            coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                    branoPopolare.querySelector(".trackDuration");
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
    let playerArtist = document.querySelector(".playerArtist");
    let playerTitle = document.querySelector("#playerTitle");
    playerChange(primoBrano);

    function playerChange(brano) {
      if (brano.title == brano.album.title) {
        playerImg.src = brano.artist.picture_small;
      } else {
        playerImg.src = brano.album.cover_small;
      }

      playerTitle.innerHTML = brano.title;

      playerArtist.innerHTML = brano.artist.name;

      let audio = document.querySelector("#song");
      audio.src = brano.preview;
    }
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
      let playerArtist = document.querySelector(".playerArtist");

      function playerChange(brano) {
        if (brano.title == brano.album.title) {
          playerImg.src = brano.artist.picture_small;
        } else {
          playerImg.src = brano.album.cover_small;
        }

        playerTitle.innerHTML = brano.title;

        playerArtist.innerHTML = brano.artist.name;

        let audio = document.querySelector("#song");
        audio.src = brano.preview;
      }
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
              let coverArtist = artistPage.querySelector(".coverArtist");
              let fanNumber = artistPage.querySelector("#fanNumber");
              let targetBranoPopolare = artistPage.querySelector(
                "#target-branoPopolare"
              );

              artistName.innerHTML = artista.name;
              coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                      branoPopolare.querySelector(".trackDuration");
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
              playerChange(brano);
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
                let coverArtist = artistPage.querySelector(".coverArtist");
                let fanNumber = artistPage.querySelector("#fanNumber");
                let targetBranoPopolare = artistPage.querySelector(
                  "#target-branoPopolare"
                );

                artistName.innerHTML = artista.name;
                coverArtist.style.backgroundImage = `url(${brano.artist.picture_xl}`;
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
                        branoPopolare.querySelector(".trackDuration");
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
        targetHome.append(home);
      });
    }, 250);
  }
}

let playPause = document.querySelector("#playIcon"); //selettori per player
let progresso = document.querySelector("#progresso");
let durata = document.querySelector("#durata");
let progressBar = document.querySelector("#progress-bar");
let progressed = document.querySelector("#progressed");

let playerImg = document.querySelector("#playerImg");
let playerArtist = document.querySelector(".playerArtist");
let playerTitle = document.querySelector("#playerTitle");

playPause.addEventListener("click", toggleSongPlayState); // tempo totale canzone

function toggleSongPlayState(){
  if (audio.paused) {
    song.play();
    let element = document.querySelector(".bi-play-fill");
    element.classList.remove("bi-play-fill");
    element.classList.add("bi-pause-fill");
  } else {
    song.pause();
    let element = document.querySelector(".bi-pause-fill");
    element.classList.remove("bi-pause-fill");
    element.classList.add("bi-play-fill");
  }
}

//faccio sì che l'utente veda la durata totale del brano
audio.addEventListener("canplay", function () {
  let durataSec = audio.duration;
  let formatDurata = formatTime(durataSec);
  durata.textContent = formatDurata;
});

function formatTime(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = Math.floor(timeInSeconds % 60);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
} //avanzamento barra



audio.addEventListener("timeupdate", function () {
  console.log('timeupdate');
  let currentTime = audio.currentTime || 0;
  let formatCurrentTime = formatTime(currentTime);
  progresso.textContent = formatCurrentTime;
  let totalTime = audio.duration || 0;
  let remainingTime = totalTime - currentTime ;
  let formatRemainingTime = formatTime(remainingTime);
  durata.textContent = formatRemainingTime;
  let progressPercent = (currentTime / audio.duration) * 100 || 0;
  progressBar.style.width = progressPercent + "%";
  progressed.value = progressPercent;

  console.log(
    currentTime,
    formatCurrentTime,
    totalTime,
    remainingTime,
    formatRemainingTime,
    progressPercent
  );
});

progressBar.onclick = function (e) {
  audio.currentTime = (e.offsetX / progressBar.offsetWidth) * audio.duration;
  console.log(e.offsetX);
  progressed.setAttribute(
    "max",
    Math.floor((audio.currentTime * 100) / audio.duration) + "%"
  );
};

//il volume
let volume = document.querySelector("#volumeControl");
volume.addEventListener("input", function () {
  song.volume = this.value;
});
//ripeti
let ripeti = document.querySelector("#ripeti");
ripeti.addEventListener("click", function () {
  if (song.loop) {
    song.loop = false;
    this.style.color = "";
  } else {
    song.loop = true;
    this.style.color = "green";
  }
});
// muto
let muto = document.querySelector("#muto");

let mutato = false;
muto.addEventListener("click", function () {
  if (mutato) {
    // Se è muto, riattiva il suono e modifica l'icona
    song.volume = 1;
    mutato = false;
    muto.classList.remove("bi-volume-mute");
    muto.classList.add("bi-volume-up");
  } else {
    // Se non è muto, disattiva il suono e modifica l'icona
    song.volume = 0;
    mutato = true;
    muto.classList.remove("bi-volume-up");
    muto.classList.add("bi-volume-mute");
  }
});
//avanti e indietro
let prec = document.querySelector("#prec");
let next = document.querySelector("#next");
let indiceCanzone = 0;

let canzoni = [];

function playCurrent() {
  playerArtist.innerHTML = canzoni[indiceCanzone].artist.name;
  playerTitle.innerHTML = canzoni[indiceCanzone].title;

  if (canzoni[indiceCanzone].title == canzoni[indiceCanzone].album.title) {
    playerImg.src = canzoni[indiceCanzone].artist.picture_small;
  } else {
    playerImg.src = canzoni[indiceCanzone].album.cover_small;
  }
  audio.src = canzoni[indiceCanzone];
  audio.play();
}

// Gestione del click sul pulsante "prec"
prec.addEventListener("click", function () {
  indiceCanzone = (indiceCanzone - 1 + canzoni.length) % canzoni.length;
  playCurrent();
});

// Gestione del click sul pulsante "next"
next.addEventListener("click", function () {
  indiceCanzone = (indiceCanzone + 1) % canzoni.length;
  playCurrent();
});