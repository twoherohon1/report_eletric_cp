import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const SnapshotDiv = () => {
  const divRef = useRef();

  const handleSnapshot = () => {
    html2canvas(divRef.current)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'snapshot.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error taking snapshot:', error);
      });
  };

  return (
    <div>
      <h2>Snapshot of a Div Example</h2>
      <div
        ref={divRef}
        style={{
          padding: '20px',
          border: '2px solid black',
          backgroundColor: '#f0f0f0', // Use a supported format like hex (#f0f0f0) or RGB (rgb(240, 240, 240))
          marginBottom: '20px',
          color: 'rgba(0, 0, 0, 0.87)', // Supported text color
          fontFamily: 'Arial, sans-serif', // Use a standard font
        }}
      >
        <h3>This is the content to snapshot!</h3>
        <p>You can include any content here.</p>
      </div>
      <button onClick={handleSnapshot}>Take Snapshot</button>
    </div>
  );
};

export default SnapshotDiv;