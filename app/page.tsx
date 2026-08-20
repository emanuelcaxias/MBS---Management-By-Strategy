'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'

type Module = 'MBI' | 'MBO / PLR' | 'Catálogo' | 'MASP' | 'Projetos'
type Tone = 'green' | 'yellow' | 'red' | 'blue'

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const indicators = [
  { code: 'KPI-001', name: 'Receita líquida', owner: 'Financeiro', target: 'R$ 12,5 mi', values: [92, 96, 98, 101, 104, 102, 105, 108, 111, 113, 116, 118], tone: 'green' as Tone },
  { code: 'KPI-002', name: 'Margem EBITDA', owner: 'Controladoria', target: '18,0%', values: [16, 17, 18, 17, 19, 18, 20, 19, 21, 20, 22, 21], tone: 'green' as Tone },
  { code: 'KPI-003', name: 'NPS clientes', owner: 'Customer Success', target: '75 pts', values: [74, 72, 69, 71, 70, 73, 76, 78, 77, 79, 81, 82], tone: 'blue' as Tone },
  { code: 'KPI-004', name: 'Churn mensal', owner: 'Comercial', target: '< 2,5%', values: [2.1, 2.4, 2.8, 2.6, 2.3, 2.2, 2.0, 2.1, 2.4, 2.6, 2.2, 2.0], tone: 'yellow' as Tone },
  { code: 'KPI-005', name: 'Entrega no prazo', owner: 'Operações', target: '95%', values: [94, 95, 93, 91, 92, 94, 96, 97, 96, 95, 97, 98], tone: 'green' as Tone },
  { code: 'KPI-006', name: 'Horas de treinamento', owner: 'Pessoas', target: '420 h', values: [80, 120, 165, 190, 225, 260, 290, 315, 340, 370, 395, 418], tone: 'blue' as Tone },
]

const nav = [
  { label: 'Acompanhamento MBI', icon: Activity, module: 'MBI' as Module },
  { label: 'MBO / PLR', icon: Target, module: 'MBO / PLR' as Module },
  { label: 'Catálogo de Indicadores', icon: BookOpen, module: 'Catálogo' as Module },
  { label: 'MASP', icon: ClipboardCheck, module: 'MASP' as Module },
  { label: 'Projetos', icon: FileText, module: 'Projetos' as Module },
]

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`badge badge-${tone}`}><span className="badge-dot" />{children}</span>
}

function Sparkline({ values, tone }: { values: number[]; tone: Tone }) {
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - ((value - Math.min(...values)) / (Math.max(...values) - Math.min(...values) || 1)) * 72 - 14}`).join(' ')
  return <svg className={`sparkline sparkline-${tone}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} fill="none" vectorEffect="non-scaling-stroke" /></svg>
}

