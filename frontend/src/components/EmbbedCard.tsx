import React, { useState } from 'react';

const EmbedCard: React.FC = () => {
    const [url, setUrl] = useState<string>('http://localhost:7872/vnc.html?autoconnect=true');
  
    const shuffleUrl = () => {
      setUrl((prevUrl) =>
        prevUrl === 'http://localhost:7904/vnc.html?autoconnect=true'
          ? 'http://localhost:7900/vnc.html?autoconnect=true'
          : 'http://localhost:7904/vnc.html?autoconnect=true'
      );
    };
  
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>Embedded Content</h2>
        <iframe
          src={url}
          style={styles.iframe}
          title="Embedded Content"
          width="100%"
          height="400"
        />
        <button onClick={shuffleUrl} style={styles.button}>
          Shuffle URL
        </button>
      </div>
    );
  };



const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: '80%',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    textAlign: 'center', 
  },
  iframe: {
    border: 'none',
    borderRadius: '8px',
  },
  button: {
    display: 'block',
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default EmbedCard;
