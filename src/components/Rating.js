import React, { useEffect, useState } from 'react';
import './Rating.css';

const MAX_VALUE = 5;

const Rating = (props) => {
  const {
    value,
    emptyIcon = '/icons/stars/empty.svg',
    filledIcon = '/icons/stars/filled.svg',
    halfFilledIcon = '/icons/stars/half.svg',
    steps = 1
  } = props;
  const [hoverRating, setHoverRating] = useState();
  const [finalRating, setFinalRating] = useState();

  // Utility function to calculate if the mouse event happened on the left side of the target or the right side.
  const isLessThanHalf = (event) => {
    const { target } = event;
    const boundingClientRect = target.getBoundingClientRect();
    let mouseAt = event.clientX - boundingClientRect.left;
    mouseAt = Math.round(Math.abs(mouseAt));
    return mouseAt <= boundingClientRect.width / 2;
  };

  const mouseMoveSetHoverRating = (event, i) => {
    const newRating = isLessThanHalf(event) ? i + steps : i + 1;
    setHoverRating(newRating);
  };

  const mouseOutResetHoverRating = () => {
    setHoverRating(finalRating);
  };

  const saveRating = (rating, clearIfDuplicated = false) => {
    let newRating = rating;
    if (newRating < 0) {
      newRating = 0;
    } else if (newRating > MAX_VALUE) {
      newRating = MAX_VALUE;
    }
    if (newRating === finalRating && clearIfDuplicated) {
      newRating = 0;
    }
    setHoverRating(newRating);
    setFinalRating(newRating);
  };

  const mouseClickSetFinalRating = (event, i) => {
    let newRating = isLessThanHalf(event) ? i + steps : i + 1;
    saveRating(newRating, true);
  };

  const renderSymbol = () => {
    const symbolArr = [];
    let currentRating, imgSrc;
    for (let i = 0; i < MAX_VALUE; i++) {
      currentRating = i + 1;
      if (currentRating <= hoverRating) {
        imgSrc = filledIcon;
      } else if (steps === 0.5 && currentRating - steps <= hoverRating) {
        imgSrc = halfFilledIcon;
      } else {
        imgSrc = emptyIcon;
      }
      symbolArr.push(
        <img
          key={i}
          src={imgSrc}
          className="rating-image"
          data-testid="rating-icon"
          alt="Rate"
          onMouseMove={(event) => mouseMoveSetHoverRating(event, i)}
          onMouseOut={mouseOutResetHoverRating}
          onClick={(event) => mouseClickSetFinalRating(event, i)}
        />
      );
    }
    return symbolArr;
  };

  useEffect(() => {
    let initialRating = value === undefined ? 0 : value;
    if (initialRating - Math.floor(initialRating) !== 0 && steps !== 0.5) {
      initialRating = Math.ceil(initialRating);
    }
    setHoverRating(initialRating);
    setFinalRating(initialRating);
  }, [steps, value]);

  useEffect(() => {
    const onKeyDown = (event) => {
      let newRating;
      switch (event.key) {
        case 'ArrowLeft': // Left
        case 'ArrowDown': // Down
          newRating = finalRating - steps;
          break;

        case 'ArrowUp': // Up
        case 'ArrowRight': // Right
          newRating = finalRating + steps;
          break;

        case '1': // 1
          newRating = 1;
          break;

        case '2': // 2
          newRating = 2;
          break;

        case '3': // 3
          newRating = 3;
          break;

        case '4': // 4
          newRating = 4;
          break;

        case '5': // 5
          newRating = 5;
          break;
      }

      if (newRating !== undefined) {
        saveRating(newRating);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [finalRating, steps]);

  return (
    <div tabIndex="0" className="star-rating" data-testid="star-rating-container">
      {renderSymbol()}
    </div>
  );
};

export default Rating;
