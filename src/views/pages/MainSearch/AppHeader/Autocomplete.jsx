import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { matchPath } from 'react-router';

import styled from 'styled-components';

import styles from './Autocomplete.module.css'
import useHistoryPush from 'core/hooks/useHistoryPush';


const Autocomplete = ({ suggestions, output, renderInput, clearIcon, onInputValueChange }) => {
  const historyPush = useHistoryPush();
  const [isShow, setIsShow] = useState(false)
  const [active, setActive] = useState(0)
  const [filtered, setFiltered] = useState(suggestions)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const { playlistId } = useParams()
  const { search, pathname } = useLocation();
  const searchParams = new URLSearchParams(search);
  const paramz = searchParams.get("query");




  const match = matchPath(pathname, {
    path: "/playlist/:id/",
    exact: true,
    strict: false
  });

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsShow(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const handleClick = () => {
    setIsShow(true)
  }

  const handleClickSuggestion = (e) => {
    const input = e.currentTarget.innerText
    if (pathname === '/feed') {
      historyPush(`/search/web?query=${encodeURIComponent(input).replace(/%20/g, "+")}`);
    } else if (pathname === '/search/images' || pathname === '/search/bing'){
      historyPush(`${pathname}?query=${encodeURIComponent(input).replace(/%20/g, "+")}`);
    } else {
      historyPush(`/search/web?query=${encodeURIComponent(input).replace(/%20/g, "+")}`);
    }

    // historyPush(`/search/web?query=${input}`);
    stateChange(input, false, 0)
  }

  const handleClear = () => {
    setFiltered(suggestions)
    output('')
  }

  const handleChangeV2 = (e) => {
    setQuery(e.target.value);
    const input = e.target.value
    onInputValueChange(input);
    const isContained = suggestions.some((element) => {
      return element.toLowerCase() === input.toLowerCase()
    })
    isContained ? stateChange(input, false, 0) : stateChange(input, true, 0)

  }

  const handleKeyDown = (e) => {
    const keyCode = e.code

    switch (keyCode) {
      case 'Enter':
        e.preventDefault()
        if (filtered.length !== 0) {
          const input = filtered[active]
          stateChange(input, false, 0)
        }
        setIsShow(false)

        if (pathname === '/feed') {
          historyPush(`/search/web?query=${encodeURIComponent(e.target.value).replace(/%20/g, "+")}`);
        } else if (pathname === '/search/images' || pathname === '/search/bing' ){
          historyPush(`${pathname}?query=${encodeURIComponent(e.target.value).replace(/%20/g, "+")}`);
        } else {
          historyPush(`/search/web?query=${encodeURIComponent(e.target.value).replace(/%20/g, "+")}`);
        }

        break
      case 'ArrowUp':
        setActive(!active ? 0 : active - 1)
        break
      case 'ArrowDown':
        setActive(active + 1 === filtered.length ? active : active + 1)
        break
      default:
        break
    }
  }

  const stateChange = (input, isShow, active) => {
    setFiltered(
      suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
      )
    )
    setActive(active)
    setIsShow(isShow)
    output(input)
  }

  const renderAutocomplete = () => {
    if (isShow ) {
      return (
        <SuggestionPanel
          // className={styles.autocomplete}

          >
          {suggestions.map((suggestion, index) => {
            return (
              <LiStyled
                // className={index === active ? styles.active : ''}
                key={index}
                onClick={handleClickSuggestion}
                ref={(el) =>
                  index === active &&
                  el !== null &&
                  el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                  })
                }
                onMouseEnter={() => setActive(index)}
              >
                <SpanStyled>
                  {suggestion.query}
                </SpanStyled>
              </LiStyled>
            )
          })}
        </SuggestionPanel>
      )
    }
    // else if (isShow && suggestions.length === 0) {
    //   return (
    //     <div className={styles.noAutocomplete}>
    //       <em className={styles.absolute}>Not found</em>
    //     </div>
    //   )
    // }
  }
  const [query, setQuery] = useState(() => {
    // const q = new URLSearchParams(window.location.search);
    // // console.log(q.toString());
    // return q.get("query") || "";



  });



  useEffect(() => {

    setQuery(paramz)
  }, [paramz]);



  const handleChange = (e) => {
    // setQuery(e.target.value);
    handleChangeV2(e.target.value);
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      historyPush(`/search/web?query=${e.target.value}`);
    }
  }
  const params = {
    // onChange: handleChange,
    onChange: handleChangeV2,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    value: query || '',
    // onKeyPress: handleKeyPress,
  }

  // onChange={(e) => {
  //     setQuery(e.target.value);
  //     handleChange(e.target.value);
  // }}


  useLayoutEffect(() => {
    containerRef.current.style.width = `${inputRef.current.offsetWidth}px`
  }, [inputRef])


  return (
    <div className={styles.container} ref={containerRef}>
      {renderInput(params, inputRef)}

      {/*{clearIcon && (
        <span className={styles.clear} onClick={handleClear}>
          X
        </span>
      )}*/}

      {renderAutocomplete()}
    </div>
  )
}

const SuggestionPanel = styled.ul`
  padding-left: 0px;
  border: 1px solid black;
  border-radius: 0px;
  background-color: ${(props) => props.theme.suggestionBg};
  /* box-shadow: 0 9px 8px -3px #403c433d, 8px 0 8px -7px #403c433d, -8px 0 8px -7px #403c433d; */
`;

const LiStyled = styled.li`
  list-style: none;
  padding-bottom: 5px;
  padding-top: 5px;
  .active,
  &:hover {
    /* background: #ebebeb; */
    background: ${(props) => props.theme.suggestionHover};
    /* background: #f7f8f9; */
    /* cursor: pointer; */
    cursor: default;

  }

`;
const SpanStyled = styled.span`
  /* list-style: none; */
  margin-left: 1em;
  margin-top: 10em;
  font-family: Verdana;

  .active,
  &:hover {
    /* background: #ebebeb; */
    /* background: #f7f8f9; */
    /* cursor: pointer; */

  }

`;

export default Autocomplete