function Sidebar({ active, onSelect, collapsed, setCollapsed }: { active: Module; onSelect: (module: Module) => void; collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  return <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <div className="brand"><div className="brand-mark">M</div>{!collapsed && <div><strong>MBS</strong><span>Management Business System</span></div>}</div>
    <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Alternar menu"><PanelLeftClose size={16} /></button>
    {!collapsed && <p className="nav-label">VISÃO GERAL</p>}
    <nav className="nav-list">{nav.map(({ label, icon: Icon, module }) => <button key={module} className={`nav-item ${active === module ? 'nav-active' : ''}`} onClick={() => onSelect(module)} title={label}><Icon size={17} />{!collapsed && <span>{label}</span>}{!collapsed && module === 'MBI' && <span className="nav-count">6</span>}</button>)}</nav>
    {!collapsed && <><p className="nav-label nav-label-space">ADMINISTRAÇÃO</p><button className="nav-item"><Settings size={17} /><span>Configurações</span></button><button className="nav-item"><Users size={17} /><span>Usuários e acessos</span></button></>}
    <div className="sidebar-bottom"><button className="nav-item"><Bell size={17} />{!collapsed && <span>Central de alertas</span>}</button>{!collapsed && <div className="help-card"><span>Precisa de ajuda?</span><button>Falar com suporte</button></div>}</div>
  </aside>
}

function Header({ module, onOpenDetails }: { module: Module; onOpenDetails: () => void }) {
  return <header className="topbar"><div className="mobile-brand"><div className="brand-mark">M</div><strong>MBS</strong></div><div className="crumb"><span>Gestão</span><ChevronRight size={14} /><strong>{module}</strong></div><div className="top-actions"><div className="search"><Search size={15} /><input placeholder="Buscar no MBS" aria-label="Buscar" /></div><button className="icon-btn" aria-label="Notificações"><Bell size={17} /><i /></button><button className="avatar" onClick={onOpenDetails}>EC</button><div className="user-name"><strong>Eduardo Costa</strong><span>Administrador</span></div><ChevronDown size={14} /></div></header>
}

function SummaryCards() {
  const cards = [{ title: 'Indicadores ativos', value: '36', detail: '34 acompanhados', icon: BarChart3, tone: 'blue', change: '+8,2%' }, { title: 'Dentro da meta', value: '72%', detail: '26 de 36 indicadores', icon: TrendingUp, tone: 'green', change: '+4,5%' }, { title: 'Pontos de atenção', value: '05', detail: 'Requerem acompanhamento', icon: AlertTriangle, tone: 'yellow', change: '-2 este mês' }, { title: 'Projetos em andamento', value: '08', detail: '3 entregas esta semana', icon: ClipboardCheck, tone: 'purple', change: '+1 novo' }]
  return <div className="summary-grid">{cards.map(({ title, value, detail, icon: Icon, tone, change }) => <div className="summary-card" key={title}><div className={`summary-icon summary-${tone}`}><Icon size={18} /></div><div className="summary-copy"><span>{title}</span><strong>{value}</strong><small>{detail}</small></div><span className={`summary-change ${tone}`}>{change}</span></div>)}</div>
}

function IndicatorTable({ onSelect }: { onSelect: (indicator: typeof indicators[number]) => void }) {
  const [filter, setFilter] = useState('Todos')
  const filtered = useMemo(() => filter === 'Todos' ? indicators : indicators.filter((item) => item.tone === filter), [filter])
  return <section className="table-card"><div className="section-head"><div><h2>Acompanhamento mensal</h2><p>Visão consolidada dos indicadores estratégicos</p></div><div className="table-actions"><div className="select-wrap"><CalendarDays size={14} /><select aria-label="Período"><option>2025 · Ano completo</option><option>2024 · Ano completo</option></select><ChevronDown size={14} /></div><div className="filter-tabs">{['Todos', 'green', 'yellow', 'red'].map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item === 'Todos' ? 'Todos' : item === 'green' ? 'Na meta' : item === 'yellow' ? 'Atenção' : 'Crítico'}</button>)}</div></div></div><div className="table-scroll"><table><thead><tr><th className="indicator-col">Indicador</th>{months.map((month) => <th key={month}>{month}</th>)}<th>YTD</th><th /></tr></thead><tbody>{filtered.map((indicator) => { const avg = Math.round(indicator.values.reduce((a, b) => a + b, 0) / indicator.values.length); return <tr key={indicator.code} onClick={() => onSelect(indicator)}><td className="indicator-cell"><div className="indicator-title"><span className={`indicator-dot dot-${indicator.tone}`} /><div><strong>{indicator.name}</strong><small>{indicator.code} · {indicator.owner}</small></div></div></td>{indicator.values.map((value, index) => <td key={`${indicator.code}-${index}`}><span className={`cell-status status-${index > 7 && indicator.tone === 'green' ? 'green' : indicator.tone}`}>{value}{indicator.name === 'Margem EBITDA' ? '%' : indicator.name === 'Churn mensal' ? '%' : ''}</span></td>)}<td className="ytd-cell"><strong>{avg}{indicator.name.includes('Margem') || indicator.name.includes('Churn') ? '%' : ''}</strong><small><ArrowUpRight size={12} /> 3,2%</small></td><td><MoreHorizontal size={16} className="muted-icon" /></td></tr> })}</tbody></table></div><div className="table-footer"><span>Exibindo {filtered.length} de 36 indicadores</span><div className="pagination"><button aria-label="Página anterior"><ChevronLeft size={15} /></button><span>1 / 4</span><button aria-label="Próxima página"><ChevronRight size={15} /></button></div></div></section>
}

