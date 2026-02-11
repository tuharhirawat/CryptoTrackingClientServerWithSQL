import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const News = () => {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'cryptocurrency',
            sortBy: 'publishedAt',
            pageSize: 30,
            apiKey: '06ef5516cde44ce18d1155439de795d0',
          },
        });
        setNews(response.data.articles || []);
      } catch {
        setError('Error fetching news');
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoNews();
  }, []);

  return (
    <PageContainer>
      <Overlay>
        <NewsContainer>
          <Title>Latest Cryptocurrency News</Title>

          {loading && <Message>Loading news...</Message>}
          {error && <Message>{error}</Message>}

          {!loading && !error && (
            <>
              <NewsList>
                {news.slice(0, visibleCount).map((article, index) => (
                  <NewsItem key={index}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.urlToImage && (
                        <NewsImage src={article.urlToImage} alt={article.title} />
                      )}
                      <NewsContent>
                        <NewsTitle>{article.title}</NewsTitle>
                        <NewsDescription>
                          {article.description || 'No description available'}
                        </NewsDescription>
                        <NewsSource>Source: {article.source?.name}</NewsSource>
                      </NewsContent>
                    </a>
                  </NewsItem>
                ))}
              </NewsList>

              {visibleCount < news.length && (
                <ViewMoreWrapper>
                  <ViewMoreButton onClick={() => setVisibleCount(v => v + 8)}>
                    View More
                  </ViewMoreButton>
                </ViewMoreWrapper>
              )}
            </>
          )}
        </NewsContainer>
      </Overlay>
    </PageContainer>
  );
};

export default News;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const NewsContainer = styled.div`
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
`;

const Title = styled.h2`
  text-align: center;
  color: #fff;
  font-size: 2rem;
  margin-bottom: 40px;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #fff;
`;

const NewsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const NewsItem = styled.div`
  background: rgba(235, 230, 200, 0.18);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  a {
    text-decoration: none;
    color: white;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NewsTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 10px;
`;

const NewsDescription = styled.p`
  font-size: 0.85rem;
  margin-bottom: 10px;
`;

const NewsSource = styled.span`
  font-size: 0.7rem;
`;

const ViewMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0;
`;

const ViewMoreButton = styled.button`
  padding: 10px 28px;
  font-size: 1rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  background: gold;
  color: #000;
  font-weight: 600;
`;
