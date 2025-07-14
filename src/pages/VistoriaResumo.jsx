import { ArrowLeft, CheckCircle, XCircle, Clock, Camera, Edit, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useVistoria } from '../hooks/useVistoria'
import { cn } from '../lib/utils'

function VistoriaResumo({ quarto, onBack, onIniciarVistoria, onEditarVistoria }) {
  const { vistoria, itens, vistoriaItens, loading, error } = useVistoria(quarto.id)

  const getItemStatus = (item) => {
    const vistoriaItem = vistoriaItens.find(vi => vi.item_id === item.id)
    return vistoriaItem || null
  }

  const getStatusIcon = (itemVistoria) => {
    if (!itemVistoria) {
      return <Clock className="w-5 h-5 text-gray-400" />
    }
    
    // Assumindo que items com comentário ou foto são "não OK"
    const isOk = !itemVistoria.comentario && !itemVistoria.foto
    return isOk ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusText = (itemVistoria) => {
    if (!itemVistoria) return 'Não avaliado'
    
    const isOk = !itemVistoria.comentario && !itemVistoria.foto
    return isOk ? 'OK' : 'Não OK'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando vistoria...</p>
          </div>
        </div>
      </div>
    )
  }

  // Se não há vistoria, mostrar opção para iniciar
  if (!vistoria) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quarto {quarto.numero}
              </h1>
              <p className="text-gray-600">Nenhuma vistoria encontrada</p>
            </div>
          </div>

          {/* Iniciar Vistoria */}
          <Card className="text-center">
            <CardContent className="py-12">
              <Play className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Iniciar Nova Vistoria
              </h2>
              <p className="text-gray-600 mb-6">
                Este quarto ainda não foi vistoriado. Clique no botão abaixo para iniciar.
              </p>
              <Button onClick={onIniciarVistoria} size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Iniciar Vistoria
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Quarto {quarto.numero}
            </h1>
            <p className="text-gray-600">
              Realizada em {new Date(vistoria.data).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex gap-2">
            {vistoria.status !== 'FINALIZADA' && (
              <Button onClick={onEditarVistoria} variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                {vistoria.status === 'INICIADA' ? 'Continuar' : 'Editar'}
              </Button>
            )}
          </div>
        </div>

        {/* Status da Vistoria */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Status da Vistoria</CardTitle>
              <Badge 
                variant={
                  vistoria.status === 'FINALIZADA' ? 'success' :
                  vistoria.status === 'INICIADA' ? 'secondary' :
                  vistoria.status === 'COM_PROBLEMAS' ? 'destructive' : 'warning'
                  
                }
                className="gap-1"
              >
                {vistoria.status === 'FINALIZADA' && <CheckCircle className="w-3 h-3" />}
                {vistoria.status === 'INICIADA' && <Clock className="w-3 h-3" />}
                {vistoria.status === 'NAO_INICIADA' && <Clock className="w-3 h-3" />}
                {
                  vistoria.status === 'FINALIZADA' ? 'Finalizada' :
                  vistoria.status === 'INICIADA' ? 'Em Andamento' :
                  vistoria.status === 'COM_PROBLEMAS' ? 'Com Problemas' : 'Não Iniciada'
                  
                }
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{itens.length}</div>
                <div className="text-sm text-gray-600">Itens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {vistoriaItens.filter(vi => !vi.comentario && !vi.foto).length}
                </div>
                <div className="text-sm text-gray-600">OK</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {vistoriaItens.filter(vi => vi.comentario || vi.foto).length}
                </div>
                <div className="text-sm text-gray-600">Com Problema</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Itens */}
        <Card>
          <CardHeader>
            <CardTitle>Itens Vistoriados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itens.map((item) => {
                const itemVistoria = getItemStatus(item)
                const isOk = itemVistoria && !itemVistoria.comentario && !itemVistoria.foto
                
                return (
                  <div 
                    key={item.id} 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border",
                      !itemVistoria && "bg-gray-50 border-gray-200",
                      isOk && "bg-green-50 border-green-200",
                      itemVistoria && !isOk && "bg-red-50 border-red-200"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(itemVistoria)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.nome}</h3>
                      <p className="text-sm text-gray-600">
                        Status: {getStatusText(itemVistoria)}
                      </p>
                      
                      {itemVistoria?.comentario && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Comentário:</p>
                          <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                            {itemVistoria.comentario}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {itemVistoria?.foto && (
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {/* <Camera className="w-6 h-6 text-gray-500" /> */}
                          <img 
                            src={`https://awhyqgjzekcuwysymtsl.supabase.co/storage/v1/object/vistorias/public/${itemVistoria.foto}`} 
                            alt={`Foto do item ${item.nome}`} 
                            className="w-full h-full object-cover rounded-lg"></img>
                          <span className="sr-only">Foto anexada</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {itens.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhum item cadastrado para vistoria</p>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Botão para finalizar */}
        {vistoria.status === 'INICIADA' && (
          <div className="mt-6 text-center">
            <Button 
              size="lg"
              onClick={() => alert('Vistoria finalizada!')}
              className="bg-green-500 text-white hover:bg-green-600 w-full"
            >
              Finalizar Vistoria
            </Button>
          </div>
        )}

        {/* Foto do Quarto */}
        {vistoria.foto_quarto && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Foto Geral do Quarto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-500" />
                <span className="sr-only">Foto do quarto</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default VistoriaResumo

