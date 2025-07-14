import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, Plus } from 'lucide-react'


const VistoriaStatusBadge = (status) => {
    switch (status) {
      case 'NAO_INICIADA':
        return (
          <Badge variant="destructive" className="gap-1">
            <Clock className="w-3 h-3" />
            Não Iniciada
          </Badge>
        )
      case 'INICIADA':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            Em Andamento
          </Badge>
        )
      case 'FINALIZADA':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Finalizada
          </Badge>
        )
      case 'COM_PROBLEMAS':
        return (
          <Badge variant="warning" className="gap-1">
            <XCircle className="w-3 h-3" />
            Com Problemas
          </Badge>
        )
      default:
        return (
          <Badge variant="primary" className="gap-1">
            <Plus className="w-3 h-3" />
            Não Vistoriado
          </Badge>
        )
    }
  }

export { VistoriaStatusBadge }