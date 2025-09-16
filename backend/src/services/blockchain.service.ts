import * as StellarSdk from 'stellar-sdk';
import { randomBytes } from 'crypto';
import fetch, { Response } from 'node-fetch';

// Tipos personalizados
interface NFTResult {
  transaction: StellarSdk.Transaction;
  nftCode: string;
  nftAsset: StellarSdk.Asset;
}

// Gera string aleatória segura com randomBytes
// Gerador de string aleatória de 12 caracteres para NFTs
function generateRandomNFTId(length: number = 12): string {
  const neededBytes: number = Math.ceil(length / 2);
  const buf: Buffer = randomBytes(neededBytes);
  const hex: string = buf.toString('hex');
  return hex.slice(0, length);
}

// const sourcePublic: string = "GASBQRLKJLHFHOS6L4DXWQLDTAXJ3KVZTSPTFEVAFHE5M74QVPHIMPAL";
// const sourceSecret: string = "SCSWCWAH3ZOCOLTK375JMOUQ2DPKJOMDAPHGL6RNVQE5D6QNWA2UH67M";
const server: StellarSdk.Horizon.Server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

// Verifica se uma conta Stellar existe
async function checkAccountExists(publicKey: string): Promise<boolean> {
  try {
    await server.loadAccount(publicKey);
    return true;
  } catch {
    return false;
  }
}

// Função para financiar conta usando friendbot
async function fundAccountWithFriendbot(publicKey: string): Promise<boolean> {
  console.log('\n=== VERIFICANDO E FINANCIANDO CONTA ===');
  console.log('Endereço a ser verificado:', publicKey);
  
  // Primeiro, verificar se a conta já existe
  const accountExists = await checkAccountExists(publicKey);
  
  if (accountExists) {
    //console.log('✅ Conta já existe na rede Stellar Testnet');
    return true;
  }
  
  //console.log('Conta não existe. Financiando com friendbot...');
  
  try {
    const response: Response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    
    if (response.ok) {
      const result: string = await response.text();
      console.log('✅ Conta financiada com sucesso!');
      console.log('Resposta do friendbot:', result);
      return true;
    } else {
      console.error('❌ Erro ao financiar conta:', response.status, response.statusText);
      if (response.status === 400) {
        console.log('💡 A conta pode já existir. Verificando novamente...');
        return await checkAccountExists(publicKey);
      }
      return false;
    }
  } catch (error: any) {
    console.error('❌ Erro ao chamar friendbot:', error.message);
    return false;
  }
}

// Busca informações de uma conta Stellar
async function getAccountInfo(publicKey: string): Promise<StellarSdk.Horizon.AccountResponse | null> {
  try {
    const account = await server.loadAccount(publicKey);
    return account;
  } catch {
    return null;
  }
}
// Realiza transação de uma conta A para uma conta B
async function transferFunds(fromSecret: string, toPublic: string, amount: string, asset: StellarSdk.Asset = StellarSdk.Asset.native()): Promise<string | null> {
  try {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(fromSecret);
    const sourcePublic = sourceKeypair.publicKey();
    const account = await server.loadAccount(sourcePublic);
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: toPublic,
        asset,
        amount,
      }))
      .setTimeout(30)
      .build();
    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    return result.hash;
  } catch (error: any) {
    console.error('Erro na transferência:', error.message);
    return null;
  }
}
// Cria NFT personalizada
interface NFTMetadata {
  name: string;
  description: string;
  imageUrl: string;
}

