# Varandas Pastelaria

Aplicação web com Next.js 15, TypeScript e Tailwind CSS para cardápio digital de pastelaria.

## Funcionalidades

- Lista de produtos agrupados por categorias
- Carrinho de compras com total automático
- Checkout com nome, tipo de pedido e observação
- Envio do pedido para WhatsApp via link `wa.me`
- Layout mobile-first e interface simples

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra o app em `http://localhost:3000`

## Observações

- O app não usa backend; todos os produtos vêm do arquivo local `data/products.json`.
- Atualize `phoneNumber` em `components/CheckoutPanel.tsx` para usar o número do WhatsApp da sua pastelaria.
