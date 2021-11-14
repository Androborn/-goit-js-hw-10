const SOURCEURL = 'https://restcountries.com/v3.1/name';

export function fetchCountries(name, parameters) {
  return fetch(`${SOURCEURL}/${name}?fields=${parameters}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
