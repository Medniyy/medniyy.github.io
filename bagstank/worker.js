// Cloudflare Worker для bags.fm Shark Tank
// Deploy: wrangler deploy

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Fetch от Helius (ЗАМЕНИ НА СВОЙ API KEY)
      const HELIUS_KEY = 'YOUR_HELIUS_API_KEY_HERE';
      const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;
      
      // bags.fm program ID (НУЖНО НАЙТИ РЕАЛЬНЫЙ)
      const BAGS_PROGRAM = 'BagsProgram1111111111111111111111111111111';
      
      // Get recent program transactions
      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getProgramAccounts',
          params: [
            BAGS_PROGRAM,
            {
              encoding: 'jsonParsed',
              filters: [
                { dataSize: 165 } // Token account size
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('RPC call failed');
      }

      const data = await response.json();
      
      // Parse tokens (SIMPLIFIED - нужна настоящая логика парсинга)
      const tokens = parseTokens(data.result || []);
      
      return new Response(JSON.stringify(tokens), {
        headers: corsHeaders
      });

    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback на demo данные
      const demoTokens = [
        {
          name: "MOONCAT",
          symbol: "MOON",
          mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
          liquidity: 45000,
          holders: 342,
          marketCap: 125000,
          launchTime: "2 hours ago"
        },
        {
          name: "DEGENAPE",
          symbol: "DAPE",
          mint: "9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i",
          liquidity: 12000,
          holders: 89,
          marketCap: 38000,
          launchTime: "45 minutes ago"
        }
      ];
      
      return new Response(JSON.stringify(demoTokens), {
        headers: corsHeaders
      });
    }
  }
};

function parseTokens(accounts) {
  // TODO: Implement real parsing logic based on bags.fm structure
  // This is a placeholder - you need to decode the actual account data
  
  const tokens = accounts.slice(0, 10).map((acc, idx) => {
    // Extract mint address from account
    const mint = acc.pubkey || `Token${idx}`;
    
    // Placeholder data - replace with actual parsing
    return {
      name: `TOKEN${idx}`,
      symbol: `TKN${idx}`,
      mint: mint,
      liquidity: Math.floor(Math.random() * 100000) + 10000,
      holders: Math.floor(Math.random() * 500) + 50,
      marketCap: Math.floor(Math.random() * 500000) + 50000,
      launchTime: `${Math.floor(Math.random() * 24)} hours ago`
    };
  });
  
  return tokens;
}