import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PrevisaoCaixa } from "@/components/Financeiro/tipos";
import { Requisicao } from "@/components/Solicitante/tipos";
import { ItemCotacao } from "@/components/Compras/tipos";

interface AppContextType {
  // Estados
  previsoesFinanceiras: PrevisaoCaixa[];
  requisicoes: Requisicao[];
  itensCompras: ItemCotacao[];
  
  // Actions - Financeiro
  adicionarPrevisao: (previsao: PrevisaoCaixa) => void;
  
  // Actions - Solicitante
  adicionarRequisicao: (requisicao: Omit<Requisicao, 'id'>) => Requisicao;
  
  // Actions - CEO
  atualizarRequisicao: (id: string, dados: Partial<Requisicao>) => void;
  aprovarRequisicao: (id: string, itensAprovados: ItemCotacao[]) => void;
  
  // Actions - Compras
  atualizarItemCompra: (itemId: string, dados: Partial<ItemCotacao>) => void;
  finalizarCotacao: (idRequisicao: string) => void;
  
  // Helpers
  obterDisponibilidadeGlobal: () => number;
  obterProximoIdRequisicao: () => string;
  
  // Reset
  limparDados: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "app_demo_data";

interface StoredData {
  previsoesFinanceiras: PrevisaoCaixa[];
  requisicoes: Requisicao[];
  itensCompras: ItemCotacao[];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [previsoesFinanceiras, setPrevisoesFinanceiras] = useState<PrevisaoCaixa[]>([]);
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [itensCompras, setItensCompras] = useState<ItemCotacao[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: StoredData = JSON.parse(saved);
        setPrevisoesFinanceiras(data.previsoesFinanceiras || []);
        setRequisicoes(data.requisicoes || []);
        setItensCompras(data.itensCompras || []);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    }
    setLoaded(true);
  }, []);

  // Salvar dados no localStorage quando mudar
  useEffect(() => {
    if (loaded) {
      const data: StoredData = {
        previsoesFinanceiras,
        requisicoes,
        itensCompras,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [previsoesFinanceiras, requisicoes, itensCompras, loaded]);

  // === FINANCEIRO ===
  const adicionarPrevisao = (previsao: PrevisaoCaixa) => {
    setPrevisoesFinanceiras(prev => [...prev, previsao]);
  };

  const obterDisponibilidadeGlobal = () => {
    return previsoesFinanceiras.reduce((acc, p) => acc + p.valor, 0);
  };

  // === SOLICITANTE ===
  const obterProximoIdRequisicao = () => {
    const maxId = requisicoes.reduce((max, req) => {
      const num = parseInt(req.id.replace('#REQ-', ''));
      return num > max ? num : max;
    }, 0);
    return `#REQ-${String(maxId + 1).padStart(3, '0')}`;
  };

  const adicionarRequisicao = (dados: Omit<Requisicao, 'id'>): Requisicao => {
    const novaRequisicao: Requisicao = {
      ...dados,
      id: obterProximoIdRequisicao(),
    };
    setRequisicoes(prev => [novaRequisicao, ...prev]);
    return novaRequisicao;
  };

  // === CEO ===
  const atualizarRequisicao = (id: string, dados: Partial<Requisicao>) => {
    setRequisicoes(prev => 
      prev.map(req => req.id === id ? { ...req, ...dados } : req)
    );
  };

  const aprovarRequisicao = (id: string, itensAprovados: ItemCotacao[]) => {
    // Atualiza status da requisição
    setRequisicoes(prev => 
      prev.map(req => req.id === id 
        ? { ...req, status: 'aprovado', etapaAtual: 2 } 
        : req
      )
    );
    // Adiciona itens à fila de compras
    setItensCompras(prev => [...prev, ...itensAprovados]);
  };

  // === COMPRAS ===
  const atualizarItemCompra = (itemId: string, dados: Partial<ItemCotacao>) => {
    setItensCompras(prev => 
      prev.map(item => item.id === itemId ? { ...item, ...dados } : item)
    );
  };

  const finalizarCotacao = (idRequisicao: string) => {
    setRequisicoes(prev => 
      prev.map(req => req.id === idRequisicao 
        ? { ...req, status: 'aguardando_ratificacao', etapaAtual: 3 } 
        : req
      )
    );
  };

  // === RESET ===
  const limparDados = () => {
    setPrevisoesFinanceiras([]);
    setRequisicoes([]);
    setItensCompras([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        previsoesFinanceiras,
        requisicoes,
        itensCompras,
        adicionarPrevisao,
        adicionarRequisicao,
        atualizarRequisicao,
        aprovarRequisicao,
        atualizarItemCompra,
        finalizarCotacao,
        obterDisponibilidadeGlobal,
        obterProximoIdRequisicao,
        limparDados,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp deve ser usado dentro de um AppProvider");
  }
  return context;
}
