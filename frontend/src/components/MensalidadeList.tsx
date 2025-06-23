import React, { useEffect, useState } from 'react';

interface Mensalidade {
  id: number;
  aluno_id: number;
  referencia_mes: string;
  valor: string;
  status: string;
  data_vencimento: string;
  data_pagamento?: string;
}

const MensalidadeList: React.FC = () => {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/mensalidades')
      .then(res => res.json())
      .then(setMensalidades)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="aluno-list">
      <h2>Lista de Mensalidades</h2>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {mensalidades.map(m => (
            <li key={m.id}>
              Aluno #{m.aluno_id} - {m.referencia_mes} - R$ {m.valor} - {m.status} - Venc: {m.data_vencimento} {m.data_pagamento && `- Pago em: ${m.data_pagamento}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MensalidadeList;
