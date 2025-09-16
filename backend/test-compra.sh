#!/bin/bash

# Script para testar a compra de produtos
# Cores para melhor visualização
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3333"

echo -e "${BLUE}========== TESTE DE COMPRA DE PRODUTOS ==========${NC}"

# 1. Login do usuário
echo -e "\n${BLUE}1. Fazendo login do usuário...${NC}"
USER_LOGIN=$(curl -s -X POST "${API_URL}/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }')

# Extrair o token do usuário
USER_TOKEN=$(echo $USER_LOGIN | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USER_TOKEN" ]; then
  echo -e "${RED}Falha ao obter token de usuário!${NC}"
  echo "Resposta completa:"
  echo "$USER_LOGIN"
  exit 1
else
  echo -e "${GREEN}Login de usuário bem-sucedido!${NC}"
  echo "Token: ${USER_TOKEN:0:15}..."
fi

# 2. Login da instituição
echo -e "\n${BLUE}2. Fazendo login da instituição...${NC}"
INSTITUTION_LOGIN=$(curl -s -X POST "${API_URL}/institutions/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "uece@example.com",
    "password": "123456"
  }')

# Extrair o token da instituição
INSTITUTION_TOKEN=$(echo $INSTITUTION_LOGIN | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$INSTITUTION_TOKEN" ]; then
  echo -e "${RED}Falha ao obter token de instituição!${NC}"
  echo "Resposta completa:"
  echo "$INSTITUTION_LOGIN"
  exit 1
else
  echo -e "${GREEN}Login de instituição bem-sucedido!${NC}"
  echo "Token: ${INSTITUTION_TOKEN:0:15}..."
fi

# 3. Criar um produto para teste
echo -e "\n${BLUE}3. Criando um produto de teste...${NC}"
CREATE_PRODUCT=$(curl -s -X POST "${API_URL}/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${INSTITUTION_TOKEN}" \
  -d '{
    "name": "Produto Teste Script",
    "price": 1000,
    "isInternal": false,
    "description": "Produto criado para teste de compra"
  }')

# Extrair o ID do produto
PRODUCT_ID=$(echo $CREATE_PRODUCT | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PRODUCT_ID" ]; then
  echo -e "${RED}Falha ao criar produto!${NC}"
  echo "Resposta completa:"
  echo "$CREATE_PRODUCT"
  exit 1
else
  echo -e "${GREEN}Produto criado com sucesso!${NC}"
  echo "ID do Produto: $PRODUCT_ID"
fi

# 4. Tentar comprar o produto
echo -e "\n${BLUE}4. Comprando o produto...${NC}"
PURCHASE=$(curl -s -X POST "${API_URL}/purchases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -d "{
    \"productId\": \"${PRODUCT_ID}\"
  }")

echo "Resposta da tentativa de compra:"
echo "$PURCHASE"

if echo "$PURCHASE" | grep -q "Purchase created successfully"; then
  echo -e "\n${GREEN}COMPRA REALIZADA COM SUCESSO!${NC}"
else
  echo -e "\n${RED}FALHA NA COMPRA DO PRODUTO!${NC}"
  
  # Mostrar detalhes adicionais do erro
  ERROR=$(echo $PURCHASE | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  if [ ! -z "$ERROR" ]; then
    echo -e "Erro: $ERROR"
  fi
fi

# 5. Verificar compras do usuário
echo -e "\n${BLUE}5. Listando compras do usuário...${NC}"
USER_PURCHASES=$(curl -s -X GET "${API_URL}/purchases" \
  -H "Authorization: Bearer ${USER_TOKEN}")

echo "$USER_PURCHASES"

echo -e "\n${BLUE}========== TESTE CONCLUÍDO ==========${NC}"