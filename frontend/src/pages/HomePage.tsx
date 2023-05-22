import React, { useState, type FC } from 'react';
import axios from 'axios';
import { ISearchResponse } from '../types';

import { Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { API } from '../consts';
import { ENV } from '../utils';

interface ImageWithSubtitleProps {
  src: string;
  title: string;
  artist: string;
  alt?: string;
  duration: string;
  id: number;
}

const ImageWithSubtitle: React.FC<ImageWithSubtitleProps> = ({
  src,
  title,
  artist,
  alt,
  duration,
  id,
}) => {
  return (
    <div className="col-md-3 mb-5">
      <Link to={'/artist/' + id}>
        <img src={src} alt={alt} />
      </Link>
      <p className="mb-0">{duration}</p>
      <p className="mb-0">
        <b>{title}</b>
      </p>
      By <span>{artist}</span>
    </div>
  );
};

const Home: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResponse, setSearchResponse] = useState<
    ISearchResponse[] | undefined
  >();

  const BASE_URL = API[ENV()];
  console.log(BASE_URL);

  const fetchData = async () => {
    try {
      const { data } = await axios.get<ISearchResponse[] | undefined>(
        `${BASE_URL}/search?query=${searchValue}`
      );
      console.log(data);

      setSearchResponse(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="App">
      <header className="App-header text-center h4 pb-5 mb-5">
        Music search
      </header>
      <div className="content">
        <div className="container">
          <section className="section">
            <Form className="d-flex" onSubmit={handleSearch}>
              <FormControl
                type="text"
                placeholder="Search"
                className="me-2"
                value={searchValue}
                onChange={handleChange}
              />
              <Button variant="outline-primary" onClick={handleSearch}>
                Search
              </Button>
            </Form>
          </section>
          <br />

          {searchResponse && (
            <section className="section">
              <div className="row">
                {searchResponse?.map((res, index) => (
                  <ImageWithSubtitle
                    src={res.picture}
                    title={res.album}
                    artist={res.artist}
                    duration={res.duration}
                    key={`track-${res.id}-${index}`}
                    id={res.id}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
