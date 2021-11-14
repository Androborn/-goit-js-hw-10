export function fetchCountries(name, parameters) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=${parameters}`,
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
