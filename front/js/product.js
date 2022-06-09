function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket))
  }

  function getBasket() {
    let basket = localStorage.getItem("basket")
    if (basket == null) {
      return [];
    } else {
      return JSON.parse(basket)
    }
  }

  function addBasket(id, option, quantity) {
    let basket = getBasket()
    let foundProduct = basket.find(p => p.id == id && p.option == option)
    if (foundProduct != undefined) {
      foundProduct.quantity++
    } else {
      basket.push({id:id,option:option,quantity:quantity})
    }
    saveBasket(basket)
  }

  function addContactBasket(contact){
    let basket = getBasket()
    basket.push({prenom:contact.prenom,nom:contact.nom,addresse:contact.addresse,ville:contact.ville,email:contact.email})
    saveBasket(basket)
  }

  function removeFromBasket(id, option) {
    let basket = getBasket()
    basket = basket.filter(p => p.id != id && p.option != option)
    saveBasket(basket)
  }

  function changeQuantity(id, option, quantity) {
    let basket = getBasket()
    let foundProduct = basket.find(p => p.id == id && p.option == option)
    if (foundProduct != undefined) {
      foundProduct.quantity += quantity
      if (foundProduct.quantity <= 0) {
        removeFromBasket(foundProduct)
      } else {
        saveBasket(basket)
      }
    }
  }

  function getNumberProduct() {
    let basket = getBasket()
    let number = 0
    for (product of basket) {
      number += product.quantity
    }
    return number
  }



  function getTotalPrice() {
    let basket = getBasket()
    let total = 0
    for (obj of json) {
    }
  }

  