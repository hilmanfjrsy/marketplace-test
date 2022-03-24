import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const host = 'https://gardien.tokodistributor.co.id/api-web/v2/'

export async function getRequest(path) {
  try {
    const response = await axios.get(host + path);
    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.message, {
      theme: "colored",
    });
  }
}

export function useDrag() {
  const [clicked, setClicked] = useState(false);
  const [dragging, setDragging] = useState(false);
  const position = useRef(0);

  const dragStart = useCallback((ev) => {
    position.current = ev.clientX;
    setClicked(true);
  }, []);

  const dragStop = useCallback(
    () =>
      // NOTE: need some delay so item under cursor won't be clicked
      window.requestAnimationFrame(() => {
        setDragging(false);
        setClicked(false);
      }),
    []
  );

  const dragMove = (ev, cb) => {
    const newDiff = position.current - ev.clientX;

    const movedEnough = Math.abs(newDiff) > 5;

    if (clicked && movedEnough) {
      setDragging(true);
    }

    if (dragging && movedEnough) {
      position.current = ev.clientX;
      cb(newDiff);
    }
  };

  return {
    dragStart,
    dragStop,
    dragMove,
    dragging,
    position,
    setDragging
  };
}

export const getRating = (total = 0, count = 0, fontSize = 10) => {
  function getValue(value) {
    switch (value) {
      case 0:
        return "far fa-star";
      case 50:
        return "fas fa-star-half-alt";
      case 100:
        return "fas fa-star";
    }
  }

  function getStars(value) {
    if (value > 0 && value < 1) {
      return [50, 0, 0, 0, 0];
    } else if (value == 1) {
      return [100, 0, 0, 0, 0];
    } else if (value > 1 && value < 2) {
      return [100, 50, 0, 0, 0];
    } else if (value == 2) {
      return [100, 100, 0, 0, 0];
    } else if (value > 2 && value < 3) {
      return [100, 100, 50, 0, 0];
    } else if (value == 3) {
      return [100, 100, 100, 0, 0];
    } else if (value > 3 && value < 4) {
      return [100, 100, 100, 50, 0];
    } else if (value == 4) {
      return [100, 100, 100, 100, 0];
    } else if (value > 4 && value < 5) {
      return [100, 100, 100, 100, 50];
    } else if (value >= 5) {
      return [100, 100, 100, 100, 100];
    } else {
      return [0, 0, 0, 0, 0];
    }
  }

  return (
    <div>
      <span style={{ fontSize: fontSize + 3, fontWeight: 'bold', marginRight: 5, color: "#fbab19" }}>{total}</span>
      {getStars(total).map((value, idx) => {
        return (
          <li key={idx} className="list-inline-item m-0">
            <i
              className={getValue(value)}
              style={{ fontSize, color: "#fbab19" }}
            ></i>
          </li>
        );
      })}
      <span style={{ fontSize, color: "#A1A1A1", marginLeft: 5 }}>
        ({count})
      </span>
    </div>
  );
};

export function price(num) {
  return 'Rp. '+String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1.')
}