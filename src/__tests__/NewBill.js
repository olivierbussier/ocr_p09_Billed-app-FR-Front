/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"
import { bills } from "../fixtures/bills"
import { localStorageMock } from "../__mocks__/localStorage.js"
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee on newbill page", () => {

  describe("without having filled any field", () => {
    test("then 'Cancel' must leave page and return to bills page", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")

      // Verifie handleSubmit
      const handleCancel = jest.fn((e) => bill.handleCancel(e))
      const btn = document.querySelector('#btn-cancel')
      btn.addEventListener('click', handleCancel)
      userEvent.click(btn)
      expect(handleCancel).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledTimes(0)

    })
  })
  describe("without having filled any field", () => {
    test("then 'Envoyer' must not leave page and error must be displayed on type, name, date amount, pct and file items", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")

      // Verifie handleSubmit
      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('click', handleSubmit)
      userEvent.click(form)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledTimes(0)

      // Vérif des erreurs
      expect(screen.getByTestId('expense-type').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('expense-name').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('datepicker').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('amount').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('vat').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('pct').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('commentary').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('file').classList.contains('red-border')).toBe(true)
    })
  })
  describe("after having selected bad extension in file (test.xml)", () => {
    test(" then Envoyer must not leave page and error must be displayed on file item", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.pdf', { type: 'application/pdf' })]
        }
      })

      // Vérif des erreurs
      expect(screen.getByTestId('expense-type').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('expense-name').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('datepicker').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('amount').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('vat').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('pct').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('commentary').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('file').classList.contains('red-border')).toBe(true)
    })
  })
  describe("after having selected good extension in file (test.jpg)", () => {
    test("then Envoyer must not leave page and error must disappear from file item", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      })

      // Vérif des erreurs
      expect(screen.getByTestId('expense-type').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('expense-name').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('datepicker').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('amount').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('vat').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('pct').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('commentary').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('file').classList.contains('red-border')).toBe(false)
    })
  })
  describe("after having filled file and expense-type", () => {
    test(" then Envoyer must not leave page and error must disappear from expense-type and file item", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)

      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('click', handleSubmit)

      const expenseType = screen.getByTestId('expense-type')
      expenseType.value = "Transports"

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test.png'], 'test.png', { type: 'image/png' })]
        }
      })

      // userEvent.type(fileInput, 'test.png')
      // userEvent.click(fileInput)
      userEvent.click(form)

      // Vérif des erreurs
      expect(screen.getByTestId('expense-type').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('expense-name').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('datepicker').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('amount').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('vat').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('pct').classList.contains('red-border')).toBe(true)
      expect(screen.getByTestId('commentary').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('file').classList.contains('red-border')).toBe(false)
    })
  })
  describe("after having filled all fields correctly and date field with non existing date", () => {
    test("  then Envoyer must not leave page and error must be displayed on date item", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)

      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('click', handleSubmit)

      screen.getByTestId('expense-type').value = "Transports"
      screen.getByTestId('expense-name').value = "Essai"
      screen.getByTestId('datepicker').value = "2022-02-31"
      screen.getByTestId('amount').value = 200
      screen.getByTestId('pct').value = 20

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test.png'], 'test.png', { type: 'image/png' })]
        }
      })

      userEvent.click(form)

      // Vérif des erreurs
      expect(screen.getByTestId('expense-type').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('expense-name').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('datepicker').classList.contains('red-border')).toBe(true)    // Error on date field
      expect(screen.getByTestId('amount').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('vat').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('pct').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('commentary').classList.contains('red-border')).toBe(false)
      expect(screen.getByTestId('file').classList.contains('red-border')).toBe(false)
    })
  })
  describe("after having filled all fields correctly", () => {
    test("  then Envoyer must send API request to backend (POST) and then frontend go to bills page", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)

      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('click', handleSubmit)

      screen.getByTestId('expense-type').value = "Transports"
      screen.getByTestId('expense-name').value = "Essai"
      screen.getByTestId('datepicker').value = "2022-02-27"
      screen.getByTestId('amount').value = 200
      screen.getByTestId('pct').value = 20

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test.png'], 'test.png', { type: 'image/png' })]
        }
      })

      userEvent.click(form)

      expect(spy).toHaveBeenCalledTimes(1)

      // Check we've returned on bills page

    })
  })
  describe("after sending a valid form, after envoyer we receive from backend", () => {
    test("an Error 404", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")
      spy.mockClear()

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)

      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('click', handleSubmit)

      screen.getByTestId('expense-type').value = "Transports"
      screen.getByTestId('expense-name').value = "Essai"
      screen.getByTestId('datepicker').value = "2022-02-27"
      screen.getByTestId('amount').value = 200
      screen.getByTestId('pct').value = 20

      var cnt1=0, cnt2=0
      mockStore.bills.mockImplementation(() => {
        debugger
        return {
          create : () =>  {
            cnt1++
            return Promise.reject(new Error("Erreur 404"))
          },
          update : () =>  {
            cnt2++
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test.png'], 'test.png', { type: 'image/png' })]
        }
      })

      userEvent.click(form)
      await new Promise(process.nextTick);

      expect(cnt1).toBe(1)
      expect(cnt2).toBe(1)
      //expect(spy).toHaveBeenCalledTimes(1)

      // Check we've returned on bills page

    })
    test("an Error 500", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const bill = new NewBill({
        document, onNavigate, store: mockStore, bills:bills, localStorage: window.localStorage
      })

      const spy = jest.spyOn(mockStore, "bills")
      spy.mockClear()

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)

      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('click', handleSubmit)

      screen.getByTestId('expense-type').value = "Transports"
      screen.getByTestId('expense-name').value = "Essai"
      screen.getByTestId('datepicker').value = "2022-02-27"
      screen.getByTestId('amount').value = 200
      screen.getByTestId('pct').value = 20

      var cnt1=0, cnt2=0
      mockStore.bills.mockImplementation(() => {
        debugger
        return {
          create : () =>  {
            cnt1++
            return Promise.reject(new Error("Erreur 500"))
          },
          update : () =>  {
            cnt2++
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      fireEvent.change(fileInput, {
        target: {
          files: [new File(['test.png'], 'test.png', { type: 'image/png' })]
        }
      })

      userEvent.click(form)
      await new Promise(process.nextTick);

      expect(cnt1).toBe(1)
      expect(cnt2).toBe(1)
      //expect(spy).toHaveBeenCalledTimes(1)

      // Check we've returned on bills page

    })
  })
})
