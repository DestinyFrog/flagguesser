
function compare_str(str1, str2) {
    str1 = str1.split('(')[0].toLowerCase().trim()
    str2 = str2.split('(')[0].toLowerCase().trim()
    return str1 == str2
}

document.getElementById('inp-country').focus()
let countries = []

document.addEventListener('alpine:init', () => {
    Alpine.data('countries', () => ({
        term: '',
        loading: false,
        filtered_countries: [],
        tries: 0,

        country: null,

        init() {
            this.loading = true
            fetch("https://countries.dev/countries?fields=alpha2Code,flags&limit=10")
                .then(res => res.json())
                .then(data => {
                    const localeNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' })
                    countries = data.map(country => ({
                        ... country,
                        name_por: localeNames.of(country.alpha2Code)
                    }))
                    this.get_random_country()
                })
                .catch(console.error)
                .finally(() => this.loading = false)
        },

        filter_countries() {
            this.filtered_countries = countries.filter(country => {
                const str1 = country.name_por.toLowerCase().trim()
                const str2 = this.term.toLowerCase().trim()
                return str1.includes(str2)
            })
        },

        get_random_country() {
            document.getElementById('inp-country').focus()

            if (!compare_str(this.country_name, this.term)) {
                this.term = ''
                this.tries++

                if (this.tries < 3)
                    return
            }

            this.term = ''
            this.tries = 0

            const randomIdx = Math.floor(Math.random() * countries.length)
            const data = countries[randomIdx]

            this.country_flag_src = data.flags.svg || data.flags.png
            this.country_flag_alt = `flag of ${data.name}`
            this.country_name = data.name_por

            countries.splice(randomIdx)
        },
    }))
})