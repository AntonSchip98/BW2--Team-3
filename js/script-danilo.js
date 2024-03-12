let singer = ["geolier", "annalisa", "angelina", "salmo", "gue"]
let singerCasuale = singer[Math.floor(Math.random() * singer.length)]

fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${singerCasuale}`)
  .then((res) => res.json())
  .then(brani => {  
    // CREIAMO UNA LET PER NON RIPETERCI
    let primoBrano = brani.data[0]

    // 
    let type = document.querySelector("#type")
    type.innerHTML = controlloBranoAlbum(primoBrano.title, primoBrano.album.title)
    let title = document.querySelector("#title")
    title.innerHTML = primoBrano.title

    let img = document.querySelector("#copertina")
    if (primoBrano.title == primoBrano.album.title) {
      img.src = primoBrano.artist.picture_medium
    } else {
      img.src = primoBrano.album.cover_medium
    }

    let artistP = document.querySelector("#artist")
    artistP.innerHTML = artisti(primoBrano.title, primoBrano.artist.name)

    let claimP = document.querySelector("#claim")
    claimP.innerHTML = "Ascolta il nuovo " + controlloBranoAlbum(primoBrano.title, primoBrano.album.title) + " di " + artisti(primoBrano.title, primoBrano.artist.name) 

  // FINE CARD

  // INIZIO PARTE SINISTRA
  // ABBIMAO AGIGUNTO 2 CLASSI NELL HTML
  let targetBrani = document.querySelector("#left-col")
  brani.data.forEach(brano => {
    let a = document.createElement("a")
    a.innerHTML = brano.title
    a.href = "#"//album.html
    targetBrani.append(a)
  });

  // INIZIAMO LA PARTE DEL PLAYER
  let playerImg = document.querySelector("#playerImg")

  console.log(playerImg);
  if (primoBrano.title == primoBrano.album.title) {
    playerImg.src = primoBrano.artist.picture_small
  } else {
    playerImg.src = primoBrano.album.cover_small
  }

  let playerTitle = document.querySelector("#playerTitle")
  playerTitle.innerHTML = primoBrano.title

  })

  function controlloBranoAlbum(titoloBrano, titoloAlbum) {
    if (titoloBrano == titoloAlbum) {
      return "singolo"
    } else {
      return "album"
    }
  }
function artisti(titolo, artista) {
  if (titolo.toLowerCase().includes("feat")) {
    const parti = titolo.split("feat.")
    if (parti.length > 1) {
      const dopoFeat = parti[1].slice(0, -1).trim();
      return artista + ", " + dopoFeat
    }
  }else {
    return artista
  }

}



document.querySelector("#cerca").addEventListener('input', callSearch);

async function callSearch() {
  let ricerca = document.querySelector("#cerca");
  console.log(ricerca);
  let valoreRicerca = ricerca.value;
  console.log(valoreRicerca);
  const response = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/search?q=${valoreRicerca}`
  );

  const brani = await response.json();
  console.log(brani);

  brani.data.forEach((brano) => {
    let titoloBrano = brano.title;

    let nomeArtista = brano.artist.name;

    let titoloAlbum = brano.album.title;

    let copertinaArtista = brano.artist.picture_medium;

    let cover = document.querySelector("#cover");
    cover.src = brano.album.cover;

    // SELEZIONIAMO GLI A NELA RICERCA E CMABAIMO L HREF PER REINDIRIZZARE ALLE PAGINE HTML CORRISPONDENTI

    // let branoLink = document.querySelector("a")

    // branoLink.addEventListener("click", function(){
    //     let id = brano.album.id
    //     console.log(id);
    // })
    // let artistaLink = document...
    // artistaLink.href = "./artist.html"

    // AGGIUNGERE UN REINDERIZZAMENTO ALLA PAGINA DELL'ARTISTA QUANDO SI CLICCA SULLA CARD CHE CONTIENE L'ARTISTA O COMUNQUE SU QUEL DIV
  });

  let durataBranoSingolo = brani.data[0].duration;
  console.log(convertiSecondi(durataBranoSingolo));
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
