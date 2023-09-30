const {clusterApiUrl, Connection, } = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

async function contructBridgeTransactionForStaking(solAmount) {
  const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');

  const walletAddress = 'YOUR_WALLET_ADDRESS';
  const bridgeAddress = 'BRIDGE_CONTRACT_ADDRESS';

  const solTokenMintAddress = 'SOL_TOKEN_MINT_ADDRESS';
  const bridgedTokenMintAddress = 'BRIDGED_TOKEN_MINT_ADDRESS';

  const stakingProgramAddress = 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So';

  const tokenAccounts = await splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    splToken.TOKEN_PROGRAM_ID,
    solTokenMintAddress,
    walletAddress
  );

  const bridgeContract = new solanaWeb3.PublicKey(bridgeAddress);
  const stakingProgram = new solanaWeb3.PublicKey(stakingProgramAddress);

  const instructions = [
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      tokenAccounts,
      bridgeContract,
      solAmount.userAddress,
      [],
      solAmount.amount
    ),
    new solanaWeb3.TransactionInstruction({
      keys: [
        { pubkey: solAmount.userAddress, isSigner: true, isWritable: false },
        { pubkey: tokenAccounts, isSigner: false, isWritable: true },
        { pubkey: new solanaWeb3.PublicKey(solTokenMintAddress), isSigner: false, isWritable: false },
        { pubkey: new solanaWeb3.PublicKey(bridgedTokenMintAddress), isSigner: false, isWritable: false },
        { pubkey: stakingProgram, isSigner: false, isWritable: true },
      ],
      programId: stakingProgram,
    }),
  ];

  const transaction = new solanaWeb3.Transaction().add(...instructions);
  transaction.feePayer = solAmount.userAddress;
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.setSigners(solAmount.userAddress);
  const signedTransaction = await solAmount.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signedTransaction.serialize());

  console.log('Transaction sent:', txid);

  return {
    success: true,
    context: `This transaction will first bridge your ${transactionData.amount} amount of WMATIC token to Avalanche blockchain and then it 
    will stake your ${transactionData.amount} token into Aave Staking contract which is avalaible on Avalanche 
    as after research we found out it is currently giving max APY (5.69%) on staked assets.`,
    transaction: [
        {
            to: solAmount.userAddress,
        },
    ]
  }
}

module.exports = { contructBridgeTransactionForStaking };
