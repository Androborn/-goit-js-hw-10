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

searchBox.addEventListener('input', debounce(search, DEBOUNCE_DELAY));

function addParametersToFilter() {
  return filteredParameters.join();
}

function search() {
  let searchText = searchBox.value.trim();

  if (!searchText) {
    return;
  }

  fetchCountries(searchText, addParametersToFilter())
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
      return `<li>
      <img src="${country.flags.svg}" width="50px" height="30px"</img><span>${country.name.official}</span>
      </li>`;
    })
    .join('');
}

function createCountryInfoMarkup(countries) {
  return countries
    .map(country => {
      const languageList = Object.values(country.languages).join(', ');

      return `<img src="${country.flags.svg}" width="50px" height="30px"</img><h1><b>${country.name.official}</b></h1>
        <p><b>Capital</b>: ${country.capital}</p>
        <p><b>Population</b>: ${country.population}</p>
        <p><b>Language</b>: ${languageList}</p>`;
    })
    .join('');
}
