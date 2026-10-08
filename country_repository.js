
const BASE_URL = 'https://countries.dev'

class CountryRepository {
    constructor() {
        this.countries = []
    }    

    async loadAllAlphaCodesAndLocaleNames(locale = 'pt-BR') {
        const res = await fetch(`${BASE_URL}/countries?fields=alpha2Code`)
        const data = await res.json()
        const localeNames = new Intl.DisplayNames([locale], { type: 'region' });
        this.countries = data.reduce((obj, { alpha2Code }) => {
            obj[alpha2Code] = localeNames.of(alpha2Code)
            return obj
        }, {})
    }

    async getCountryByAlphaCode(alphaCode) {
        const res = await fetch(`${BASE_URL}/alpha/${alphaCode}?fields=flags,name`)
        const data = await res.json()
        return { ...data, name_por: this.countries[alphaCode] }
    }

    async getRandomCountry() {
        const countriesKeys = Object.keys(this.countries)
        const randomIdx = Math.floor(Math.random() * countriesKeys.length)
        const alphaCode = countriesKeys[randomIdx]
        return this.getCountryByAlphaCode(alphaCode)
    }
}

export default CountryRepository