async function createCustomNFT(
  issuerSecret: string,
  nftCode?: string,
  metadata?: NFTMetadata
): Promise<NFTResult | null> {
  try {
    const issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecret);
    const issuerPublic = issuerKeypair.publicKey();
    const account = await server.loadAccount(issuerPublic);
    const code = nftCode || generateRandomNFTId(12);
    const nftAsset = new StellarSdk.Asset(code, issuerPublic);
    const transactionBuilder = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    transactionBuilder.addOperation(StellarSdk.Operation.payment({
      destination: issuerPublic,
      asset: nftAsset,
      amount: '1',
    }));
    transactionBuilder.addOperation(StellarSdk.Operation.setOptions({
      masterWeight: 0,
    }));
    if (metadata) {
      transactionBuilder.addOperation(StellarSdk.Operation.manageData({
        name: `nft_${code}_name`,
        value: metadata.name,
      }));
      transactionBuilder.addOperation(StellarSdk.Operation.manageData({
        name: `nft_${code}_desc`,
        value: metadata.description,
      }));
      transactionBuilder.addOperation(StellarSdk.Operation.manageData({
        name: `nft_${code}_image`,
        value: metadata.imageUrl,
      }));
    }
    const transaction = transactionBuilder.setTimeout(30).build();
    transaction.sign(issuerKeypair);
    await server.submitTransaction(transaction);
    return { transaction, nftCode: code, nftAsset };
  } catch (error: any) {
    console.error('Erro ao criar NFT personalizada:', error.message);
    return null;
  }
}

// Função para criar transação mockada
async function createMockTransaction(account: StellarSdk.Horizon.AccountResponse): Promise<StellarSdk.Transaction> {
  console.log('\n=== TRANSAÇÃO MOCKADA ===');
  const sourceKeypair: StellarSdk.Keypair = StellarSdk.Keypair.fromSecret(sourceSecret);
  
  // Gerar conta de destino
  const destinationKeypair = StellarSdk.Keypair.random();
  const destinationPublic: string = destinationKeypair.publicKey();
  
  console.log('Origem:', sourcePublic);
  console.log('Destino:', destinationPublic);
  console.log('Valor:', '10 XLM (criando nova conta)');
  
  // No Stellar, para enviar para uma conta que não existe, 
  // você precisa usar createAccount em vez de payment
  const transaction: StellarSdk.Transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
  .addOperation(StellarSdk.Operation.createAccount({
    destination: destinationPublic,
    startingBalance: '10', // Saldo inicial mínimo (1 XLM é o mínimo)
  }))
  .setTimeout(30)
  .build();

  transaction.sign(sourceKeypair);

  try {
    console.log('Enviando transação...');
    const result = await server.submitTransaction(transaction);
    console.log('✅ Transação enviada com sucesso!');
    console.log('Hash:', result.hash);
    console.log('Ledger:', result.ledger);
    console.log('✅ Nova conta criada:', destinationPublic);
  } catch (error: any) {
    console.error('❌ Erro ao enviar transação:');
    
    if (error.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      console.error('Códigos de erro:', codes);
      
      if (codes.transaction === 'tx_failed' && codes.operations) {
        console.error('Erro na operação:', codes.operations);
        
        // Interpretar códigos de erro comuns
        if (codes.operations.includes('op_underfunded')) {
          console.error('💡 Causa provável: Saldo insuficiente para cobrir a transação + fees');
          console.error(`💡 Saldo atual: ${account.balances.find(b => b.asset_type === 'native')?.balance} XLM`);
          console.error('💡 Necessário: 10 XLM + fees (~0.0001 XLM)');
        } else if (codes.operations.includes('op_already_exists')) {
          console.error('💡 Causa provável: Conta de destino já existe (coincidência rara!)');
        }
      }
    } else {
      console.error('Erro completo:', error.response?.data || error.message);
    }
  }
  
  return transaction;
}

