import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, CheckCircle, XCircle, Camera, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { useVistoria } from '../hooks/useVistoria'
import { UploadFoto } from '../components/ui/uploadFoto'
import { cn } from '../lib/utils'

function Vistoria({ quarto, onBack, onFinalizar }) {
  const { 
    vistoria, 
    itens, 
    vistoriaItens, 
    loading, 
    error, 
    criarVistoria, 
    salvarItemVistoria, 
    finalizarVistoria,
    getItemVistoria,
    getTodosItensAvaliados
  } = useVistoria(quarto.id)

  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [comentario, setComentario] = useState('')
  const [foto, setFoto] = useState(null)
  const [status, setStatus] = useState(null) // 'OK' ou 'NAO_OK'
  const [isLoading, setIsLoading] = useState(false)
  const [showFinalStep, setShowFinalStep] = useState(false)
  const [fotoQuarto, setFotoQuarto] = useState(null)
  const [avaliacaoGeral, setAvaliacaoGeral] = useState('')

  const currentItem = itens[currentItemIndex]

  useEffect(() => {
    if (!vistoria && !loading) {
      iniciarVistoria()
    }
  }, [vistoria, loading])

  useEffect(() => {
    if (currentItem) {
      const itemVistoria = getItemVistoria(currentItem.id)
      if (itemVistoria) {
        setComentario(itemVistoria.comentario || '')
        setFoto(null)
        // Se tem comentário ou foto, assume que é "NAO_OK", senão é "OK"
        setStatus(itemVistoria.comentario || itemVistoria.foto ? 'NAO_OK' : 'OK')
      } else {
        setComentario('')
        setFoto(null)
        setStatus(null)
      }
    }
  }, [currentItem, vistoriaItens])

  useEffect(() => {
    // Verificar se todos os itens foram avaliados
    if (itens.length > 0 && getTodosItensAvaliados()) {
      setShowFinalStep(true)
    }
  }, [vistoriaItens, itens])

  const iniciarVistoria = async () => {
    try {
      await criarVistoria()
    } catch (err) {
      console.error('Erro ao criar vistoria:', err)
    }
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    if (newStatus === 'OK') {
      setComentario('')
      setFoto(null)
    }
  }

  const handleSaveItem = async () => {
    if (!currentItem || status === null) return

    try {
      setIsLoading(true)
      
      const dados = {
        comentario: status === 'NAO_OK' ? comentario : null,
        foto: status === 'NAO_OK' ? foto : null
      }

      await salvarItemVistoria(currentItem.id, dados)
    } catch (err) {
      console.error('Erro ao salvar item:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    if (status !== null) {
      await handleSaveItem()
    }
    
    if (currentItemIndex < itens.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    } else {
      setShowFinalStep(true)
    }
  }

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
    }
  }

  const handleFinalizarVistoria = async () => {
    try {
      setIsLoading(true)
      await finalizarVistoria(fotoQuarto)
      onFinalizar()
    } catch (err) {
      console.error('Erro ao finalizar vistoria:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getProgress = () => {
    if (showFinalStep) return 100
    return itens.length > 0 ? ((currentItemIndex + 1) / itens.length) * 100 : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando vistoria...</p>
          </div>
        </div>
      </div>
    )
  }

  if (showFinalStep) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                Quarto {quarto.numero}
              </h1>
              <p className="text-sm text-gray-600">Finalizar Vistoria</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Final Step Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                Vistoria Concluída
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação Geral do Quarto (opcional)
                </label>
                <Textarea
                  placeholder="Deixe um comentário geral sobre o estado do quarto..."
                  value={avaliacaoGeral}
                  onChange={(e) => setAvaliacaoGeral(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Geral do Quarto (opcional)
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setFotoQuarto(file.name)
                    }
                  }}
                  className="cursor-pointer"
                />
                {fotoQuarto && (
                  <p className="text-sm text-gray-600 mt-2">
                    Foto selecionada: {fotoQuarto}
                  </p>
                )}
              </div>

              <Button 
                onClick={handleFinalizarVistoria} 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Finalizando...' : 'Finalizar Vistoria'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-12">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum item encontrado</h2>
            <p className="text-gray-600">Nenhum item cadastrado para vistoria</p>
            <Button onClick={onBack} className="mt-4">
              Voltar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              Quarto {quarto.numero}
            </h1>
            <p className="text-sm text-gray-600">
              Item {currentItemIndex + 1} de {itens.length}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Item Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              {currentItem.nome}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={status === 'OK' ? 'default' : 'outline'}
                className={cn(
                  "gap-2 h-12",
                  status === 'OK' && "bg-green-500 hover:bg-green-600 text-white"
                )}
                onClick={() => handleStatusChange('OK')}
              >
                <CheckCircle className="w-5 h-5" />
                OK
              </Button>
              <Button
                variant={status === 'NAO_OK' ? 'default' : 'outline'}
                className={cn(
                  "gap-2 h-12",
                  status === 'NAO_OK' && "bg-red-500 hover:bg-red-600 text-white"
                )}
                onClick={() => handleStatusChange('NAO_OK')}
              >
                <XCircle className="w-5 h-5" />
                Não OK
              </Button>
            </div>

                  {status === 'NAO_OK' && (
                    <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentário
                      </label>
                      <Textarea
                      placeholder="Descreva o problema encontrado..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={3}
                      />
                    </div>

                    {/* <UploadFoto 
                      title="Foto"
                      optional={true}
                      fotoUrl={foto.name}
                      onSaveFoto={setFoto}
                    /> */}
                    <div className="flex justify-center items-center mt-4">
                      {status !== null && (
                      <Button
                        variant="outline"
                        onClick={handleSaveItem}
                        disabled={isLoading}
                        className="gap-2 bg-green-500"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </Button>
                      )}
                    </div>
                    </div>
                  )}
                  </CardContent>
                </Card>

                {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentItemIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-2">
          
          </div>

          <Button
            onClick={handleNext}
            disabled={status === null}
            className="gap-2"
          >
            {currentItemIndex === itens.length - 1 ? 'Finalizar' : 'Próximo'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Status indicator */}
        {status && (
          <div className="mt-4 text-center">
            <Badge 
              variant={status === 'OK' ? 'success' : 'warning'}
              className="gap-1"
            >
              {status === 'OK' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {status === 'OK' ? 'Item Aprovado' : 'Item com Problema'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

export default Vistoria

