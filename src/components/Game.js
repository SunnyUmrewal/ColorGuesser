import React, { useState } from "react";
import ColorPicker from "./Colorpicker";
import "./Game.css";

function rgbToLab(r, g, b) {

    //using CIELAB color space for better accuracy
  // Normalize RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  // Convert sRGB to linear RGB
  const linearize = (value) => {
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  r = linearize(r);
  g = linearize(g);
  b = linearize(b);

  // Convert linear RGB to XYZ (D65)
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

  // Convert XYZ to Lab
  const f = (t) => {
    return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  };

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

const Game = () => {
  const [color, setColor] = useState([]);
  const [guess, setGuess] = useState({
    r: 255,
    g: 255,
    b: 255,
  });

  const [isGuessing, setIsGuessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateTest() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    setColor([r, g, b]);

    // Reset previous guess
    setGuess({ r: 255, g: 255, b: 255 });

    setIsGuessing(false);
    setSubmitted(false);
  }

  function calculateAccuracy(testColor, guessColor) {
    const testLab = rgbToLab(testColor[0], testColor[1], testColor[2]);

    const guessLab = rgbToLab(guessColor.r, guessColor.g, guessColor.b);

    const deltaE = Math.sqrt(
      Math.pow(testLab.L - guessLab.L, 2) +
        Math.pow(testLab.a - guessLab.a, 2) +
        Math.pow(testLab.b - guessLab.b, 2),
    );

    // Convert perceptual difference into a game score
    const accuracy = 100 * Math.exp(-deltaE / 30);

    return Math.round(accuracy);
  }

  const boxStyle = {
    width: "200px",
    height: "200px",
    border: "1px solid black",
    borderRadius: "8px",
  };

  return (
    <div className="game-container">
      <button className="start-btn" onClick={updateTest}>
        Start
      </button>

      {color.length !== 0 && !isGuessing && (
        <div className="game-header">
          <h3>Test Color</h3>

          <div
            style={{
              ...boxStyle,
              backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            }}
          />

          <button className="primary-btn" onClick={() => setIsGuessing(true)}>
            Start Guessing
          </button>
        </div>
      )}

      {isGuessing && !submitted && (
        <div>
          <h3>Your Selected Color</h3>

          <div
            style={{
              ...boxStyle,
              backgroundColor: `rgb(${guess.r}, ${guess.g}, ${guess.b})`,
            }}
          />

          <ColorPicker onColorChange={setGuess} />

          <button className="primary-btn" onClick={() => setSubmitted(true)}>
            Submit
          </button>
        </div>
      )}

      {submitted && (
        <div>
          <h2>Results</h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>Test Color</h3>

              <div
                style={{
                  ...boxStyle,
                  backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                }}
              />
            </div>

            <div>
              <h3>Your Guess</h3>

              <div
                style={{
                  ...boxStyle,
                  backgroundColor: `rgb(${guess.r}, ${guess.g}, ${guess.b})`,
                }}
              />
            </div>
          </div>

          <h2>Accuracy: {calculateAccuracy(color, guess)}%</h2>

          <button className="primary-btn" onClick={updateTest}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