// Função para criar NFT de teste
async function createTestNFT(account: StellarSdk.Horizon.AccountResponse): Promise<NFTResult> {
  console.log('\n=== CRIANDO NFT DE TESTE ===');
  console.log('\n=== 1 ===');
  const sourceKeypair: StellarSdk.Keypair = StellarSdk.Keypair.fromSecret(sourceSecret);
  
  // Criar asset único para NFT
  //const nftCode = `NFT123`;
  //const nftCode = `NFT${Date.now().toString()}`;
  const date: Date = new Date();
// const hours = String(date.getHours()).padStart(2, '0');
// const minutes = String(date.getMinutes()).padStart(2, '0');
// const seconds = String(date.getSeconds()).padStart(2, '0');
// const nftCode = `NFT${hours}${minutes}${seconds}`;
const nftCode: string = generateSecureId(12);
  console.log(nftCode);
  console.log('\n=== 2 ===');
  const nftAsset: StellarSdk.Asset = new StellarSdk.Asset(nftCode, sourcePublic);
  console.log('\n=== 3 ===');
  
  const transaction: StellarSdk.Transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
  // Nota: Emissor NÃO precisa de trustline para seu próprio asset
  // Emitir 1 unidade do NFT para si mesmo
  .addOperation(StellarSdk.Operation.payment({
    destination: sourcePublic,
    asset: nftAsset,
    amount: '1',
  }))
  // Tornar o asset não-mintable (lock supply)
  .addOperation(StellarSdk.Operation.setOptions({
    masterWeight: 0, // Remove capacidade de criar mais tokens
  }))
  // Adicionar metadados NFT via manage data
  .addOperation(StellarSdk.Operation.manageData({
    name: `nft_${nftCode}_name`,
    value: 'Meu NFT de Teste',
  }))
  .addOperation(StellarSdk.Operation.manageData({
    name: `nft_${nftCode}_desc`,
    value: 'NFT criado para teste no Stellar',
  }))
  .addOperation(StellarSdk.Operation.manageData({
    name: `nft_${nftCode}_image`,
    value: 'https://via.placeholder.com/300x300.png?text=NFT+Test',
  }))
  .setTimeout(30)
  .build();

  transaction.sign(sourceKeypair);
  
  console.log('NFT Asset criado:', nftAsset);
  console.log('Código do Asset:', nftCode);
  console.log('Emissor:', sourcePublic);
  console.log('Quantidade:', '1 (único)');
  
  try {
    console.log('Enviando transação NFT para a blockchain...');
    const result = await server.submitTransaction(transaction);
    
    console.log('✅ NFT criado com sucesso na blockchain!');
    console.log('Hash da transação:', result.hash);
    console.log('Ledger:', result.ledger);
    console.log('Link da transação:', `https://horizon-testnet.stellar.org/transactions/${result.hash}`);
    console.log('XDR da transação:', transaction.toXDR());
    
    return { transaction, nftCode, nftAsset };
    
  } catch (error: any) {
    console.error('❌ Erro ao enviar transação NFT:');
    
    if (error.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      console.error('Códigos de erro:', codes);
      
      if (codes.transaction === 'tx_failed' && codes.operations) {
        console.error('Erro nas operações:', codes.operations);
        
        // Interpretar códigos de erro específicos para NFTs
        if (codes.operations.includes('op_underfunded')) {
          console.error('💡 Saldo insuficiente para as operações + fees');
        } else if (codes.operations.includes('op_low_reserve')) {
          console.error('💡 Saldo insuficiente para manter reservas mínimas');
        } else if (codes.operations.includes('op_line_full')) {
          console.error('💡 Limite da trustline atingido');
        }
      }
    } else {
      console.error('Erro completo:', error.response?.data || error.message);
    }
    
    // Retornar dados mesmo em caso de erro para debug
    console.log('Hash local (não enviado):', transaction.hash().toString('hex'));
    return { transaction, nftCode, nftAsset };
  }
}

// Função principal
async function main(): Promise<void> {
  try {
    // 0. Primeiro verificar/financiar a conta
    console.log('=== INICIANDO PROCESSO ===');
    const accountReady = await fundAccountWithFriendbot(sourcePublic);
    
    if (!accountReady) {
      console.error('❌ Não foi possível preparar a conta. Abortando...');
      return;
    }
    
    // Aguardar um pouco para que a rede processe (se houve funding)
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    // 1. Buscar informações da conta
    const account: StellarSdk.Horizon.AccountResponse = await getAccountInfo(sourcePublic);
    
    // 2. Criar transação mockada
    await createMockTransaction(account);
    
    // 3. Criar NFT de teste (descomente para testar)
    await createTestNFT(account);
    
    console.log('\n🎉 === TODAS AS OPERAÇÕES CONCLUÍDAS ===');
    
  } catch (e: any) {
    console.error('❌ Erro:', e.message);
    if (e.response?.data) {
      console.error('Detalhes do erro:', e.response.data);
    }
  }
}

main();
