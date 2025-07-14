import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useVistoria(quartoId) {
  const [vistoria, setVistoria] = useState(null)
  const [itens, setItens] = useState([])
  const [vistoriaItens, setVistoriaItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (quartoId) {
      fetchVistoria()
      fetchItens()
    }
  }, [quartoId])

  const fetchVistoria = async () => {
    try {
      // Buscar vistoria existente ou mais recente do quarto
      const { data, error } = await supabase
        .from('vistorias')
        .select('*')
        .eq('id_quarto', quartoId)
        .order('data', { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setVistoria(data[0])
        await fetchVistoriaItens(data[0].id)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchItens = async () => {
    try {
      const { data, error } = await supabase
        .from('itens')
        .select('*')
        .order('nome')

      if (error) throw error
      setItens(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchVistoriaItens = async (vistoriaId) => {
    try {
      const { data, error } = await supabase
        .from('vistoria_itens')
        .select(`
          *,
          itens(nome)
        `)
        .eq('vistoria_id', vistoriaId)

      if (error) throw error
      setVistoriaItens(data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const criarVistoria = async () => {
    try {
      const { data, error } = await supabase
        .from('vistorias')
        .insert({
          id_quarto: quartoId,
          data: new Date().toISOString().split('T')[0], // Format as yyyy-mm-dd
          status: 'INICIADA'
        })
        .select()
        .single()

      if (error) throw error

      setVistoria(data)
      setVistoriaItens([])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const salvarItemVistoria = async (itemId, dados) => {
    try {
      if (!vistoria) throw new Error('Vistoria não encontrada')
      
        let resultado

      // Verificar se já existe um registro para este item
      const existente = vistoriaItens.find(vi => vi.item_id === itemId)

      if (existente) {
        // Enviar foto para o bucket 'vistorias'
        console.log('Dados da foto:', dados.foto)
        if (dados.foto) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('vistorias')
            .upload(`public/${itemId}${new Date().getTime()}.jpg`, dados.foto.data, {
              cacheControl: '3600',
              upsert: true
            })

          if (uploadError) throw uploadError

          // Atualizar dados com URL da foto
          dados.foto = uploadData.path
        }
        // Atualizar registro existente
        const { data, error } = await supabase
          .from('vistoria_itens')
          .update(dados)
          .eq('id', existente.id)
          .select(`
            *,
            itens(nome)
          `)
          .single()

        if (error) throw error
        resultado = data

        // Atualizar estado local
        setVistoriaItens(prev => 
          prev.map(item => item.id === existente.id ? resultado : item)
        )
      } else {
        // Criar novo registro
        const { data, error } = await supabase
          .from('vistoria_itens')
          .insert({
            vistoria_id: vistoria.id,
            item_id: itemId,
            ...dados
          })
          .select(`
            *,
            itens(nome)
          `)
          .single()

        if (error) throw error
        resultado = data

        // Adicionar ao estado local
        setVistoriaItens(prev => [...prev, resultado])
      }

      return resultado
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const finalizarVistoria = async (fotoQuarto = null) => {
    try {
      if (!vistoria) throw new Error('Vistoria não encontrada')
      const hasItensProblematicos = vistoriaItens.some(vi => vi.comentario || vi.foto)
      const updateData = { status: hasItensProblematicos ? 'COM_PROBLEMAS' : 'FINALIZADA' }
      if (fotoQuarto) {
        updateData.foto_quarto = fotoQuarto
      }

      const { data, error } = await supabase
        .from('vistorias')
        .update(updateData)
        .eq('id', vistoria.id)
        .select()
        .single()

      if (error) throw error

      setVistoria(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const getItemVistoria = (itemId) => {
    return vistoriaItens.find(vi => vi.item_id === itemId)
  }

  const getLastItemVistoria = (vistoria) => {
    const itensFiltrados = vistoriaItens.filter(vi => vi.item_id === vistoria.item_id)
    return itensFiltrados.length > 0 ? itensFiltrados[0] : null
  }

  const getItensNaoAvaliados = () => {
    return itens.filter(item => !getItemVistoria(item.id))
  }

  const getTodosItensAvaliados = () => {
    return itens.length > 0 && vistoriaItens.length === itens.length
  }

  return {
    vistoria,
    itens,
    vistoriaItens,
    loading,
    error,
    criarVistoria,
    salvarItemVistoria,
    finalizarVistoria,
    getItemVistoria,
    getItensNaoAvaliados,
    getTodosItensAvaliados,
    refetch: fetchVistoria
  }
}

