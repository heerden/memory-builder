import React from 'react';
import { MemoryGame } from './components/memory/MemoryGame';

export const App: React.FC = () => {
  const version = '2.0.0';

  return (
    <div className="container">
      <section className="section">
        <div className="container has-text-centered">
          <h1 className="title">Welcome to Memory Builder</h1>
          <h2 className="subtitle">Extend Your Memory</h2>

          <img 
            src="/src/assets/images/memory-builder-icon.png" 
            alt="Memory Builder Icon" 
            style={{ maxWidth: '120px', height: 'auto' }}
          />
          <br />
        </div>
      </section>

      <MemoryGame />

      <br />
      <footer className="footer">
        <div className="content has-text-centered">
          <p>With ❤️ for my Mom</p>
          <p>Version {version}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
