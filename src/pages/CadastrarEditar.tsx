import { useEffect, useRef, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { formatarDataParaApi } from '../shared/dataConvert';

interface Pessoa {
  seq: number;
  nome: string;
  rg: string | null;
  cpf: string | null;
  dataNascimento: string | null;
  sexo: string | null;
  foto: string | null;
}

export function PaginaEdicao({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, setValue, watch, formState: {isSubmitting, errors} } = useForm<Pessoa>();

  const fotoAtual = watch('foto');

  function handleUploadPhoto() {
    if (inputRef){
      inputRef?.current?.click();
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    // Pega o primeiro arquivo que o usuário selecionou
    const file = event.target.files?.[0];

    if (!file) {
      return; // Se o usuário não escolheu nenhum arquivo, não faz nada
    }

    // Ferramenta do navegador para ler arquivos
    const reader = new FileReader();

    // Quando o leitor terminar de ler o arquivo...
    reader.onloadend = () => {
      // ...o resultado será a imagem em Base64 (com o prefixo)
      const base64String = reader.result as string;
      // Usamos setValue para atualizar a memória do formulário
      setValue('foto', base64String);
    };

    // Manda o leitor ler o arquivo como uma URL de dados (Base64)
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (!isEdit){
      return;
    }

    axios.get<Pessoa>(`http://10.0.0.205:9000/pessoas/${id}`, {
      headers: { 'Authorization': 'Basic ZGllZ286MTIz' }
    })
    .then(response => {
      const pessoa = response.data;
      setValue('nome', pessoa.nome);
      setValue('cpf', pessoa.cpf);
      setValue('rg', pessoa.rg);
      setValue('dataNascimento', pessoa.dataNascimento ? pessoa.dataNascimento.substring(0, 10) : null);
      setValue('foto', pessoa.foto ? `data:image/jpeg;base64,${pessoa.foto}`: null);
      setValue('sexo', pessoa.sexo);
    })
    .catch(err => {
      console.error("Falha ao carregar dados da pessoa:", err);
    });
  }, [id, setValue]);

  async function onSubmit(data: Pessoa) {
    try {
      // Prepara os dados para envio. A API pode não esperar o prefixo da imagem.
      const payload = {
        ...data,
        foto: data.foto?.split(',')[1] || null,
        data_nascimento: data.dataNascimento ? formatarDataParaApi(data.dataNascimento) : null, 
      };
      console.log(payload);
      isEdit ? await axios.put(`http://10.0.0.205:9000/pessoas/${id}`, payload, {
        headers: {
          'Authorization': 'Basic ZGllZ286MTIz'
        }
      }) :  await axios.post(`http://10.0.0.205:9000/pessoas`, payload, {
        headers: {
          'Authorization': 'Basic ZGllZ286MTIz'
        }
      });
      
      
      alert(isEdit?'Pessoa atualizada com sucesso!':'Pessoa cadastrada com sucesso!');
      navigate('/'); // Navega de volta para a listagem
    } catch (error) {
      console.log('Erro ao atualizar pessoa:', error);
      alert('Falha ao atualizar a pessoa. Tente novamente.');
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen justify-center text-white p-8 flex flex-col items-center">
      
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">
          {isEdit ? 'Editar Pessoa' : 'Cadastrar Pessoa'}
        </h1>
        <button 
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg bg-slate-800 p-6 rounded-md">
        
        <div className="justify-center flex-col flex items-center mb-6">
          <label htmlFor="nome" className="block text-slate-400 mb-1 p-1">Foto da Pessoa</label>
          {fotoAtual ? (
            <img 
              src={fotoAtual} 
              alt="Foto da pessoa"
              className="w-32 h-32 rounded-full hover:cursor-pointer mb-2 object-cover border-4 border-slate-700"
              onClick={handleUploadPhoto}
              /> 
            ) 
            : 
            (
              <div onClick={handleUploadPhoto} className="w-32 h-32 hover:cursor-pointer rounded-full bg-slate-700 border-4 border-slate-700"></div>
            )}
            <button
              type='button' 
              onClick={handleUploadPhoto}
              className=' hover:bg-gray-950 hover:rounded-md hover:cursor-pointer py-1.5 px-3 text-slate-400'
            >
              Inserir ou alterar
            </button>
            
            <input ref={inputRef} onChange={handleFileChange} type="file" className='hidden' />

            {!!watch('foto') && 
              <button
                type='button' 
                onClick={() => setValue('foto', '')}
                className='hover:bg-red-700 hover:rounded-md hover:cursor-pointer py-1.5 px-3 text-slate-400'
              >
                Remover foto
              </button>
            }
         </div>
        
        <div className="mb-4">
          <label htmlFor="nome" className="block text-slate-400 mb-1">Nome</label>
          <input
            minLength={3}
            maxLength={50}
            id="nome"
            {...register('nome', { required: 'O campo nome é obrigatório.' })} 
            className="w-full bg-slate-700 p-2 rounded-md text-white border-2 border-slate-600 focus:outline-none focus:border-sky-500"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="cpf" className="block text-slate-400 mb-1">CPF</label>
          <input
            id="cpf"
            maxLength={11}
            {...register('cpf')}
            className="w-full bg-slate-700 p-2 rounded-md text-white border-2 border-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="rg" className="block text-slate-400 mb-1">RG</label>
          <input
            id="rg"
            maxLength={9}
            {...register('rg')}
            className="w-full bg-slate-700 p-2 rounded-md text-white border-2 border-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="data_nascimento" className="block text-slate-400 mb-1">Data de nascimento</label>
          <input
            type="date"
            id="data_nascimento"
            {...register('dataNascimento')}
            className="w-full bg-slate-700 p-2 rounded-md text-white border-2 border-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>
        
        <div className="flex justify-end mt-8">
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 w-full rounded-md"
            >
                {isSubmitting ? (isEdit ? 'Editando...' : 'Cadastrando...') : 'Salvar Alterações'}
            </button>
        </div>
      </form>

    </div>
  );
}