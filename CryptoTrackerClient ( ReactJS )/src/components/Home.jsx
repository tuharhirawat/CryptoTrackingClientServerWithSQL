import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Select from "react-select";

import {
  getMarketCoins,
  getSupportedCurrencies,
  getCurrencySymbol,
} from "../services/cryptoDataService";

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "rgba(235, 230, 200, 0.18)",
    borderColor: "#333",
    boxShadow: "none",
    minHeight: "42px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  input: (base) => ({
    ...base,
    color: "#fff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#aaa",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111",
    border: "1px solid #333",
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: "#111",
    padding: 0,
    maxHeight: "260px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "gold"
      : state.isFocused
      ? "#222"
      : "#111",
    color: state.isSelected ? "#000" : "#fff",
    cursor: "pointer",
    padding: "10px 12px",
  }),
};

const Home = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("usd");
  const [currencies, setCurrencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const COINS_PER_PAGE = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await getSupportedCurrencies();
      setCurrencies(data);
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      const data = await getMarketCoins(currency);
      setCoins(data);
      setLoading(false);
    };
    fetchCoins();
  }, [currency]);

  const currencyOptions = useMemo(
    () =>
      currencies.map((c) => ({
        value: c,
        label: c.toUpperCase(),
      })),
    [currencies]
  );

  const indexOfLastCoin = currentPage * COINS_PER_PAGE;
  const indexOfFirstCoin = indexOfLastCoin - COINS_PER_PAGE;
  const currentCoins = coins.slice(indexOfFirstCoin, indexOfLastCoin);
  const floatingCoins = coins.slice(0, 50);

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <>
      <GlobalStyle />

      <HomeContainer>
        <HomeHeader>
          <h1>Welcome to Crypto Tracker</h1>
        </HomeHeader>

        <HomeMarquee>
          <HomeMarqueeTrack>
            {[...floatingCoins, ...floatingCoins].map((coin, i) => (
              <HomeMarqueeItem
                key={`${coin.id}-${i}`}
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <img src={coin.image} alt={coin.name} />
                <span>{coin.symbol.toUpperCase()}</span>
                <strong>
                  {currencySymbol}
                  {coin.current_price?.toFixed(2)}
                </strong>
              </HomeMarqueeItem>
            ))}
          </HomeMarqueeTrack>
        </HomeMarquee>

        <HomeControls>
          <CurrencySelect
            options={currencyOptions}
            value={currencyOptions.find((o) => o.value === currency)}
            onChange={(opt) => {
              setCurrentPage(1);
              setCurrency(opt.value);
            }}
            isSearchable
            placeholder="Select currency"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={selectStyles}
          />
        </HomeControls>

        <HomeTableWrapper>
          {loading ? (
            <HomeLoader>Loading market data…</HomeLoader>
          ) : (
            <HomeCoinsTable>
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Price Change (24h)</th>
                  <th>Market Cap</th>
                  <th>Current Price</th>
                </tr>
              </thead>
              <tbody>
                {currentCoins.map((coin) => (
                  <tr key={coin.id}>
                    <td className="coin">
                      <img src={coin.image} alt={coin.name} />
                      <span>{coin.name}</span>
                    </td>
                    <td
                      className={
                        coin.price_change_percentage_24h >= 0 ? "up" : "down"
                      }
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td>
                      {currencySymbol}
                      {coin.market_cap?.toLocaleString()}
                    </td>
                    <td>
                      {currencySymbol}
                      {coin.current_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </HomeCoinsTable>
          )}
        </HomeTableWrapper>

        <HomePagination>
          {[1, 2, 3, 4, 5].map((p) => (
            <button
              key={p}
              className={p === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
        </HomePagination>
      </HomeContainer>
    </>
  );
};

export default Home;

const GlobalStyle = createGlobalStyle`
  body {
    color: #fff;
  }

  @keyframes homeScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 40px;
`;

const HomeHeader = styled.div`
  text-align: center;
  padding: 50px 20px;

  h1 {
    font-size: 2.8rem;
    color: gold;
  }
`;

const HomeMarquee = styled.div`
  overflow: hidden;
  padding: 20px 0;
`;

const HomeMarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  animation: homeScroll 150s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const HomeMarqueeItem = styled.div`
  width: 110px;
  margin: 0 18px;
  text-align: center;
  cursor: pointer;

  img {
    width: 66px;
    height: 66px;
  }

  span {
    display: block;
    margin-top: 4px;
    font-size: 0.95rem;
    font-weight: bold;
    color: #aaa;
  }

  strong {
    color: gold;
    font-size: 0.95rem;
  }
`;

const HomeControls = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`;

const CurrencySelect = styled(Select)`
  width: 260px;
  margin: 40px;
`;

const HomeTableWrapper = styled.div`
  width: 85%;
  margin: auto;
`;

const HomeCoinsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: rgba(235, 230, 200, 0.18);
    padding: 14px;
    color: gold;
  }

  td {
    padding: 14px;
    text-align: center;
    border-bottom: 1px solid #222;
  }

  .coin {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .up {
    color: #00ff99;
  }

  .down {
    color: #ff4d4d;
  }
`;

const HomePagination = styled.div`
  margin-top: 30px;
  text-align: center;

  button {
    margin: 0 6px;
    padding: 8px 14px;
    background: #111;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  .active {
    background: gold;
    color: black;
  }
`;

const HomeLoader = styled.div`
  text-align: center;
  padding: 40px;
  color: #aaa;
`;
