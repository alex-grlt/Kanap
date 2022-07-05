  /**
   * Sauvegarde le panier dans le localstorage en basket
   * @returns 
   */
  function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket))
  }

  /**
   * Retourne le panier qui est sauvegardé dans le localstorage
   * @returns {JSON} basket le contenu du panier
   */
  function getBasket() {
    let basket = localStorage.getItem("basket")
    if (basket == null) {
      return [];
    } else {
      return JSON.parse(basket)
    }
  }

  /**
   * Retourne les identifiants des canapés du panier
   * @param {*} basket Nécessite le panier dans lequel on recherche les identifiants
   * @returns [] array des ID
   */
  function getBasketID(basket) {
    let ids = []
    for (canap of basket) {
      ids.push(canap.id)
    }
    return ids
  }

  /**
   * Ajoute un canape au panier
   * @param {*} id Identifiant du canapé qui souhaite être acheté
   * @param {*} option Option choisie
   * @param {*} quantity Quantité choisie
   */
  function addBasket(id, option, quantity) {
    let basket = getBasket()
    let foundProduct = basket.find(p => p.id == id && p.option == option)
    if (foundProduct != undefined) {
      foundProduct.quantity += quantity
    } else {
      basket.push({
        id: id,
        option: option,
        quantity: quantity
      })
    }
    saveBasket(basket)
  }

/**
 * Supprime l'élement du panier
 * @param {*} id Identifiant du canapé à supprimer
 * @param {*} option Option du canapé à supprimer
 */
  function removeFromBasket(id, option) {
    let basket = getBasket()
    basket = basket.filter(p => p.id != id && p.option != option)
    saveBasket(basket)
  }

/**
 * Retourne la quantité totale de produits du panier
 * @returns number du total des quantités
 */
  function getNumberProduct() {
    let basket = getBasket()
    let number = 0
    for (product of basket) {
      number += product.quantity
    }
    return number
  }

  /**
   * Créer les éléments HTML nécessaires à l'affichage de la page ainsi que les addEventListeners()
   * @param {*} data Réponse JSON du fetch
   */
  function createHTML(data) {
    const article = document.createElement("article")
    const div1 = document.createElement("div")
    const div2 = document.createElement("div")
    const div3 = document.createElement("div")
    const div4 = document.createElement("div")
    const div5 = document.createElement("div")
    const div6 = document.createElement("div")
    const img = document.createElement("img")
    const h2 = document.createElement("h2")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    const p3 = document.createElement("p")
    const p4 = document.createElement("p")
    const input = document.createElement("input")

    cart__items.appendChild(article)
    article.appendChild(div1)
    div1.appendChild(img)

    article.className = "cart__item"


    article.setAttribute("data-id", canap.id)
    article.setAttribute("data-color", canap.option)

    div1.className = "cart__item__img"

    img.src = data.imageUrl
    h2.innerHTML = data.name
    p1.innerHTML = canap.option
    p2.innerHTML = data.price + " €"


    img.alt = canap.altTxt

    article.appendChild(div2)
    div2.className = "cart__item__content"

    div2.appendChild(div3)
    div3.className = "cart__item__content__description"

    div3.appendChild(h2)
    div3.appendChild(p1)
    div3.appendChild(p2)

    div2.appendChild(div4)
    div4.className = "cart__item__content__settings"

    div4.appendChild(div5)
    div5.className = "cart__item__content__settings__quantity"
    div5.appendChild(p3)
    p3.innerHTML = "Quantité : "

    div5.appendChild(input)
    input.type = "number"
    input.className = "itemQuantity"
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = canap.quantity

    div4.appendChild(div6)
    div6.className = "cart__item__content__settings__delete"
    div6.appendChild(p4)
    p4.className = "deleteItem"
    p4.innerHTML = "Supprimer"

    p4.addEventListener("click", function (evt) {
      let canapID = article.getAttribute('data-id')
      let canapOption = article.getAttribute('data-color')

      removeFromBasket(canapID, canapOption)
      location.reload();
    })

    totalQuantity.innerHTML = getNumberProduct()

    total += canap.quantity * data.price
    totalPrice.innerHTML = total
  }

  /**
   * Valide la commande en vérifiant le formulaire et retourne un numéro de commande
   */
  function sendCommand(){
    order.addEventListener("click", async function (evt) {
      let prenom = document.getElementById("firstName").value
      let nom = document.getElementById("lastName").value
      let addresse = document.getElementById("address").value
      let ville = document.getElementById("city").value
      let email = document.getElementById("email").value

      if (/^[^0-9][A-Z]*[a-z]*$/.test(prenom) == false) {
        (document.getElementById("firstNameErrorMsg")).innerHTML = "Entrez un prénom valide"
        evt.preventDefault()
      } else {
        (document.getElementById("firstNameErrorMsg")).innerHTML = ""

        if (/^[^0-9][A-Z]*[a-z]*$/.test(nom) == false) {
          (document.getElementById("lastNameErrorMsg")).innerHTML = "Entrez un nom valide"
          evt.preventDefault()
        } else {
          (document.getElementById("lastNameErrorMsg")).innerHTML = ""
          if (/.*\S.*/.test(addresse) == false) {
            (document.getElementById("addressErrorMsg")).innerHTML = "Entrez une adresse valide"
            evt.preventDefault()
          } else {
            (document.getElementById("addressErrorMsg")).innerHTML = ""
                if (/^[^0-9][A-Z]*[a-z]*$/.test(ville) == false) {
                  (document.getElementById("cityErrorMsg")).innerHTML = "Entrez une ville valide"
                  evt.preventDefault()
                } else {
                  (document.getElementById("cityErrorMsg")).innerHTML = ""
                        if (
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          .test(email) == false) {
                          (document.getElementById("emailErrorMsg")).innerHTML = "Entrez un email valide"
                          evt.preventDefault()
                        } else {
                          (document.getElementById("emailErrorMsg")).innerHTML = ""

                          let result = await fetch("http://localhost:3000/api/products/order", {
                              method: "POST",
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                contact: {
                                  firstName: prenom,
                                  lastName: nom,
                                  address: addresse,
                                  city: ville,
                                  email: email
                                },
                                products: getBasketID(getBasket())
                              })
                            })

                            let data = await result.json()

                            document.location.href="confirmation.html?data=" + data.orderId;

                            document.querySelector(".cart__order__form").reset()

                            for(canap of getBasket()){
                            removeFromBasket(canap.id, canap.option)}

                            
                        }
                }
           }
        }
      }
    })
  }