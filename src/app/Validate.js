export class Validate {
    constructor () {

    }

    /**
     * Vérifie si le champ texte peut etre converti en date valide
     *
     * @param {string} date
     * @returns {false|string}
     */
    checkDate(date) {
        const d = new Date(date)
        if (!isNaN(d)) {
            return date
        } else {
            return false
        }
    }

    /**
     * Vérifie que le champ n'est pas vide ou nul
     *
     * @param {string|number} value
     * @returns {false|string|number}
     */
    checkNotEmpty(value) {
        if (!value) {
            return false
        }
        if (typeof value === 'string' && value.length === 0) {
            return false
        }
        return value
    }

    /**
     * Vérifie que number peut être converti en number
     *
     * @param {string} number
     * @returns {false|number}
     */
    checkNumber(number) {
        if (!number) {
            return false
        } else {
            return parseInt(number)
        }
    }

    /**
     * Vérifie que le fileName remplit les contraintes de nom et de type
     *
     * @param {string} file
     * @param {string} type
     * @returns {string}
     */
    checkFile(fileName, type = 'image/jpeg') {
        const file = fileName.toLocaleLowerCase()
        if(!file.endsWith('.png') && !file.endsWith('.jpg') && !file.endsWith('.jpeg'))
            return false
        if (type !== 'image/jpeg' && type !== 'image/png')
            return false
        return file
    }

    /**
     * Vérifie que le champ n'est ni vide, ni égal a '---' (valeur par défault des champs select)
     *
     * @param {string} value
     * @returns {string|false}
     */
    checkType(value) {
        if (!value || value === null || value === '---') {
            return false
        } else {
            return value
        }
    }

    /**
     * Ne vérifie rien, mais remplace null par chaine vide
     * 
     * @param {string|number|null} value
     * @returns {string|number}
     */
    noCheck(value) {
        if (value) {
            return value
        } else {
            return ''
        }
    }
}