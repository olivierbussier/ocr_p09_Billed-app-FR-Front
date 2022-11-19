export class Error {
    constructor() {

    }

    /**
     * Recherche un HTMLElement en fonction de son id ou data-testid
     *
     * @param {string} e
     * @returns
     */
    selectElement(e) {
        var element = document.querySelector('#'+e)
        if (!element) {
            element = document.querySelector(`[data-testid ="${e}"]`)
        }
        return element
    }

    /**
     * Met en pace sur l'emement e le border rouge ou bleu en fonction du paramètre type
     *
     * @param {HTMLElement} e input sur lequel on veut changer la bordure
     */
    setBorder(e, type) {
        if (type == 'err') {
            e.classList.remove('blue-border')
            e.classList.add('red-border')
        } else if (type === 'noerr') {
            e.classList.add('blue-border')
            e.classList.remove('red-border')
        }
    }
    
    /**
     * Affiche un message d'erreur 'message' sur l'élément e et met le border rouge
     *
     * @param {string} e l'id ou test-id de l'input sur lequel on veut laisser un message
     * @param {string} message Le message d'erreur
     */
    setErrMsg(e, message) {

        // Old message

        this.clearErrMsg(e)

        // Border red
        const element = this.selectElement(e)
        const parent = element.parentElement
        this.setBorder(element, 'err')

        // Error msg
        const msg = document.createElement('p')
        msg.classList.add('error-msg')
        msg.innerText = message
        parent.appendChild(msg)
    }

    /**
     * Supprime le message d'erreur sur l'élément e, et réinitialise le border
     *
     * @param {string} element
     */
    clearErrMsg (e) {

        const element = this.selectElement(e)
        const parent = element.parentElement
        this.setBorder(element, 'noerr')
        const msg = parent.querySelector('p[class="error-msg"]')
        if (!msg) {
            return // Pas d'erreur a clearer
        }
        parent.removeChild(msg)
    }
}