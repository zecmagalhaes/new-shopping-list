# Lista de Compras

Uma aplicação web simples para gerenciar sua lista de compras, desenvolvida com HTML, CSS e JavaScript puro.

## Funcionalidades

- Adicionar itens à lista com nome, quantidade e preço
- Marcar itens como comprados
- Remover itens da lista
- Calcular o total da compra
- Salvar histórico de compras
- Visualizar detalhes de compras anteriores
- Selecionar múltiplos itens para remoção
- Selecionar múltiplas compras no histórico
- Formatação automática de valores monetários
- Conversão automática de texto para maiúsculas no nome do item
- Foco automático no campo de nome após adicionar um item
- Interface responsiva e moderna
- Suporte a PWA (Progressive Web App)

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- IndexedDB para armazenamento local
- Service Workers para funcionalidade offline

## Como Usar

1. Digite o nome do item no campo de texto (será convertido automaticamente para maiúsculas)
2. Digite a quantidade desejada
3. Digite o preço do item
4. Clique no botão de adicionar ou pressione Enter
5. Para remover um item, marque-o e clique no botão de lixeira
6. Para finalizar a compra, clique em "Finalizar Compra"
7. Para ver o histórico, clique em "Histórico"

## Instalação

1. Clone este repositório
2. Abra o arquivo `index.html` em seu navegador
3. Para instalar como PWA, clique no ícone de instalação que aparecerá na barra de endereços

## Estrutura do Projeto

```
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── icons/
│       ├── icon delete.svg
│       └── icon plus.svg
└── README.md
```

## Contribuição

Sinta-se à vontade para contribuir com o projeto! Você pode:

1. Fazer um fork do repositório
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Link do Projeto: [https://zecmagalhaes.github.io/new-shopping-list/](https://zecmagalhaes.github.io/new-shopping-list/)
