import React from "react";
import "../styles/TransistorSword.css";

const Sword = () => {
  return (
    <div id="main-container" className="outer-container absolute">
      <div className="transistor-sword">
        <div className="grip-end">
          <div className="circle-end"></div>
          <div className="glowing-grip-base"></div>
          <div id="hilt-bottom" className="hilt-base h-anim"></div>
          <div className="handle-ring" style={{ "--i": 1 }}></div>
          <div className="handle"></div>
          <div className="handle-ring" style={{ "--i": 0 }}></div>
          <div className="hilt-base"></div>
          <div className="handle-extension"></div>
          <div className="handle-end"></div>
        </div>
      </div>
      <div className="blade-container">
        <div className="blade-background">
          <div className="blade-glow glow-large"></div>
          <div className="blade-curved-end"></div>
        </div>
        <div className="sword-guard"></div>
        <div className="guard-container">
          <div className="guard-triangle"></div>
        </div>
        <div className="transistor-stripes">
          <div className="stripe-container right-container">
            <div className="long-stripe"></div>
            <div className="corner-stripe"></div>
            <div className="corner-stripe"></div>
            <div className="end-stripe"></div>
            <div className="stripe-circle-container">
              <div id="right-dot" className="stripe-circle">
                <div className="stripe-inner-circle"></div>
              </div>
            </div>
          </div>
          <div className="center-stripe">
            <div className="stripe-circle-container">
              <div id="center-dot" className="stripe-circle">
                <div className="stripe-inner-circle"></div>
              </div>
            </div>
          </div>
          <div className="stripe-container left-container">
            <div className="long-stripe"></div>
            <div className="corner-stripe"></div>
            <div className="corner-stripe"></div>
            <div className="end-stripe"></div>
            <div className="stripe-circle-container">
              <div id="left-dot" className="stripe-circle">
                <div className="stripe-inner-circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="eye-container">
          <div className="transistor-eye">
            <div className="eye-background"></div>
            <div className="inner-red-eye"></div>
            <div className="inner-black-eye"></div>
          </div>
        </div>
        <div className="blade-side-container left-side-trapezoids"></div>
        <div className="blade-side-container right-side-trapezoids"></div>
        <div className="blade-adapters-container">
          <div className="adapter-container right-adapter"></div>
          <div className="adapter-container center-adapter"></div>
          <div className="adapter-container left-adapter"></div>
        </div>
      </div>
    </div>
  );
};

export default Sword;
