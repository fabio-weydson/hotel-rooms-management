import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useQuartos() {
  const [quartos, setQuartos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQuartos()
  }, [])

  const fetchQuartos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Buscar quartos com suas vistorias mais recentes
      const { data: quartosData, error: quartosError } = await supabase
        .from('quartos')
        .select(`
          *,
          vistorias(
            id,
            status,
            data,
            id_responsavel,
            foto_quarto
          )
        `)

      if (quartosError) throw quartosError

      // Processar dados para pegar apenas a vistoria mais recente de cada quarto
      const todosQuartos = quartosData.reduce((acc, quarto) => {
        const quartoExistente = acc.find(q => q.id === quarto.id)
        if (!quartoExistente) {
          acc.push({
            ...quarto,
            vistoria: quarto.vistorias[0] // Primeira vistoria (mais recente)
          })
        }
        return acc
      }, [])


      // Ordenar: não vistoriados primeiro, depois por status
      const quartosOrdenados = todosQuartos.sort((a, b) => {
        // Quartos com vistoria em andamento primeiro, depois sem vistoria
        if (!a.vistoria && b.vistoria) return 1
        if (a.vistoria && !b.vistoria) return -1
        
        // Se ambos têm vistoria, ordenar por status
        if (a.vistoria && b.vistoria) {
          const statusOrder = { 'NAO_INICIADA': 0, 'INICIADA': 1, 'FINALIZADA': 2 , 'COM_PROBLEMAS': 3 }
          return statusOrder[a.vistoria.status] - statusOrder[b.vistoria.status]
        }
        
        // Ordenar por número do quarto como critério secundário
        return a.numero - b.numero
      })

      setQuartos(quartosOrdenados)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { quartos, loading, error, refetch: fetchQuartos }
}

