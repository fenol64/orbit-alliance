#!/bin/bash

# Definir cores para output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m" # No Color

# URL base da API
API_URL="http://localhost:3333"

echo -e "${YELLOW}======== TESTE DE COMPRA DE PRODUTOS ========${NC}"
echo ""

# 1. Login do usuário
echo -e "${YELLOW}1. Login do usuário${NC}"
USER_LOGIN_RESPONSE=$(curl -s -X POST $API_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }')

USER_TOKEN=$(echo $USER_LOGIN_RESPONSE | jq -r '.data.token')

if [ -z "$USER_TOKEN" ] || [ "$USER_TOKEN" == "null" ]; then
  echo -e "${RED}Falha no login do usuário!${NC}"
  echo $USER_LOGIN_RESPONSE
  exit 1
else
  echo -e "${GREEN}Login do usuário realizado com sucesso!${NC}"
  echo "Token: ${USER_TOKEN:0:15}..."
  USER_ID=$(echo $USER_LOGIN_RESPONSE | jq -r '.data.user.id')
  echo "User ID: $USER_ID"
fi

echo ""

# 2. Login da instituição
echo -e "${YELLOW}2. Login da instituição${NC}"
INST_LOGIN_RESPONSE=$(curl -s -X POST $API_URL/institutions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "uece@example.com",
    "password": "123456"
  }')

INST_TOKEN=$(echo $INST_LOGIN_RESPONSE | jq -r '.data.token')
INSTITUTION_ID=$(echo $INST_LOGIN_RESPONSE | jq -r '.data.institution.id')

if [ -z "$INST_TOKEN" ] || [ "$INST_TOKEN" == "null" ]; then
  echo -e "${RED}Falha no login da instituição!${NC}"
  echo $INST_LOGIN_RESPONSE
  exit 1
else
  echo -e "${GREEN}Login da instituição realizado com sucesso!${NC}"
  echo "Token: ${INST_TOKEN:0:15}..."
  echo "Institution ID: $INSTITUTION_ID"
fi

echo ""

# 3. Criar um produto público para teste
echo -e "${YELLOW}3. Criando produto público${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INST_TOKEN" \
  -d '{
    "name": "Produto Teste Público",
    "price": 1000,
    "description": "Produto para teste de compra",
    "image": "https://example.com/image.png",
    "isInternal": false
  }')

PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.data.id')

if [ -z "$PRODUCT_ID" ] || [ "$PRODUCT_ID" == "null" ]; then
  echo -e "${RED}Falha ao criar produto público!${NC}"
  echo $PRODUCT_RESPONSE
  exit 1
else
  echo -e "${GREEN}Produto público criado com sucesso!${NC}"
  echo "Product ID: $PRODUCT_ID"
fi

echo ""

# 4. Criar um produto interno para teste
echo -e "${YELLOW}4. Criando produto interno${NC}"
INTERNAL_PRODUCT_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INST_TOKEN" \
  -d '{
    "name": "Produto Interno",
    "price": 500,
    "description": "Produto interno apenas para membros",
    "image": "https://example.com/internal.png",
    "isInternal": true
  }')

INTERNAL_PRODUCT_ID=$(echo $INTERNAL_PRODUCT_RESPONSE | jq -r '.data.id')

if [ -z "$INTERNAL_PRODUCT_ID" ] || [ "$INTERNAL_PRODUCT_ID" == "null" ]; then
  echo -e "${RED}Falha ao criar produto interno!${NC}"
  echo $INTERNAL_PRODUCT_RESPONSE
  exit 1
else
  echo -e "${GREEN}Produto interno criado com sucesso!${NC}"
  echo "Internal Product ID: $INTERNAL_PRODUCT_ID"
fi

echo ""

# 5. Comprar o produto público
echo -e "${YELLOW}5. Comprando produto público${NC}"
PURCHASE_RESPONSE=$(curl -s -X POST "$API_URL/purchases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{
    \"productId\": \"$PRODUCT_ID\"
  }")

PURCHASE_ID=$(echo $PURCHASE_RESPONSE | jq -r '.data.id')

if [ -z "$PURCHASE_ID" ] || [ "$PURCHASE_ID" == "null" ]; then
  echo -e "${RED}Falha ao comprar produto público!${NC}"
  echo $PURCHASE_RESPONSE
  exit 1
else
  echo -e "${GREEN}Compra do produto público realizada com sucesso!${NC}"
  echo "Purchase ID: $PURCHASE_ID"
fi

echo ""

