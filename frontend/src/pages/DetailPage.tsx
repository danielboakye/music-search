import { useState, type FC, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams } from 'react-router-dom';
import { ROUTE } from '../routes';
import './Style.css';
import { API } from '../consts';
import { ENV, FormatNumber } from '../utils';

interface AlbumProps {
  src: string;
  title: string;
  year: string;
  alt?: string;
}

const Album: React.FC<AlbumProps> = ({ src, title, year, alt }) => {
  return (
    <div className="col-md-3 mb-5">
      <img src={src} alt={alt} />
      <p className="mb-0">
        <b>{title}</b>
      </p>
      <p className="mb-0">{year}</p>
    </div>
  );
};

const DetailPage: FC = () => {
  const [searchResponse, setSearchResponse] = useState<any>();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setLoading] = useState(false);

  const BASE_URL = API[ENV()];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/artist/${id}`);
      setSearchResponse(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <header className="App-header text-center h4 pb-5 mb-5">
        <Link
          to={ROUTE.HOME}
          style={{
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bolder',
          }}
        >
          {isLoading ? <span>Loading...</span> : <span>View</span>}
        </Link>
      </header>
      <div className="content">
        <div className="container" style={{ border: '15px solid #f1f1f1' }}>
          {searchResponse && (
            <section className="section">
              <div
                className="row"
                style={{
                  borderBottom: '10px solid #f1f1f1',
                  paddingTop: '10px',
                }}
              >
                <div className="col-md-8 img-container">
                  <img
                    src={searchResponse?.picture}
                    alt={searchResponse?.name}
                    width="100%"
                    className="img-responsive"
                  />
                  <div className="img-txt-centered">
                    <h1>{searchResponse?.name}</h1>
                    <p>
                      <b>{FormatNumber(searchResponse?.fans)}</b> fans
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <h1 style={{ marginTop: '25px' }}>Top tracks</h1>
                  <ol className="custom-list">
                    {searchResponse?.topTracks?.map(
                      (track: any, index: any) => (
                        <li key={`top-${track?.title}-${index}`}>
                          {track?.title}
                          <span>{track?.duration}</span>
                        </li>
                      )
                    )}
                  </ol>
                </div>
              </div>
              <div className="row">
                <div className="col-md-10 offset-md-1">
                  <h1 style={{ marginTop: '1em' }}>Albums</h1>
                  {searchResponse?.albums && (
                    <section className="section">
                      <div className="row">
                        {searchResponse?.albums?.map((res: any, index: any) => (
                          <Album
                            src={res.picture}
                            title={res.name}
                            year={res.releaseYear}
                            key={`album-${res.id}-${index}`}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
