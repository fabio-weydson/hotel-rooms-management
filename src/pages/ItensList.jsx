import React from 'react';
import { useItens } from '../hooks/useItens'; 
import { Button } from '../components/ui/button';
import { XCircle, Pencil, Plus } from 'lucide-react'

const ItensList = ({ onItemSelect }) => {
  const {
    itens,
    loading,
    error,
  } = useItens(); // 

  const handleItemSelect = (item) => {
    console.log('Item selecionado:', item);
    //onItemSelect(item);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!itens || itens.length === 0) {
    return <div className="text-center text-gray-500">Nenhum item encontrado</div>;
  }
  return (
    <div className="space-y-4 p-3">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Lista de Itens</h2>
      <Button
        onClick={() => onItemSelect(null)}
        className="bg-green-500 text-white hover:bg-green-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar
      </Button>
      </div>

      {itens.map((item) => (
        <div
          key={item.id}
          className="p-3 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer flex flex-between items-center"
        >
          <h3 className="text-md font-semibold text-gray-900 flex-1">{item.nome}</h3>
          <Button onClick={() => onItemSelect(item)}
            className="ml-4 bg-blue-400 text-white hover:bg-blue-600 text-center"
          >
            <Pencil className="w-4 h-4 mr-2" />            
          </Button>
          <Button 
            variant="destructive"
            className="ml-2 bg-red-500 text-white hover:bg-red-600 text-center"
          onClick={() => console.log('Remover item:', item)}>
            <XCircle className="w-4 h-4 mr-2 block" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export { ItensList };