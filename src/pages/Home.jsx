import { useState } from 'react'
import { Home, Plus, Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { VistoriaStatusBadge } from '../components/ui/statusBadge'
import { useQuartos } from '../hooks/useQuartos'
import { cn } from '../lib/utils'
import { DatePicker } from '@/components/ui/datePicker'

function HomePage({ onQuartoSelect, onListItems }) {
  const todayDate = new Date().toISOString().split('T')[0] // Format as yyyy-mm-dd
  const { quartos, loading, error } = useQuartos()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(todayDate)

  const handleListItens = () => {
    console.log('Listando itens')
    onListItems();
  }


  const getStatusIcon = (vistoria) => {
    if (!vistoria) {
      return <Plus className="w-6 h-6 text-blue-500" />
    }

    switch (vistoria.status) {
      case 'NAO_INICIADA':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'INICIADA':
        return <Clock className="w-6 h-6 text-blue-500" />
      case 'FINALIZADA':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'COM_PROBLEMAS':
        return <XCircle className="w-6 h-6 text-orange-500" />
      default:
        return <XCircle className="w-6 h-6 text-gray-400" />
    }
  }
  

  const filteredQuartos = quartos.filter(quarto => {
    const searchString = searchTerm.toLowerCase()
    return (
      quarto.numero?.toString().includes(searchString) ||
      quarto.tamanho?.toLowerCase().includes(searchString) ||
      quarto.localizacao?.toLowerCase().includes(searchString) ||
      (quarto.vistoria && quarto.vistoria.status.toLowerCase().includes(searchString))
    )
  })


  const handleDateChange = (date) => {
    console.log('Data selecionada:', date)
    setSelectedDate(date)
  }

  const filteredByDateQuartos = 
  // selectedDate
  //   ? filteredQuartos.filter((quarto) => {
  //       const vistoriaDate = quarto.vistoria?.data
  //       return vistoriaDate && new Date(vistoriaDate).toDateString() === new Date(selectedDate).toDateString()
  //     })
  //   : 
    filteredQuartos

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando quartos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-blue-600" onClick={() => handleListItens()} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vistoria de Quartos</h1>
                <p className="text-gray-600">Gerencie as vistorias da pousada</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por número, tamanho ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
            {/* Filter by Status */}
            <div className="overflow-x-auto flex gap-2 mt-4 pb-3">
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className={cn(
                "px-4 py-2",
                searchTerm === '' && "bg-blue-500 text-white"
                )}
              >
                Todos
              </Button>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('INICIADA')}
                className={cn(
                "px-4 py-2",
                searchTerm === 'INICIADA' && "bg-blue-500 text-white"
                )}
              >
                Em Andamento {`(${quartos.filter(q => q.vistoria?.status === 'INICIADA').length})`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('COM_PROBLEMAS')}
                className={cn(
                "px-4 py-2",
                searchTerm === 'COM_PROBLEMAS' && "bg-orange-500 text-white"
                )}
              >
                Com Problemas {`(${quartos.filter(q => q.vistoria?.status === 'COM_PROBLEMAS').length})`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('NAO_INICIADA')}
                className={cn(
                "px-4 py-2",
                searchTerm === 'NAO_INICIADA' && "bg-yellow-500 text-white"
                )}
              >
                Não Iniciada {`(${quartos.filter(q => !q.vistoria).length})`}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setSearchTerm('FINALIZADA')}
                className={cn(
                "px-4 py-2",
                searchTerm === 'FINALIZADA' && "bg-green-500 text-white"
                )}
              >
                Finalizada {`(${quartos.filter(q => q.vistoria?.status === 'FINALIZADA').length})`}
              </Button>
           
            </div>
            
            <div className="relative w-full mt-4 flex flex-between items-center">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="flex-1/2"
              />
              <Button
                variant="outline"
                className="ml-4 flex-1/3 bg-green-600 text-white hover:bg-green-500"
                onClick={() => {
                  handleDateChange(new Date())
                }}
              >
                Hoje
              </Button>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {filteredByDateQuartos.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nenhum quarto encontrado' : 'Nenhum quarto cadastrado'}
            </h2>
            <p className="text-gray-600">
              {searchTerm ? 'Tente ajustar os termos de busca' : 'Cadastre quartos para começar'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
            {filteredByDateQuartos.map((quarto) => (
              <Card
                key={quarto.id}
                className={cn(
                  "cursor-pointer transition-transform transform hover:scale-105 rounded-lg border border-gray-200 bg-white",
                  !quarto.vistoria && "ring-gray-200 bg-gray-50",
                  quarto.vistoria?.status === 'INICIADA' && "ring-blue-200 bg-blue-50",
                  quarto.vistoria?.status === 'FINALIZADA' && "ring-green-200 bg-green-50",
                  quarto.vistoria?.status === 'COM_PROBLEMAS' && "ring-orange-200 bg-red-50"
                )}
                onClick={() => onQuartoSelect(quarto)}
              >
                <CardHeader className="pb-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Quarto {quarto.numero}
                    </CardTitle>
                    {getStatusIcon(quarto.vistoria)}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {quarto.tamanho && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tamanho:</span> {quarto.tamanho}
                      </p>
                    )}
                    {quarto.localizacao && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Localização:</span> {quarto.localizacao}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      {VistoriaStatusBadge(quarto.vistoria?.status)}
                    </div>
                    {quarto.vistoria?.data && (
                      <p className="text-xs text-gray-500">
                        Última vistoria: {new Date(quarto.vistoria.data).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

