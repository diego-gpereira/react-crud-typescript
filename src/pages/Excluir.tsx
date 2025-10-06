import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Pessoa {
  seq: number;
  nome: string;
  rg: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  foto: string | null;
}

export function PaginaExcluir() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    api.get<Pessoa>(`pessoas/${id}`, {
      headers: { 'Authorization': 'Basic ZGllZ286MTIz' }
    })
    .then(response =>{
      setPessoa(response.data)
    })
    .catch(err => {
      console.error("Falha ao carregar dados da pessoa:", err);
      navigate('/');
    });
  }, [id, navigate]);

  async function handleConfirmarExclusao() {
    const confirmou = window.confirm(`Tem certeza que deseja excluir ${pessoa?.nome}?`);
    if(!confirmou)
      return;
    
    setIsDeleting(true); // Ativa o estado de "deletando..."
    
    try {
      
      await api.delete(`pessoas/${id}`, {
      headers: {
        'Authorization': 'Basic ZGllZ286MTIz'
      }
      });
      
      
      alert('Pessoa excluída com sucesso!');
      navigate('/');

    } catch (error) {
      console.log('Erro ao excluir pessoa:', error);
      alert('Falha ao excluir a pessoa. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen justify-center text-white p-8 flex flex-col items-center">
      
      <div className="w-full max-w-lg bg-slate-800 p-8 rounded-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Confirmar Exclusão</h1>
        <p className='text-center text-slate-400 mb-6'>Você tem certeza que deseja excluir permanentemente a pessoa abaixo?</p>

        {/* Exibição dos dados da pessoa */}
        <div className='bg-slate-900 p-4 rounded-md text-center'>
          <p className='text-xl font-bold'>{pessoa?.nome}</p>
          <p className='text-slate-300'>CPF: {pessoa?.cpf}</p>
        </div>
        
        {/* 4. BOTÕES DE AÇÃO: Um para confirmar e outro para cancelar. */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={() => navigate(-1)} // Simplesmente volta
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 flex-1 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmarExclusao}
            disabled={isDeleting}
            className="bg-red-700 hover:bg-red-900 text-white font-bold py-2 flex-1 rounded-md disabled:bg-red-900 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
          </button>
        </div>

      </div>
    </div>
  );
}