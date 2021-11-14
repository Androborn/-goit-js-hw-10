import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const filteredParameters = [
  'name',
  'capital',
  'population',
  'flags',
  'languages',
];

const refs = {
  searchBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};
const { searchBox, countryList, countryInfo } = refs;

searchBox.addEventListener('input', debounce(runSearch, DEBOUNCE_DELAY));

function runSearch() {
  let searchText = searchBox.value.trim();

  if (!searchText) {
    return clearUi();
  }

  fetchCountries(searchText, filteredParameters.join())
    .then(countries => addSearchResultMarkup(countries))
    .catch(() => {
      clearUi();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearUi() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function addSearchResultMarkup(countries) {
  if (countries.length > 10) {
    clearUi();
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.',
    );
  }

  if (countries.length > 1) {
    clearUi();
    return (countryList.innerHTML = createCountryListMarkup(countries));
  } else {
    clearUi();
    return (countryInfo.innerHTML = createCountryInfoMarkup(countries));
  }
}

function createCountryListMarkup(countries) {
  return countries
    .map(country => {
      const { flags, name } = country;

      return `<li>
      <img src="${flags.svg}" width="50px" height="30px"</img><span>${name.official}</span>
      </li>`;
    })
    .join('');
}

function createCountryInfoMarkup(countries) {
  return countries
    .map(country => {
      const { languages, flags, name, capital, population } = country;
      const languageList = Object.values(languages).join(', ');

      return `<img src="${flags.svg}" width="50px" height="30px"</img><h1><b>${name.official}</b></h1>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Language</b>: ${languageList}</p>`;
    })
    .join('');
}
