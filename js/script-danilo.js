// AD OGNI RELOAD LA FETCH VIENE ESEGUITA CON UNA PAROLA CASUALE SCELTA DA QUESTO ARRAY
let singer = ["geolier", "annalisa", "angelina", "salmo", "gue"];
let singerCasuale = singer[Math.floor(Math.random() * singer.length)];

let targetHome = document.querySelector("#target-mid-col")


fetch(
  `https://striveschool-api.herokuapp.com/api/deezer/search?q=${singerCasuale}`
)
  .then((res) => res.json())
  .then((brani) => {
    let primoBrano = brani.data[0];

    let home = generaClone("#template-mid-cols")
    
    // CICLO FOR PER LE 6 CARD NELLA SEZIONE BUONASERA

    for (let i = 1; i < 7 && i < brani.data.length; i++) {
      const brano = brani.data[i];

      let colBrano = generaClone("#template-buonasera")

      let { imgCard, titleCard } = selezioneElementiClone(colBrano)

      if (brano.title == brano.album.title) {
        imgCard.src = brano.artist.picture_medium;
      } else {
        imgCard.src = brano.album.cover_medium;
      }
      titleCard.innerHTML = brano.title

      let target = home.querySelector("#targetBuonasera")
      target.append(colBrano)
      home.append(target)
    }

    // CICLO FOR PER LE 5 CARD NELLA SEZIONE ALTRO DI CIO CHE TI PIACE

    for (let i = 1; i < 6 && i < brani.data.length; i++) {
      const brano = brani.data[i];

      let colBrano = generaClone("#template-CioCheTiPiace")

      let { imgCard, titleCard } = selezioneElementiClone(colBrano)

      let artistCard = colBrano.querySelector("#artistCard")

      if (brano.title == brano.album.title) {
        imgCard.src = brano.artist.picture_medium;
      } else {
        imgCard.src = brano.album.cover_medium;
      }

      titleCard.innerHTML = brano.title

      artistCard.innerHTML = artisti(brano.title, brano.artist.name)

      console.log(brano.artist.name);
      let target = home.querySelector("#targetCioCheTiPiace")
      target.append(colBrano)
      home.append(target)
    }

    // CICLO FOREACH PER LO SHOWMORE DI TUTTE LE CARD NELLA SEZIONE ALTRO DI CIO CHE TI PIACE
    let isClicked = false
    let ShowMoreP = home.querySelector("#ShowMoreP")
    ShowMoreP.addEventListener("click", showMore)
    function showMore() {

      if (!isClicked) {
        targetCioCheTiPiace.innerHTML = ""
        ShowMoreP.innerHTML = "Riduci"
        brani.data.shift()
        brani.data.forEach(brano => {
          let colBrano = generaClone("#template-CioCheTiPiace")

          let { imgCard, titleCard } = selezioneElementiClone(colBrano)

          let artistCard = colBrano.querySelector("#artistCard")

          if (brano.title == brano.album.title) {
            imgCard.src = brano.artist.picture_medium;
          } else {
            imgCard.src = brano.album.cover_medium;
          }

          titleCard.innerHTML = brano.title

          artistCard.innerHTML = artisti(brano.title, brano.artist.name)

          console.log(brano.artist.name);
          let target = document.querySelector("#targetCioCheTiPiace")
          target.append(colBrano)
        });
      } else {
        targetCioCheTiPiace.innerHTML = ""
        ShowMoreP.innerHTML = "Visualizza Tutto"
        for (let i = 0; i < 5 && i < brani.data.length; i++) {
          const brano = brani.data[i];

          let colBrano = generaClone("#template-CioCheTiPiace")

          let { imgCard, titleCard } = selezioneElementiClone(colBrano)

          let artistCard = colBrano.querySelector("#artistCard")

          if (brano.title == brano.album.title) {
            imgCard.src = brano.artist.picture_medium;
          } else {
            imgCard.src = brano.album.cover_medium;
          }

          titleCard.innerHTML = brano.title

          artistCard.innerHTML = artisti(brano.title, brano.artist.name)

          console.log(brano.artist.name);
          let target = document.querySelector("#targetCioCheTiPiace")
          target.append(colBrano)
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


    targetHome.append(home)
  });

function generaClone(selettore) {
  let template = document.querySelector(selettore)
  let clone = template.content.cloneNode(true)
  return clone;
}


function selezioneElementiClone(elemento) {
  let imgCard = elemento.querySelector("#imgCard")
  let titleCard = elemento.querySelector("#titleCard")

  return {
    imgCard: imgCard,
    titleCard: titleCard,
  }
}


function controlloBranoAlbum(titoloBrano, titoloAlbum) {
  if (titoloBrano == titoloAlbum) {
    return "singolo";
  } else {
    return "album";
  }
}
function artisti(titolo, artista) {
  if (titolo.toLowerCase().includes("feat")) {
    const parti = titolo.split("feat.");
    if (parti.length > 1) {
      const dopoFeat = parti[1].slice(0, -1).trim();
      return artista + ", " + dopoFeat;
    }
  } else {
    return artista;
  }
}

let cerca = document.querySelector("#cerca");
let inputCerca = document.querySelector("#inputCerca");

cerca.addEventListener("click", function () {
  inputCerca.classList.toggle("displayNone");
});

inputCerca.addEventListener("input", callSearch);



async function callSearch() {
  let valoreRicerca = inputCerca.value;
  let colScegliBrano = generaClone("#template-scegliBrani")
  
  if (valoreRicerca) {
    targetHome.innerHTML = ""
    targetHome.append(colScegliBrano)


  // INIZIO FETCH 
  const response = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/search?q=${valoreRicerca}`
  );

  const brani = await response.json();
  console.log(brani);

  // brani.data.forEach((brano) => {
  //   let titoloBrano = brano.title;

  //   let nomeArtista = brano.artist.name;

  //   let titoloAlbum = brano.album.title;

  //   let copertinaArtista = brano.artist.picture_medium;

  //   let cover = document.querySelector("#cover");
  //   cover.src = brano.album.cover;

  //   // SELEZIONIAMO GLI A NELA RICERCA E CMABAIMO L HREF PER REINDIRIZZARE ALLE PAGINE HTML CORRISPONDENTI

  //   // let branoLink = document.querySelector("a")

  //   // branoLink.addEventListener("click", function(){
  //   //     let id = brano.album.id
  //   //     console.log(id);
  //   // })
  //   // let artistaLink = document...
  //   // artistaLink.href = "./artist.html"

  //   // AGGIUNGERE UN REINDERIZZAMENTO ALLA PAGINA DELL'ARTISTA QUANDO SI CLICCA SULLA CARD CHE CONTIENE L'ARTISTA O COMUNQUE SU QUEL DIV
  // });

  // let durataBranoSingolo = brani.data[0].duration;
  // console.log(convertiSecondi(durataBranoSingolo));
  } else {
    targetHome.innerHTML = ""
    let home = generaClone("#template-mid-cols")
    targetHome.append(home)
  }

  

  
  
}

function convertiSecondi(secondi) {
  switch (secondi) {
    case secondi < 60:
      secondi + " sec";
      break;
    case secondi > 60:
      let minuti = secondi / 60 + " min";
      if (minuti >= 60) {
        minuti / 60 + " ore";
      }
      break;
  }
}

function convertiSecondiConScritte(secondi) {
  let ore = Math.floor(secondi / 3600);
  let minuti = Math.floor((secondi % 3600) / 60);
  let secondiRimanenti = secondi % 60;

  let tempoConvertito = "";

  if (ore > 0) {
    if (ore == 1) {
      tempoConvertito += ore + " ora ";
    } else if (ore > 1) {
      tempoConvertito += ore + " ore ";
    }
  }

  if (minuti > 0) {
    tempoConvertito += minuti + " min ";
  }

  if (secondiRimanenti > 0) {
    tempoConvertito += secondiRimanenti + " sec";
  }

  return tempoConvertito.trim();
}

function convertiSecondiConPuntini(secondi) {
  let ore = Math.floor(secondi / 3600);
  let minuti = Math.floor((secondi % 3600) / 60);
  let secondiRimanenti = secondi % 60;

  let tempoConvertito = "";

  if (ore > 0) {
    if (ore == 1) {
      tempoConvertito += ore;
    }
  }

  if (minuti > 0 && ore > 0) {
    tempoConvertito += ":" + minuti;
  } else {
    if (!minuti == 0) {
      tempoConvertito += minuti;
    }
  }

  if (secondiRimanenti > 0 && minuti > 0) {
    tempoConvertito += ":" + secondiRimanenti;
  } else {
    tempoConvertito += secondiRimanenti;
  }

  return tempoConvertito.trim();
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
