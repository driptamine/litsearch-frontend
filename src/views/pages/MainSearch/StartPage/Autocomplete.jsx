import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import styles from './Autocomplete.module.css'
import useHistoryPush from 'core/hooks/useHistoryPush';
import useDebounce from 'core/hooks/useHistoryPush';

const Autocomplete = ({ suggestions, recommendations, output, renderInput, clearIcon, onInputValueChange }) => {
  const dispatch = useDispatch();
  const historyPush = useHistoryPush();
  const [isShow, setIsShow] = useState(false)
  const [isRecommendations, setIsRecommendations] = useState(false)
  const [active, setActive] = useState(0)
  const [filtered, setFiltered] = useState(suggestions)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsShow(false)
        setIsRecommendations(false);
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])



  const handleClick = (e) => {

    // if (recommendations){
    //   dispatch({
    //     type: 'SHOW_RECOMMENDATIONS'
    //   })
    //   setIsRecommendations(true)
    // }

    const inputVal = e.target.value;
    if (!inputVal && recommendations) {
      dispatch({
        type: 'SHOW_RECOMMENDATIONS'
      })
      setIsRecommendations(true)
    }


    setIsShow(true)
    // let start = e.target.selectionStart;
  }

  const handleClickSuggestion = (e) => {
    const input = e.currentTarget.innerText
    historyPush(`/search/web?query=${encodeURIComponent(input).replace(/%20/g, "+")}`);
    stateChange(input, false, 0)
  }

  const handleClear = () => {
    setFiltered(suggestions)
    output('')
  }

  // const handleInputChange = useCallback(() => {
  //   debounce((value) => {
  //
  //     // setIsShow(value.length > 0);
  //     setIsShow(true);
  //   }, 2000);
  // }, [])



  const handleChange = (e) => {
    const input = e.target.value;
    onInputValueChange(input);
    // const isContained = suggestions.some((element) => {
    //   return element.toLowerCase() === input.toLowerCase()
    // })
    // isContained ? stateChange(input, false, 0) : stateChange(input, true, 0)
    setIsRecommendations(false);
    setIsShow(true);
    // handleInputChange(input);

  }

  // const loadDataDebounced = useDebounce(handleChange, 400)
  //
  // const bra = (e) => loadDataDebounced(e)

  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   onInputValueChange(value);
  // }
  // useEffect(() => {
  //   return () => {
  //     handleInputChange.cancel();
  //   };
  // }, [handleInputChange]);

  const handleKeyDown = (e) => {
    const keyCode = e.code
    switch (keyCode) {
      case 'Enter':
        e.preventDefault()
        historyPush(`/search/web?query=${encodeURIComponent(e.target.value).replace(/%20/g, "+")}`);
        if (filtered.length !== 0) {
          const input = filtered[active]
          stateChange(input, false, 0)
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
          suggestion.query.toLowerCase().indexOf(input.toLowerCase()) > -1
      )
    )
    setActive(active)
    setIsShow(isShow)
    output(input)
  }

  const renderAutocomplete = () => {
    if (isShow ) {
      return (
        <SuggestionPanel>
          {suggestions.map((suggestion, index) => {
            return (
              <LiStyled
                className={index === active ? styles.active : ''}
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
    else if (isShow && suggestions.length === 0) {
      return (
        <div className="no">
          <em className="noo">Not found</em>
        </div>
      )
    }

    else  {
        <SuggestionPanel>
          {recommendations.map((suggestion, index) => {
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
                  {suggestion}
                </SpanStyled>
              </LiStyled>
            )
          })}
        </SuggestionPanel>
      }
  }

  const renderRecommendations = () => {
    if (isRecommendations ) {
      return (
        <SuggestionPanel>
          {recommendations.map((suggestion, index) => {
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
                  {suggestion}
                </SpanStyled>
              </LiStyled>
            )
          })}
        </SuggestionPanel>
      )
    } else if (isShow && suggestions.length === 0) {
      // return (
      //   <div className="no">
      //     <em className="noo">Not Recs</em>
      //   </div>
      // )
    }
  }

  const params = {
    onChange: handleChange,
    // onChange: bra,
    // onChange: loadDataDebounced,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
  }

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
      {renderRecommendations()}
      {renderAutocomplete()}

    </div>
  )
}

const SuggestionPanel = styled.ul`
  margin-top: 3px;
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
    cursor: default;

  }

`;
const SpanStyled = styled.span`
  /* list-style: none; */
  font-family: Verdana;
  margin-left: 1em;
  margin-top: 10em;

  .active,
  &:hover {
    /* background: #ebebeb; */
    /* background: #f7f8f9; */
    /* cursor: pointer; */

  }
`;

export default Autocomplete
