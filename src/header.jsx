import React, { useState, useEffect } from 'react';
import cake from "./cake.png"
import candle from "./candle.png"
import nocandle from "./nocandle.png"

const BirthdayCake = () => {
  const [isCandleLit, setCandleLit] = useState(true);

  useEffect(() => {
    let mediaStream = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;

    const checkBlow = () => {
      if (!audioContext || !analyser || !dataArray) return;

      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

      if (average > 100) {
        setCandleLit(false);
      }
    };

    const initAudio = async () => {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(mediaStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        setInterval(checkBlow, 100);
    };

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
    
    initAudio();
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1>Happy Birthday!</h1>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <img src={cake} alt="Birthday Cake" style={{ width: '100%', height: '100%' }} />
          {isCandleLit && (
            <img src={candle} alt="Candle" style={{ position: 'absolute', top: '40px', left: '90px', width: '20px', height: '40px' }} />
          )}
          {!isCandleLit && (
            <img src={nocandle} alt="Candle" style={{ position: 'absolute', top: '40px', left: '90px', width: '20px', height: '40px' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCake;
