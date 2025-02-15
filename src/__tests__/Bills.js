/**
 * @jest-environment jsdom
 */

import mockStore from "../__mocks__/store"
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import '@testing-library/jest-dom/extend-expect'
import '../assets/bootstrap/bootstrap.bundle.js'

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(screen.getByTestId('icon-window').classList.contains('active-icon')).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then I must have access to 'Nouvelle Note de frais' Button", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      // test si data-testid="btn-new-bill" est présent

      waitFor(() => screen.getByTestId('btn-new-bill').toBeTruthy())

      // Si on clique le boutn, on doit aller vers la page newbill
      const newBill = screen.getByTestId('btn-new-bill')
      newBill.click()
      waitFor(() => screen.getByText(/Nouvelle note de frais/).toBeTruthy())
    })
    test("If i click on icon eye, I should see attachment", async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const bills = new Bills({ document, onNavigate, store: mockStore, localStorageMock  })
      bills.getBills().then(data => {
          document.body.innerHTML = BillsUI({ data })
          new Bills({ document, onNavigate, store: mockStore, localStorageMock })
      })
      // const myBills = new Bills({document, onNavigate, store: mockStore, localStorageMock})

      const icon = document.querySelector('div[data-testid="icon-eye"]')
      const modal = document.querySelector('#modaleFile')

      expect(modal.classList.contains('show')).not.toBeTruthy()
      icon.click()
      await waitFor(() => expect(modal.classList.contains('show')).toBeTruthy())
    })
  })
  describe("when I arrive on bills page", () => {
    test("I got an API 404 error", async () => {

      document.body.innerHTML = ''
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const spy = jest.spyOn(mockStore, "bills")
      spy.mockClear()

      mockStore.bills.mockImplementation(() => {

        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('error-message'))
      await waitFor(() => screen.getByText(/Erreur 404/))
    })
    test("I got an API 500 error", async () => {

      document.body.innerHTML = ''
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const spy = jest.spyOn(mockStore, "bills")
      spy.mockClear()

      mockStore.bills.mockImplementation(() => {

        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('error-message'))
      await waitFor(() => screen.getByText(/Erreur 500/))
    })
  })
})
