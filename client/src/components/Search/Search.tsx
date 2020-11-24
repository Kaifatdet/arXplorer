import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { subjects } from '../../services/categories';
import LoadingSpinner from '../../styleComponents/LoadingSpinner';
import { QueryFilter } from '../../types';
import './Search.css';

interface SearchProps {
  handleSearchForm: (
    title: string,
    author: string,
    journal: string,
    abstract: string,
    filters: QueryFilter
  ) => Promise<boolean>;
  loading: boolean;
  setSelectedAuthor: React.Dispatch<React.SetStateAction<string>>;
}

interface SearchState {
  [key: string]: string;
}

const Search: FunctionComponent<SearchProps> = ({
  handleSearchForm,
  loading,
  setSelectedAuthor,
}) => {
  const init: SearchState = {
    title: '',
    author: '',
    journal: '',
    abstract: '',
  };

  const filterInit: QueryFilter = {
    cs: false,
    physics: false,
    math: false,
    eess: false,
    econ: false,
    'q-bio': false,
    'q-fin': false,
    stat: false,
    'date-from': '',
    'date-to': '',
  };

  const [fields, setFields] = useState<SearchState>(init);
  const [filters, setFilters] = useState<QueryFilter>(filterInit);
  const [searchSuccess, setSearchSuccess] = useState(true);

  const history = useHistory();

  const emptyFields = (f: SearchState) => {
    return Object.values(f).every((el) => !el);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (emptyFields(fields)) {
      return undefined;
    }
    setSelectedAuthor('');
    const res = await handleSearchForm(
      fields.title,
      fields.author,
      fields.journal,
      fields.abstract,
      filters
    );
    setFields(init);
    setFilters(filterInit);
    if (res) {
      setSearchSuccess(true);
      history.push('/graph');
    } else {
      setSearchSuccess(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => {
      const newState: SearchState = { ...prev };
      newState[e.target.name] = e.target.value;
      return newState;
    });
  };

  const handleFilters = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => {
      const newState: any = { ...prev };
      const { value } = e.target;
      if (value !== 'date-from' && value !== 'date-from') {
        newState[e.target.value] = !newState[e.target.value];
      }
      return newState;
    });
  };

  const handleDatePicker = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => {
      const newState: any = { ...prev };
      newState[e.target.name] = new Date(e.target.value);
      return newState;
    });
  };

  const surprise = () => {
    const appClass = document.getElementsByClassName('App')[0].classList;
    appClass.length === 1
      ? appClass.add('wrapper')
      : appClass.remove('wrapper');
  };

  return (
    <>
      <div className="search-header">
        <p className="lulz">S</p>
        <p className="lulz">e</p>
        <p className="lulz">a</p>
        <p className="lulz" onClick={surprise}>
          r
        </p>
        <p className="lulz">c</p>
        <p className="lulz">h</p>
      </div>
      <div className="search-form-container">
        <form className="search-form" onSubmit={handleSubmit}>
          {Object.keys(fields).map((field) => (
            <div key={field} className={`search-${field}`}>
              <label
                htmlFor={`search-input-${field}`}
                className={`search-label-${field}`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                id={`search-input-${field}`}
                name={field}
                className={`search-input-${field}`}
                value={fields[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <input type="submit" className="search-submit" value="Search" />
        </form>
        <div className="search-filters">
          <div className="search-filter-date-picker">
            <h3>Publication date</h3>
            <div data-testid="date-picker" className="date-picker-container">
              <div>
                <label htmlFor="date-from" style={{ marginRight: '1rem' }}>
                  From:{' '}
                </label>
                <input
                  type="date"
                  className="date-picker"
                  name="date-from"
                  id="date-from"
                  onChange={handleDatePicker}
                />
              </div>
              <div>
                <label htmlFor="date-to" style={{ marginRight: '1rem' }}>
                  {' '}
                  to:
                </label>
                <input
                  type="date"
                  className="date-picker"
                  name="date-to"
                  id="date-to"
                  onChange={handleDatePicker}
                />
              </div>
            </div>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Subject</h3>
          <div className="search-filter-categories">
            {Object.keys(subjects).map((cat, i) => (
              <div key={cat} className="subject-container">
                <label className="switch">
                  <input
                    data-testid={`slider${i}`}
                    id={`checkbox${i}`}
                    type="checkbox"
                    value={cat}
                    onChange={handleFilters}
                  />
                  <span className="slider round"></span>
                </label>
                <label htmlFor={`checkbox${i}`}>{subjects[cat]}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {loading && (
        <div className="search-loading-widget">
          <LoadingSpinner />
        </div>
      )}
      {!searchSuccess && (
        <h4 className="search-error-msg">
          No search luck, try to refine your search
        </h4>
      )}
    </>
  );
};

export default Search;
