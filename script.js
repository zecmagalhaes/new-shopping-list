// Inicialização do IndexedDB
let db
const request = indexedDB.open("QuickListDB", 1)

request.onerror = (event) => {
  console.error("Erro ao abrir o banco de dados")
}

request.onupgradeneeded = (event) => {
  db = event.target.result
  if (!db.objectStoreNames.contains("compras")) {
    const objectStore = db.createObjectStore("compras", {
      keyPath: "id",
      autoIncrement: true,
    })
    objectStore.createIndex("data", "data", { unique: false })
  }
}

request.onsuccess = (event) => {
  db = event.target.result
}

// Elementos do DOM
const input = document.querySelector(".new-item")
const addBtn = document.querySelector(".add-btn")
const ul = document.querySelector(".list-items")
const empty = document.querySelector(".empty")
const notification = document.querySelector(".notification")
const closeBtn = document.querySelector(".close-btn")
const quantityInput = document.querySelector("#itemQuantity")
const priceInput = document.querySelector("#itemPrice")
const totalValue = document.querySelector("#totalValue")
const finalizarCompraBtn = document.querySelector("#finalizarCompra")
const historicoBtn = document.querySelector("#btnHistorico")
const historicoModal = document.querySelector("#historicoModal")
const closeModalBtn = document.querySelector(".close-modal-btn")
const historicoLista = document.querySelector("#historicoLista")

let items = []
let total = 0

// Funções auxiliares
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function atualizarTotal() {
  total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  totalValue.textContent = formatarMoeda(total)
}

function salvarCompra() {
  if (items.length === 0) {
    mostrarNotificacao(
      "Adicione itens à lista antes de finalizar a compra",
      "aviso"
    )
    return
  }

  const compra = {
    items: [...items],
    total,
    data: new Date().toISOString(),
  }

  const transaction = db.transaction(["compras"], "readwrite")
  const objectStore = transaction.objectStore("compras")
  const request = objectStore.add(compra)

  request.onsuccess = () => {
    items = []
    ul.innerHTML = ""
    total = 0
    atualizarTotal()
    mostrarNotificacao("Compra salva com sucesso!", "sucesso")
  }

  request.onerror = () => {
    mostrarNotificacao("Erro ao salvar a compra", "erro")
  }
}

function carregarHistorico() {
  historicoLista.innerHTML = ""
  const transaction = db.transaction(["compras"], "readonly")
  const objectStore = transaction.objectStore("compras")
  const request = objectStore.openCursor(null, "prev")

  request.onsuccess = (event) => {
    const cursor = event.target.result
    if (cursor) {
      const compra = cursor.value
      const data = new Date(compra.data).toLocaleDateString("pt-BR")
      const div = document.createElement("div")
      div.className = "historico-item"
      div.innerHTML = `
        <span>Compra - ${formatarMoeda(compra.total)}</span>
        <span class="historico-data">${data}</span>
      `
      div.addEventListener("click", () => mostrarDetalhesCompra(compra))
      historicoLista.appendChild(div)
      cursor.continue()
    }
  }
}

function mostrarDetalhesCompra(compra) {
  const detalhesLista = document.querySelector(".detalhes-lista")
  const detalhesModal = document.getElementById("detalhesModal")
  const closeModalDetalhesBtn = detalhesModal.querySelector(".close-modal-btn")

  // Limpa a lista anterior
  detalhesLista.innerHTML = ""

  // Adiciona cada item à lista
  compra.items.forEach((item) => {
    const itemElement = document.createElement("div")
    itemElement.className = "detalhe-item"
    itemElement.textContent = `${item.text} - ${item.quantity}x ${formatarMoeda(
      item.price
    )} = ${formatarMoeda(item.price * item.quantity)}`
    detalhesLista.appendChild(itemElement)
  })

  // Adiciona o total
  const totalElement = document.createElement("div")
  totalElement.className = "detalhe-total"
  totalElement.textContent = `Total: ${formatarMoeda(compra.total)}`
  detalhesLista.appendChild(totalElement)

  // Mostra o modal
  detalhesModal.style.display = "block"

  // Fecha o modal quando clicar no botão fechar
  closeModalDetalhesBtn.addEventListener("click", () => {
    detalhesModal.style.display = "none"
  })

  // Fecha o modal quando clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === detalhesModal) {
      detalhesModal.style.display = "none"
    }
  })
}

