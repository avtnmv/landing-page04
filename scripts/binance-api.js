const tokens = {
  btc: { symbol: 'BTCUSDT', supply: 19500000 },
  eth: { symbol: 'ETHUSDT', supply: 120000000 },
  bnb: { symbol: 'BNBUSDT', supply: 153856150 },
  sol: { symbol: 'SOLUSDT', supply: 442000000 },
  usdc: { symbol: 'USDCUSDT', supply: 32000000000 },
  xrp: { symbol: 'XRPUSDT', supply: 54253844563 }
};

function updateElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function updateElementClass(id, positive) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove(
      'markets__col-value--positive',
      'markets__col-value--negative',
      'markets__mobile-value--positive',
      'markets__mobile-value--negative'
    );
    const suffix = id.includes('-mob') ? 'markets__mobile-value--' : 'markets__col-value--';
    el.classList.add(`${suffix}${positive ? 'positive' : 'negative'}`);
  }
}

function updateTrendIcon(id, positive) {
  const container = document.getElementById(`trend-${id}`);
  if (container) {
    const posIcon = container.querySelector('.markets__col-graf-positive');
    const negIcon = container.querySelector('.markets__col-graf-negative');

    if (posIcon && negIcon) {
      posIcon.style.display = positive ? 'inline' : 'none';
      negIcon.style.display = positive ? 'none' : 'inline';
    }
  }
}

async function updateAllMarkets() {
  for (const [key, { symbol, supply }] of Object.entries(tokens)) {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const data = await res.json();

      const price = parseFloat(data.lastPrice);
      const change = parseFloat(data.priceChangePercent);
      const volume = parseFloat(data.quoteVolume);
      const marketCap = price * supply;

      const priceStr = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const changeStr = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
      const volumeStr = `${(volume / 1e9).toFixed(3)}B`;
      const marketCapStr = `${(marketCap / 1e12).toFixed(3)}T`;

      ['','-mob'].forEach(suffix => {
        updateElementText(`price-${key}${suffix}`, priceStr);
        updateElementText(`change-${key}${suffix}`, changeStr);
        updateElementText(`volume-${key}${suffix}`, volumeStr);
        updateElementText(`marketcap-${key}${suffix}`, marketCapStr);
        updateElementClass(`change-${key}${suffix}`, change >= 0);
      });

      updateTrendIcon(key, change >= 0);

    } catch (err) {
      console.error(`Error loading ${symbol}:`, err);
    }
  }
}

function updateTrendIcon(id, positive) {
  // Десктоп
  const desktopContainer = document.getElementById(`trend-${id}`);
  if (desktopContainer) {
    const posIcon = desktopContainer.querySelector('.markets__col-graf-positive');
    const negIcon = desktopContainer.querySelector('.markets__col-graf-negative');
    if (posIcon && negIcon) {
      posIcon.style.display = positive ? 'inline' : 'none';
      negIcon.style.display = positive ? 'none' : 'inline';
    }
  }

  // Мобильная версия
  const mobileContainer = document.getElementById(`trend-${id}-mob`);
  if (mobileContainer) {
    const posIconMob = mobileContainer.querySelector('.markets__col-graf-positive');
    const negIconMob = mobileContainer.querySelector('.markets__col-graf-negative');
    if (posIconMob && negIconMob) {
      posIconMob.style.display = positive ? 'inline' : 'none';
      negIconMob.style.display = positive ? 'none' : 'inline';
    }
  }
}


updateAllMarkets();
setInterval(updateAllMarkets, 1000);
