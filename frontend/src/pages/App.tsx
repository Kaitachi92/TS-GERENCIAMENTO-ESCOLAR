import React, { useState } from 'react';
import AlunoView from '../views/AlunoView';
import TurmaView from '../views/TurmaView';
import '../styles/global.scss';

const App: React.FC = () => {
  const [aba, setAba] = useState<'alunos' | 'turmas'>('alunos');

  return (
    <>
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5em' }}>
          📚 Sistema de Gerenciamento Escolar
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.1em', opacity: 0.9 }}>
          React + TypeScript + WebSocket - Prova Final
        </p>
      </header>
      
      <nav style={{ 
        display: 'flex', 
        gap: 16, 
        margin: '0 20px 30px 20px',
        justifyContent: 'center'
      }}>
        <button 
          className={aba === 'alunos' ? 'btn-tab active' : 'btn-tab'} 
          onClick={() => setAba('alunos')}
        >
          👨‍🎓 Alunos
        </button>
        <button 
          className={aba === 'turmas' ? 'btn-tab active' : 'btn-tab'} 
          onClick={() => setAba('turmas')}
        >
          🏫 Turmas
        </button>
      </nav>
      
      <main>
        {aba === 'alunos' && <AlunoView />}
        {aba === 'turmas' && <TurmaView />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '30px 20px',
        marginTop: '50px',
        color: '#999',
        borderTop: '1px solid #e0e0e0'
      }}>
        <p>✅ Views funcionando + Backend API em Docker</p>
        <p>⚡ Vite como pré-compilador</p>
        <p>📘 TypeScript no frontend (React + TS)</p>
        <p>📄 Views EJS implementadas</p>
        <p>🔌 WebSocket + Custom Hook</p>
      </footer>
    </>
  );
};

export default App;

