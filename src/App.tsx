import React from 'react';
import { MemoryGame } from './components/memory/MemoryGame';
import memoryBuilderIcon from './assets/images/memory-builder-icon.png';
import { version } from '../package.json';

export const App: React.FC = () => {

  return (
    <div className="container">
      <section className="section">
        <div className="container has-text-centered">
          <h1 className="title">Welcome to Memory Builder</h1>
          <h2 className="subtitle">Extend Your Memory</h2>

          <img 
            src={memoryBuilderIcon} 
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
