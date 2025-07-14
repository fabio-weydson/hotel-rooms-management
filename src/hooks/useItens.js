import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useItens = () => {
    const [itens, setItens] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        fetchItens()
    }, [])
    
    const fetchItens = async () => {
        try {
        setLoading(true)
        setError(null)
    
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
    
    return { itens, loading, error }
}