function mostrarNotificacao(mensagem, tipo = "erro") {
  const notificationMessage = document.querySelector("#notification-message")
  notificationMessage.textContent = mensagem
  notification.style.display = "flex"

  // Define as cores baseadas no tipo de notificação
  if (tipo === "erro") {
    notification.style.backgroundColor = "var(--color-danger)"
    notification.style.boxShadow = "0 0 5px var(--color-brand)"
  } else if (tipo === "aviso") {
    notification.style.backgroundColor = "var(--content-secondary)"
    notification.style.boxShadow = "0 0 5px var(--content-tertiary)"
  } else if (tipo === "sucesso") {
    notification.style.backgroundColor = "var(--color-brand)"
    notification.style.boxShadow = "0 0 5px var(--color-brand)"
  }

  notification.classList.add("show")
  setTimeout(() => {
    notification.classList.remove("show")
    notification.style.display = "none"
  }, 3000)
}

// Event Listeners
addBtn.addEventListener("click", () => {
  const text = input.value.trim()
  const quantity = parseInt(quantityInput.value) || 1
  const price = parseFloat(priceInput.value) || 0

  if (text !== "") {
    const li = document.createElement("li")
    const idNewItemLi = ul.children.length + 1

    const item = {
      text,
      quantity,
      price,
      checked: false,
    }

    items.push(item)

    li.innerHTML = `
      <label for="item${idNewItemLi}">
        <input type="checkbox" class="checkbox" id="item${idNewItemLi}"/>
        <span class="custom-checkbox"></span>
        <span class="paragraph">${text} - ${quantity}x ${formatarMoeda(
      price
    )} = ${formatarMoeda(price * quantity)}</span>
      </label>
      <button class="delete-btn">
        <img src="assets/icons/icon delete.svg" alt="Botão de lixeira" />
      </button>
    `

    const checkbox = li.querySelector(".checkbox")
    checkbox.addEventListener("change", () => {
      item.checked = checkbox.checked
      if (item.checked) {
        li.classList.add("checked")
      } else {
        li.classList.remove("checked")
      }
    })

    const deleteBtn = li.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", () => {
      if (checkbox.checked) {
        li.remove()
        items = items.filter((i) => i !== item)
        atualizarTotal()
        mostrarNotificacao("O item foi removido da lista!", "sucesso")
      } else {
        mostrarNotificacao("Marque o item para conseguir remover", "aviso")
      }
    })

    ul.appendChild(li)
    input.value = ""
    quantityInput.value = "1"
    priceInput.value = ""
    atualizarTotal()
  }
})

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBtn.click()
  }
})

closeBtn.addEventListener("click", () => {
  notification.classList.remove("show")
})

finalizarCompraBtn.addEventListener("click", salvarCompra)

historicoBtn.addEventListener("click", () => {
  historicoModal.style.display = "block"
  carregarHistorico()
})

closeModalBtn.addEventListener("click", () => {
  historicoModal.style.display = "none"
})

window.addEventListener("click", (event) => {
  if (event.target === historicoModal) {
    historicoModal.style.display = "none"
  }
})
// Seleção múltipla
const selectAllBtn = document.querySelector("#selectall")
const removeSelectedBtn = document.querySelector("#removeallselect")

selectAllBtn.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".checkbox")
  const isAllChecked = items.every((item) => item.checked)

  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = !isAllChecked
    items[index].checked = !isAllChecked
    const li = checkbox.closest("li")
    if (li) {
      if (!isAllChecked) {
        li.classList.add("checked")
      } else {
        li.classList.remove("checked")
      }
    }
  })
})

removeSelectedBtn.addEventListener("click", () => {
  const selectedItems = document.querySelectorAll("li")
  let removedCount = 0

  selectedItems.forEach((li) => {
    const checkbox = li.querySelector(".checkbox")
    if (checkbox && checkbox.checked) {
      li.remove()
      removedCount++
    }
  })

  items = items.filter((item) => !item.checked)
  atualizarTotal()

  if (removedCount > 1) {
    mostrarNotificacao(
      `${removedCount} itens foram removidos da lista!`,
      "sucesso"
    )
  } else if (removedCount === 1) {
    mostrarNotificacao("O item foi removido da lista!", "sucesso")
  }
})

// Verificação de atualizações do PWA
if ("serviceWorker" in navigator) {
  let refreshing = false

  // Detecta quando um novo service worker assume o controle
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true
      mostrarNotificacao("Nova versão disponível! Atualizando...", "aviso")
      window.location.reload()
    }
  })

  // Verifica atualizações periodicamente
  setInterval(() => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update()
    })
  }, 1000 * 60 * 60) // Verifica a cada hora
}