# 6. Tentar comprar o produto interno (deve falhar se o usuário não for da instituição)
echo -e "${YELLOW}6. Tentando comprar produto interno (deve falhar)${NC}"
INTERNAL_PURCHASE_RESPONSE=$(curl -s -X POST "$API_URL/purchases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{
    \"productId\": \"$INTERNAL_PRODUCT_ID\"
  }")

INTERNAL_PURCHASE_ERROR=$(echo $INTERNAL_PURCHASE_RESPONSE | jq -r '.error')

if [ -z "$INTERNAL_PURCHASE_ERROR" ] || [ "$INTERNAL_PURCHASE_ERROR" == "null" ]; then
  echo -e "${RED}A compra do produto interno não falhou como esperado!${NC}"
  echo $INTERNAL_PURCHASE_RESPONSE
  exit 1
else
  echo -e "${GREEN}Validação funcionando: Não foi possível comprar o produto interno${NC}"
  echo "Erro: $INTERNAL_PURCHASE_ERROR"
fi

echo ""

# 7. Vincular o usuário à instituição
echo -e "${YELLOW}7. Vinculando o usuário à instituição${NC}"
LINK_RESPONSE=$(curl -s -X POST "$API_URL/institutions/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INST_TOKEN" \
  -d "{
    \"email\": \"joao@example.com\",
    \"role\": \"student\"
  }")

if [[ "$LINK_RESPONSE" == *"success"* ]]; then
  echo -e "${GREEN}Usuário vinculado com sucesso à instituição${NC}"
else
  echo -e "${YELLOW}Usuário pode já estar vinculado à instituição${NC}"
  echo $LINK_RESPONSE
fi

echo ""

# 8. Agora comprar o produto interno (deve funcionar)
echo -e "${YELLOW}8. Comprando produto interno após vinculação${NC}"
INTERNAL_PURCHASE_RESPONSE_2=$(curl -s -X POST "$API_URL/purchases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{
    \"productId\": \"$INTERNAL_PRODUCT_ID\"
  }")

INTERNAL_PURCHASE_ID=$(echo $INTERNAL_PURCHASE_RESPONSE_2 | jq -r '.data.id')

if [ -z "$INTERNAL_PURCHASE_ID" ] || [ "$INTERNAL_PURCHASE_ID" == "null" ]; then
  echo -e "${RED}Falha ao comprar produto interno após vinculação!${NC}"
  echo $INTERNAL_PURCHASE_RESPONSE_2
  exit 1
else
  echo -e "${GREEN}Compra do produto interno realizada com sucesso!${NC}"
  echo "Internal Purchase ID: $INTERNAL_PURCHASE_ID"
fi

echo ""

# 9. Listar compras do usuário
echo -e "${YELLOW}9. Listando compras do usuário${NC}"
USER_PURCHASES_RESPONSE=$(curl -s -X GET "$API_URL/purchases" \
  -H "Authorization: Bearer $USER_TOKEN")

PURCHASES_COUNT=$(echo $USER_PURCHASES_RESPONSE | jq '.data | length')

if [ "$PURCHASES_COUNT" -lt 2 ]; then
  echo -e "${RED}Número incorreto de compras listadas!${NC}"
  echo $USER_PURCHASES_RESPONSE
  exit 1
else
  echo -e "${GREEN}Lista de compras do usuário obtida com sucesso!${NC}"
  echo "Número de compras: $PURCHASES_COUNT"
  echo "IDs das compras:"
  echo $USER_PURCHASES_RESPONSE | jq '.data[].id'
fi

echo ""

# 10. Listar compras da instituição
echo -e "${YELLOW}10. Listando compras da instituição${NC}"
INST_PURCHASES_RESPONSE=$(curl -s -X GET "$API_URL/institutions/purchases" \
  -H "Authorization: Bearer $INST_TOKEN")

INST_PURCHASES_COUNT=$(echo $INST_PURCHASES_RESPONSE | jq '.data | length')

if [ "$INST_PURCHASES_COUNT" -lt 2 ]; then
  echo -e "${RED}Número incorreto de compras da instituição!${NC}"
  echo $INST_PURCHASES_RESPONSE
  exit 1
else
  echo -e "${GREEN}Lista de compras da instituição obtida com sucesso!${NC}"
  echo "Número de compras da instituição: $INST_PURCHASES_COUNT"
  echo "IDs das compras da instituição:"
  echo $INST_PURCHASES_RESPONSE | jq '.data[].id'
fi

echo ""
echo -e "${GREEN}=========== TODOS OS TESTES PASSARAM! ============${NC}"