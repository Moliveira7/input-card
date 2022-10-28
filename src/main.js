import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")




function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    defaul: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// security code 
const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }

  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// Logica dos cartões

  // VISA
  // inicia com 4, seguido de mais 15 dígitos
  // exemplo :   4234234423432344

  //  MASTERCARD
  // inicia com 5, seguido de um dígito entre 1 e 5, seguido de mais 2 dígitos
  //  ou
  // inicia com 22, seguido de um dígito entre 2 e 9, seguido de mais 1 dígito

  // ou
  // inicia com 2, seguido de um dígito entre 3 e 7, seguido de mais 2 dígitos, seguido de mais 12 dígitos
  // exemplo: 5353535353535353
  //          2323232323232323
  //          2234344655455664
  
  const cardNumber = document.querySelector("#card-number")
  const cardNumberPattern = {
    mask: [
      {
        mask: "0000 0000 0000 0000",
        cardtype: "visa",
        regex:/^4\d{0,15}/,
      },
      {
        mask: "0000 0000 0000 0000",
        cardtype: "mastercard",
        regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      },
      {
        mask: "0000 0000 0000 0000",
        cardtype: "default",
      },
    ],
    dispatch: function (appended, dynamicMasked) {
      const number = (dynamicMasked.value + appended).replace(/\D/g, "")
      const foundMask = dynamicMasked.compiledMasks.find(function (item) {
        return number.match(item.regex)
      })      

      return foundMask
    },
  }

  const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

  const addButton = document.querySelector("#add-card")
  addButton.addEventListener("click", () => {
    alert("Cartão adicionado")
  })
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
  })

  const cardHolder = document.querySelector("#card-holder")
  cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
  })
  securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);

  })

  function updateSecurityCode(code){
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = code.length === 0 ? "0000" : code
  }

  cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)

  })

  function updateCardNumber(number){
    const ccNumber = document.querySelector(".cc-number")
    console.log(number.length);
    ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number
  }
  expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)

  })
  function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "00/00" : date
  }
