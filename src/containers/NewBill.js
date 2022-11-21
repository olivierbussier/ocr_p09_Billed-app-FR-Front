import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"
import { Error } from "../app/error.js"
import { Validate } from '../app/Validate.js'

export default class NewBill {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        this.err = new Error()
        this.validate = new Validate()
        const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
        formNewBill.addEventListener("submit", this.handleSubmit)
        const cancelButton = this.document.querySelector(`#btn-cancel`)
        cancelButton.addEventListener("click", this.handleCancel)

        const file = this.document.querySelector(`input[data-testid="file"]`)
        file.addEventListener("change", this.handleChangeFile)

        this.file = null
        this.fileUrl = null
        this.fileName = null
        this.billId = null
        new Logout({ document, localStorage, onNavigate })
    }

    /**
     *
     * @param {Event} e
     * @returns
     */
    handleChangeFile = (e) => {
        e.preventDefault()
        const err = new Error()

        // Récup du nom de fichier
        this.file = this.document.querySelector(`input[data-testid="file"]`).files[0]
        this.filePath = e.target.value.split(/\\/g)
        this.fileName = this.filePath[this.filePath.length-1]

        // Check du nom de fichier
        if(!this.validate.checkFile(this.file.name, this.file.type)){
            // Bordure rouge et message sous input

            err.setErrMsg('file','Nom de fichier incorrect (jpg ou png seulement)')
            this.file = null
            this.filePath = null
            this.fileName = null
            return false;
        } else {
            err.clearErrMsg('file')
        }
    }

    /**
     *
     * @param {Event} e
     * @returns
     */
    handleCancel = async(e) => {
        this.onNavigate(ROUTES_PATH['Bills'])
    }

    /**
     *
     * @param {Event} e
     * @returns
     */
    handleSubmit = async(e) => {
        e.preventDefault()

        const fieldsConstraints = [
            {id: 'expense-type', bill: 'type'       , cb: this.validate.checkType    , msg: "type de dépense incorrect"},
            {id: 'expense-name', bill: 'name'       , cb: this.validate.checkNotEmpty, msg: "nom de la dépense incorrect"},
            {id: 'datepicker'  , bill: 'date'       , cb: this.validate.checkDate    , msg: "Date incorrecte"},
            {id: 'amount'      , bill: 'amount'     , cb: this.validate.checkNumber  , msg: "Montant incorrect"},
            {id: 'pct'         , bill: 'pct'        , cb: this.validate.checkNumber  , msg: "Taxe incorrecte"},
            {id: 'vat'         , bill: 'vat'        , cb: this.validate.noCheck      , msg: ""},
            {id: 'commentary'  , bill: 'commentary' , cb: this.validate.noCheck      , msg: ""}
        ]

        var noError = true

        // Test du fichier attaché
        if (!this.file || !this.validate.checkFile(this.file.name, this.file.type)) {
            this.err.setErrMsg('file', "Nom de fichier incorrect (jpg ou png seulement)")
            noError = false
        } else {
            this.err.clearErrMsg('file')
        }
        // Constitution de la note et verif des champs
        const bill = {
            billId:     this.billId,
            email:      JSON.parse(localStorage.getItem("user")).email,
            fileUrl:    this.fileUrl,
            fileName:   this.fileName,
            status:     'pending'
        }

        fieldsConstraints.forEach((entry) => {

            const element = e.target.querySelector(`[data-testid="${entry.id}"]`)
            const result = entry.cb(element.value)
            if (result === false) {
                this.err.setErrMsg(entry.id, entry.msg)
                noError = false
            } else {
                this.err.clearErrMsg(entry.id)
                if (entry.bill != '') {
                    bill[entry.bill] = result
                }
            }
        })

        if (noError) {
            const formData = new FormData()
            const email = JSON.parse(localStorage.getItem("user")).email
            formData.append('file', this.file)
            formData.append('email', email)
            // 1ere étape, création de la note avec juste l'image ...
            await this.store
            .bills()
            .create({
                data: formData,
                headers: {
                    noContentType: true
            }
            })
            .then(({fileUrl, key}) => {
                this.billId = key
                this.fileUrl = fileUrl
                this.updateBill(bill)
                this.onNavigate(ROUTES_PATH['Bills'])
            }).catch(error => {
                debugger
                this.affErreur(error)
            })
            // 2eme étape, update de la note avec tout le reste
        } else {
            return false
        }
    }

    affErreur(error) {
        const errorMsg = this.document.getElementById('error-message')
        errorMsg.innerHTML = /*html*/`<div class="alert alert-danger" data-testid="error-api" role="alert">Une erreur est apparue : ${error}</div>`
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000)
    }

    // not need to cover this function by tests
    updateBill = (bill) => {
        if (this.store) {
            this.store
            .bills()
            .update({data: JSON.stringify(bill), selector: this.billId})
            .then(() => {
                this.onNavigate(ROUTES_PATH['Bills'])
            }).catch(error => {
                this.affErreur(error)
            })
        }
    }
}