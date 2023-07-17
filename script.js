'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// using Promise old

// btn.addEventListener('click', function(e){
//     e.preventDefault();

//     getLocation()
//         .then(position => {
//             const {latitude, longitude} = position.coords;
//             return fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=131357224488536815831x33045`)
//         })
//         .then(res => res.json())
//         .then(countryData => {
//             if(!countryData){
//                 throw new Error('no country data from geocode.xyz!');
//             }

//             let countryName = countryData?.country;
//             if(!countryName){
//                 reject(new Error('country data from geocode.xyz has no field Name!'));
//             }

//             countryName = String(countryName).replaceAll(' ', '').toLowerCase();
//             return fetch(`https://countries-api-836d.onrender.com/countries/name/${countryName}`)
//         })
//         .then(res => res.json())
//         .then(dataCountry => {
//             renderCountry(dataCountry[0]);
//             return getNeighborCountryData(dataCountry[0]);
//         })
//         .then((neighbors) => {
//             //console.log(neighbors);
//             neighbors.forEach((neighbor) => {
//                 fetch(`https://countries-api-836d.onrender.com/countries/name/${neighbor}`)
//                     .then(res => res.json())
//                     .then(data => {
//                         //console.log(data[0]);
//                         renderCountry(data[0], 'neighbour');
//                     })
//                     .catch(error => {
//                         throw new Error(error.message);
//                     });
//             });
//         })
//         .catch(error => {
//             console.log(error);
//         })
//         .finally(() => {
//             btn.setAttribute('hidden', '');
//         });
// });

// const getLocation = function () {
//     return new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//     });
// };


// function renderCountry(data, neighbour = ''){
//     let htmlCountry = `
//         <article class="country ${neighbour}">
//             <img class="country__img" src="${data.flag}" />
//             <div class="country__data">
//                 <h3 class="country__name">${data.name}</h3>
//                 <h4 class="country__region">${data.demonym}</h4>
//                 <p class="country__row"><span>👫</span>${data.population} people</p>
//                 <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//                 <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//             </div>
//         </article>
//     `;

//     countriesContainer.insertAdjacentHTML('beforeend', htmlCountry);
//     countriesContainer.style.opacity = 1;
// }

// function getNeighborCountryData(myCountryData){
//     return new Promise((resolve, reject) => {
//         const neighbors = myCountryData?.borders;
//         if(!neighbors){
//             reject(new Error('Country data from countries-api has no "borders" field!'))
//         }
//         resolve(neighbors);
//     });
// }


///////////////////////////////
// use Async/Await

btn.addEventListener('click', handlerWhoAmIBtn);

async function handlerWhoAmIBtn(e){
    e.preventDefault();

    try {
        const position = await getLocation();
        const {latitude, longitude} = position.coords;

        const responseGeocode = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=131357224488536815831x33045`);
        const countryData = await responseGeocode.json();
        if(!countryData){
            throw new Error('no country data from geocode.xyz!');
        }
        
        let countryName = countryData?.country;
        if(!countryName){
            throw new Error('country data from geocode.xyz has no field Name!');
        }

        countryName = String(countryName).replaceAll(' ', '').toLowerCase();
        const responseCountry = await fetch(`https://countries-api-836d.onrender.com/countries/name/${countryName}`);
        const dataCountry = await responseCountry.json();

        renderCountry(dataCountry[0]);

        const neighbors = await getNeighborCountryData(dataCountry[0]);
        neighbors.forEach(async (neighbor) => {
            try {
                const responseNeighbor = await fetch(`https://countries-api-836d.onrender.com/countries/name/${neighbor}`);
                const dataNeighbor = await responseNeighbor.json();
                renderCountry(dataNeighbor[0], 'neighbour');
            } catch (error) {
                throw error;
            }
        });

    } catch (error) {
        console.log(error.message);
    } finally{
            btn.setAttribute('hidden', '');
    }
}

const getLocation = function () {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};


function renderCountry(data, neighbour = ''){
    let htmlCountry = `
        <article class="country ${neighbour}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.demonym}</h4>
                <p class="country__row"><span>👫</span>${data.population} people</p>
                <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
                <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
        </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', htmlCountry);
    countriesContainer.style.opacity = 1;
}

function getNeighborCountryData(myCountryData){
    return new Promise((resolve, reject) => {
        const neighbors = myCountryData?.borders;
        if(!neighbors){
            reject(new Error('Country data from countries-api has no "borders" field!'))
        }
        resolve(neighbors);
    });
}
