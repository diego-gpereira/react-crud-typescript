import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { formatarData } from '../shared/dataConvert';
import { Link, useNavigate } from 'react-router-dom';

// 1. Interface atualizada para bater com o retorno da sua API Delphi
interface Pessoa {
  sequencia: number;
  nome: string;
  rg: string | null;
  cpf: string | null;
  dataNascimento: string | null;
  foto: string | null;
}

export function PaginaListagem() {
  // 2. O estado de 'pessoas' começa vazio.
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(0);

  const navigate = useNavigate();

  // 3. O useEffect agora vai fazer a chamada real
  useEffect(() => {
    if (page > 1) {
      setLoading(true);
    }

    axios.get<Pessoa[]>('http://10.0.0.205:9000/pessoas', {
      params: {
        pagina: page,
        max: 15
      },
      headers: {
        'accept': 'application/json',
        'Authorization': 'Basic ZGllZ286MTIz' // Seu token de autorização
      }
    })
      .then(response => {
        if (response.data)
          if(page === 1)
           setPessoas(response.data)
          else
            setPessoas(prev => [...prev, ...response.data])
      })
      .catch((err: AxiosError) => {
        setError('Error ao consumir api: ' + err.code)
      })
      .finally(() => setLoading(false));

  }, [page]);


  useEffect(() => {
    axios.get<{
      total: number
    }>('http://10.0.0.205:9000/pessoas/total', {
      params: {
        pagina: page
      },
      headers: {
        'accept': 'application/json',
        'Authorization': 'Basic ZGllZ286MTIz' // Seu token de autorização
      }
    })
      .then(response => {
        if (response.data)
          setRecords(response.data.total)
      })


  }, []);

  function handleCadastrarPessoa() {
    navigate(`/cadastrar`);
  }

  function handleEditarPessoa(idDaPessoa: number) {
    navigate(`/editar/${idDaPessoa}`);
  }

  function handleRemoverPessoa(idDaPessoa: number) {
    navigate(`/excluir/${idDaPessoa}`);
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Erro: {error}</div>;
  }

  // 5. O JSX final, que só é mostrado se não houver erro e o loading tiver terminado
  return (
    <div className="bg-slate-900 min-h-screen w-full flex flex-col items-center text-white font-sans p-8">

      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Listagem de Pessoas</h1>
        <Link to="/cadastrar">
          <button onClick={() => handleCadastrarPessoa()} className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-md mx-4.5">
            Cadastrar
          </button>
        </Link>
      </div>

      <div className="w-full max-w-5xl">
        {pessoas.map(pessoa => (
          <div key={pessoa.sequencia}
            className="bg-slate-800 p-4 rounded-md mb-3 flex items-start shadow-lg gap-4">

            <div className="w-16 h-16 bg-slate-700 rounded-full flex-shrink-0">
              {pessoa.foto ? (
                <img
                  src={`data:image/jpeg;base64,${pessoa.foto}`}
                  alt={`Foto de ${pessoa.nome}`}
                  className="w-16 h-16 rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                // Se não existir, mostramos o placeholder de antes
                <div className="w-16 h-16 bg-slate-700 rounded-full flex-shrink-0"></div>
              )}
            </div>

            <div className="flex-grow flex justify-between items-start">

              <div>
                <p className="text-lg font-semibold text-slate-200">{pessoa.nome}</p>
                <div className='flex gap-4 text-sm text-slate-400 mt-1'>
                  <span>CPF: {pessoa.cpf ?? 'Não informado'}</span>
                  <span>RG: {pessoa.rg ?? 'Não informado'}</span>
                  <span>NASCIMENTO: {pessoa.dataNascimento ? formatarData(pessoa.dataNascimento) : 'Não informado'}</span>
                </div>
              </div>

              <div className='flex gap-3'>

                <button onClick={() => handleEditarPessoa(pessoa.sequencia)}
                  className="bg-sky-700 hover:bg-sky-900 text-white text-shadow-neutral-600 font-bold py-2 px-4 rounded-md">
                  Editar
                </button>

                <button onClick={() => handleRemoverPessoa(pessoa.sequencia)}
                  className="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-md">
                  Excluir
                </button>

              </div>
            </div>

          </div>
        ))}

        {!loading ? (
          <>
            {pessoas.length >= records ? <p>Todos os registros foram carregados!</p> :
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className='w-full p-2 bg-blue-600 text-white hover:cursor-pointer'>
                Carregar mais
              </button>
            }
          </>
        ) : (
          <div className='w-full flex justify-center'>
            <div
              className='h-8 w-8 rounded-full border-t-2 animate-spin'
            />
          </div>
        )}
      </div>

    </div>
  );
}