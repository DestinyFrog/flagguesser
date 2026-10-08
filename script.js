import CountryRepository from '/country_repository.js'

function show_error(error) {
    console.error(error)
}

function compare_str(str1, str2) {
    str1 = str1.split('(')[0]
    str2 = str2.split('(')[0]

    str1 = str1.toLowerCase().trim()
    str2 = str2.toLowerCase().trim()

    return str1 == str2
}

const countryRepository = new CountryRepository()

document.addEventListener('alpine:init', () => {
    Alpine.data('countries', () => ({
        term: '',
        country_flag_src: null,
        country_flag_alt: null,
        country_name: '',
        loading: false,

        init() {
            this.loading = true
            countryRepository.loadAllAlphaCodesAndLocaleNames()
                .then(() => this.get_random_country())
                .catch(show_error)
                .finally(() => this.loading = false)
        },

        get_random_country() {
            document.getElementById('inp-country').focus()

            if (!compare_str(this.country_name, this.term)) {
                this.term = ''
                return
            }

            this.term = ''
            countryRepository.getRandomCountry()
                .then((data) => {
                    this.country_flag_src = data.flags.svg || data.flags.png
                    this.country_flag_alt = `${data.name} flag`
                    this.country_name = data.name_por
                })
                .catch(show_error)
        }
    }))
})