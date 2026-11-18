
import React, { useState } from "react";
import { HsvColorPicker } from "react-colorful";

function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;

    const k = (n) => (n + h / 60) % 6;

    const f = (n) =>
        v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1));

    return {
        r: Math.round(f(5) * 255),
        g: Math.round(f(3) * 255),
        b: Math.round(f(1) * 255)
    };
}

const ColorPicker = ({ onColorChange }) => {
    const [hsv, setHsv] = useState({
        h: 0,
        s: 100,
        v: 100
    });

    function handleChange(newColor) {
        setHsv(newColor);

        const rgb = hsvToRgb(
            newColor.h,
            newColor.s,
            newColor.v
        );

        onColorChange(rgb);
    }

    return (
        <div style={{ width: "280px", height: "200px" }}>
            <HsvColorPicker
                color={hsv}
                onChange={handleChange}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default ColorPicker;