function SecondaryPanels() {
  return <div className="secondary-grid"><section className="panel-card"><div className="section-head compact"><div><h2>Radar de desempenho</h2><p>Distribuição por status</p></div><button className="more-btn"><MoreHorizontal size={16} /></button></div><div className="radar-content"><div className="donut"><div><strong>72%</strong><span>na meta</span></div></div><div className="legend"><div><i className="legend-dot dot-green" /><span>Na meta</span><strong>26</strong></div><div><i className="legend-dot dot-yellow" /><span>Atenção</span><strong>07</strong></div><div><i className="legend-dot dot-red" /><span>Crítico</span><strong>03</strong></div></div></div></section><section className="panel-card"><div className="section-head compact"><div><h2>Próximas entregas</h2><p>Atividades do ciclo atual</p></div><button className="link-btn">Ver todas</button></div><div className="delivery-list"><div><span className="date-chip"><strong>18</strong><small>DEZ</small></span><div><strong>Fechamento MBI</strong><small>Responsáveis: líderes de área</small></div><Badge tone="yellow">Pendente</Badge></div><div><span className="date-chip"><strong>20</strong><small>DEZ</small></span><div><strong>Comitê de resultados</strong><small>Sala de reuniões · 14:00</small></div><Badge tone="blue">Agendado</Badge></div><div><span className="date-chip"><strong>23</strong><small>DEZ</small></span><div><strong>Revisão de metas 2026</strong><small>Diretoria executiva</small></div><Badge tone="green">Confirmado</Badge></div></div></section></div>
}

function ModulePlaceholder({ module }: { module: Module }) {
  return <div className="empty-module"><div className="empty-icon"><LayoutDashboard size={28} /></div><h2>{module}</h2><p>Este módulo está pronto para receber os fluxos de negócio do seu MBS.</p><button className="primary-btn">Configurar módulo</button></div>
}

function DetailDrawer({ indicator, onClose }: { indicator: typeof indicators[number] | null; onClose: () => void }) {
  if (!indicator) return null
  return <><button className="drawer-overlay" aria-label="Fechar detalhes" onClick={onClose} /><aside className="drawer"><div className="drawer-head"><div><span className="eyebrow">DETALHES DO INDICADOR</span><h2>{indicator.name}</h2><p>{indicator.code} · {indicator.owner}</p></div><button className="icon-btn" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div><div className="drawer-score"><div><span>Resultado YTD</span><strong>{indicator.values[indicator.values.length - 1]}{indicator.name.includes('Margem') || indicator.name.includes('Churn') ? '%' : ''}</strong></div><Badge tone={indicator.tone}>{indicator.tone === 'green' ? 'Na meta' : indicator.tone === 'yellow' ? 'Atenção' : 'Acompanhamento'}</Badge></div><div className="drawer-chart"><div className="chart-label"><span>Evolução no ano</span><small>Meta: {indicator.target}</small></div><Sparkline values={indicator.values} tone={indicator.tone} /><div className="chart-months">{months.filter((_, index) => index % 2 === 0).map((month) => <span key={month}>{month}</span>)}</div></div><div className="drawer-section"><h3>Planos MASP relacionados</h3><div className="masp-item"><span className="masp-status status-yellow" /><div><strong>Reduzir desvios de entrega</strong><small>Em andamento · 3 ações abertas</small></div><ChevronRight size={15} /></div><div className="masp-item"><span className="masp-status status-green" /><div><strong>Revisão do processo comercial</strong><small>Concluído em 12 dez</small></div><ChevronRight size={15} /></div></div><button className="secondary-btn">Abrir ficha completa</button></aside></>
}

export default function Page() {
  const [active, setActive] = useState<Module>('MBI')
  const [collapsed, setCollapsed] = useState(false)
  const [selectedIndicator, setSelectedIndicator] = useState<typeof indicators[number] | null>(null)
  const [showUser, setShowUser] = useState(false)
  return <main className="app-shell"><Sidebar active={active} onSelect={setActive} collapsed={collapsed} setCollapsed={setCollapsed} /><div className="workspace"><Header module={active} onOpenDetails={() => setShowUser(!showUser)} />{showUser && <div className="user-popover"><strong>Eduardo Costa</strong><span>Administrador do sistema</span><button>Meu perfil</button><button>Encerrar sessão</button></div>}<div className="content"><div className="page-heading"><div><span className="eyebrow">PAINEL DE CONTROLE</span><h1>{active === 'MBI' ? 'Acompanhamento MBI' : active}</h1><p>{active === 'MBI' ? 'Acompanhe os resultados e a evolução dos indicadores da organização.' : 'Módulo de gestão estratégica e acompanhamento do negócio.'}</p></div><div className="heading-actions"><button className="secondary-btn"><CalendarDays size={15} /> 01 Jan — 31 Dez 2025 <ChevronDown size={14} /></button><button className="primary-btn"><span>+</span> Novo registro</button></div></div>{active === 'MBI' ? <><SummaryCards /><IndicatorTable onSelect={setSelectedIndicator} /><SecondaryPanels /></> : <ModulePlaceholder module={active} />}</div></div><DetailDrawer indicator={selectedIndicator} onClose={() => setSelectedIndicator(null)} /></main>
}
