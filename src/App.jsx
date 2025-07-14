import { useState } from 'react'
import HomePage from './pages/Home'
import VistoriaResumo from './pages/VistoriaResumo'
import Vistoria from './pages/Vistoria'
import {ItensList} from './pages/ItensList'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedQuarto, setSelectedQuarto] = useState(null)

  const handleQuartoSelect = (quarto) => {
    setSelectedQuarto(quarto)
    setCurrentView('resumo')
  }

  const handleIniciarVistoria = () => {
    setCurrentView('vistoria')
  }

  const handleEditarVistoria = () => {
    setCurrentView('vistoria')
  }

  const handleListItens = () => {
    console.log('Listando itens')
    setCurrentView('itens')
  }

  const handleBack = () => {
    if (currentView === 'vistoria') {
      setCurrentView('resumo')
    } else {
      setCurrentView('home')
      setSelectedQuarto(null)
    }
  }

  const handleFinalizarVistoria = () => {
    setCurrentView('resumo')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onQuartoSelect={handleQuartoSelect} onListItems={handleListItens} />
      
      case 'resumo':
        return (
          <VistoriaResumo 
            quarto={selectedQuarto}
            onBack={handleBack}
            onIniciarVistoria={handleIniciarVistoria}
            onEditarVistoria={handleEditarVistoria}
          />
        )
      
      case 'vistoria':
        return (
          <Vistoria 
            quarto={selectedQuarto}
            onBack={handleBack}
            onFinalizar={handleFinalizarVistoria}
          />
        )
      
      case 'itens':
        return (
          <ItensList 
            onItemSelect={()=>{}} // ensure to define handleItemSelect
          />
        )
      
      default:
        return <HomePage onQuartoSelect={handleQuartoSelect} onListItems={handleListItens} />
    }
  }

  return (
    <div className="App">
        {renderCurrentView()}
    </div>
  )
}

export default App
