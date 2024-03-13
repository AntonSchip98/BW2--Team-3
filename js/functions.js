export function generaClone(selettore) {
  let template = document.querySelector(selettore);
  let clone = template.content.cloneNode(true);
  return clone;
}

export function selezioneElementiClone(elemento) {
  let imgCard = elemento.querySelector("#imgCard");
  let titleCard = elemento.querySelector("#titleCard");

  return {
    imgCard: imgCard,
    titleCard: titleCard,
  };
}

export function controlloBranoAlbum(titoloBrano, titoloAlbum) {
  if (titoloBrano == titoloAlbum) {
    return "singolo";
  } else {
    return "album";
  }
}

export function artisti(titolo, artista) {
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

export function convertiSecondiConScritte(secondi) {
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

export function convertiSecondiConPuntini(secondi) {
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

export function convertiSecondi(secondi) {
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

// CHIAMATE FETCH
export async function getCall(value) {
  const res = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/search?q=${value}`
  );
  const product = await res.json();
  return product;
}


export async function getCallArtistAlbum(value, id) {
  const res = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/${value}/${id}`
  );
  const product = await res.json();
  return product;
}