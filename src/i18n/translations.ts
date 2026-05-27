const translations = {
  en: {
    siteName: 'IE Tax Calc',

    // Hero
    heroTitle: 'How much will you take home?',
    heroSubtitle: 'Enter your salary and see your exact net pay after Irish taxes — instantly.',
    taxYear: '2026 tax rates · Budget Oct 2025',

    // Input tabs
    annualLabel:  'Annual',
    monthlyLabel: 'Monthly',
    hourlyLabel:  'Hourly',

    // Salary input
    inputPlaceholder:  'e.g. 45,000',
    hourlyPlaceholder: 'e.g. 25.50',
    inputPrefix: '€',

    // Hourly options
    hoursPerWeekLabel: 'hrs/week',
    hoursTags: { stamp2Term: 'Stamp 2', fullTime: 'full-time' },
    hourlyHint: 'year gross',

    // Quick presets
    presetsLabel: 'Quick pick:',

    // Results hero
    takeHome:       'Take-Home',
    perYear:        '/year',
    perMonth:       '/month',
    effectiveRate:  'Effective rate',
    totalDeductions:'Total deductions',
    marginalRate:   'Marginal rate',

    // Breakdown table
    breakdown:    'Full Breakdown',
    grossSalary:  'Gross Salary',
    incomeTax:    'Income Tax',
    usc:          'USC',
    prsi:         'PRSI',
    netTakeHome:  'Net Take-Home',
    deductions:   'deductions',

    // Visual bar labels
    netLabel: 'Net',

    // Pension optimizer
    pensionTitle:        '🏦 Pension Tax Optimizer',
    pensionSubtitle:     'Contributions cut Income Tax only — not USC or PRSI',
    pensionContribLabel: 'Annual contribution',
    pensionContribPlaceholder: 'e.g. 5,000',
    pensionYouPutIn:     'You put in',
    pensionTaxSaved:     'Tax saved',
    pensionNetCost:      'Your real cost',
    pensionAtRate:       'at marginal rate',
    pensionNetCostNote:  'is what the pension actually costs you after tax relief',
    pensionZeroTax:      'No income tax payable at this salary — credits absorb all tax. Pension contributions still build your retirement fund.',
    pensionAgeNote:      'Max contribution % varies by age — Revenue.ie',
    pensionExample:      'Example: contribute €5,000 at 40% → save €2,000 in tax → real cost: €3,000',

    // Tax Saving Tips
    tipsTitle: '💡 Tax Saving Tips for Immigrants',
    tip1Title: 'Rent Tax Credit',
    tip1Value: 'Save €1,000/yr',
    tip1Body:  'If you rent in Ireland, you\'re entitled to a €1,000 tax credit per year. Claim it in minutes on Revenue myAccount → Tax Credits → Rent Tax Credit. Many immigrants never claim this.',
    tip2Title: 'Pension Contributions',
    tip2Value: 'Up to 40% relief',
    tip2Body:  'Every €1 you put in a pension costs you as little as €0.60 after tax relief (if you\'re on the 40% rate). Ask your employer about a PRSA or occupational pension scheme. The government gives back the tax.',
    tip3Title: 'Bike to Work Scheme',
    tip3Value: 'Up to €1,500 off',
    tip3Body:  'Your employer can buy you a bike (up to €1,500) and deduct it from your gross salary before tax. You save Income Tax + USC + PRSI on the amount — typically 30–52% off the price. Ask HR to set it up.',
    tip4Title: 'Medical Expenses',
    tip4Value: '20% back',
    tip4Body:  'Keep receipts for doctors, dentists, prescriptions, physio, optician. Claim 20% back via Revenue myAccount → Health expenses. Trips home for treatment can also qualify.',
    tip5Title: 'Remote Work Relief',
    tip5Value: '€200–€500/yr',
    tip5Body:  'If you work from home, claim 30% of heating, electricity and broadband costs for each WFH day. Track your days and bills. Claim on Revenue myAccount. Easy win most people skip.',
    tip6Title: 'Check Your Credits on Revenue',
    tip6Value: 'Free money',
    tip6Body:  'Login to Revenue myAccount and check "Manage Your Tax Credits". Many immigrants miss the Personal Tax Credit, Home Carer Credit, or Single Person Child Carer Credit. Each is worth hundreds per year.',

    // How it works
    howItWorksTitle: '📖 How Ireland taxes you',
    incomeTaxInfo:   '20% on the first €42,000 · 40% above that. Reduced by €3,750 in standard credits (personal + PAYE). Credits mean the first ~€18,750 earns zero income tax.',
    uscInfo:         '0.5% → 2% → 4% → 8% in salary bands. Exempt if total income ≤ €13,000. No credits apply — everyone pays from €1.',
    prsiInfo:        '4% flat on all earnings for PAYE employees earning over €352/week (€18,304/yr). Funds jobseeker, maternity leave & state pension.',

    // Min wage
    minWageTitle:   '💼 Minimum Wage',
    minWageHourly:  '€13.50/hr',
    minWageDesc:    '39 hrs/wk · 52 weeks = €27,378/yr gross → ~€24,000 net.',
    calcMinWage:    'Calculate minimum wage →',
    selectedLabel:  '✓ Selected',

    // Stamp 2
    stamp2Title: '📋 Studying on a Stamp 2?',
    stamp2Body:  'Work 20 hrs/week during term · 40 hrs/week during holidays (Jun–Sep + Dec–Jan). Same tax rates apply. At student income levels, USC is often zero and income tax near zero after credits.',

    // Sponsor CTA
    sponsorCta:  'Looking for a work permit sponsor after studying?',
    sponsorLink: 'Browse 18,000+ companies on ie-work-permits.com →',

    disclaimer: 'Estimates only · Single person · Standard credits · No pension or additional deductions · Verify with Revenue.ie',
    language: 'Language',
  },

  pt: {
    siteName: 'IE Tax Calc',

    heroTitle: 'Quanto você vai receber?',
    heroSubtitle: 'Insira seu salário e veja o líquido após os impostos irlandeses — na hora.',
    taxYear: 'Alíquotas 2026 · Budget out/2025',

    annualLabel:  'Anual',
    monthlyLabel: 'Mensal',
    hourlyLabel:  'Por hora',

    inputPlaceholder:  'ex: 45.000',
    hourlyPlaceholder: 'ex: 25,50',
    inputPrefix: '€',

    hoursPerWeekLabel: 'h/semana',
    hoursTags: { stamp2Term: 'Stamp 2', fullTime: 'integral' },
    hourlyHint: 'ano bruto',

    presetsLabel: 'Escolha rápida:',

    takeHome:        'Salário Líquido',
    perYear:         '/ano',
    perMonth:        '/mês',
    effectiveRate:   'Taxa efetiva',
    totalDeductions: 'Total descontos',
    marginalRate:    'Alíquota marginal',

    breakdown:   'Detalhamento',
    grossSalary: 'Salário Bruto',
    incomeTax:   'Imposto de Renda',
    usc:         'USC',
    prsi:        'PRSI',
    netTakeHome: 'Salário Líquido',
    deductions:  'descontos',

    netLabel: 'Líquido',

    pensionTitle:        '🏦 Otimizador de Previdência',
    pensionSubtitle:     'Contribuições reduzem apenas o Imposto de Renda — não USC ou PRSI',
    pensionContribLabel: 'Contribuição anual',
    pensionContribPlaceholder: 'ex: 5.000',
    pensionYouPutIn:     'Você coloca',
    pensionTaxSaved:     'Imposto economizado',
    pensionNetCost:      'Seu custo real',
    pensionAtRate:       'na alíquota marginal',
    pensionNetCostNote:  'é o que a previdência realmente custa após o benefício fiscal',
    pensionZeroTax:      'Sem imposto de renda neste salário — os créditos absorvem tudo. As contribuições ainda constroem seu fundo de aposentadoria.',
    pensionAgeNote:      'Limite máximo de contribuição varia por idade — Revenue.ie',
    pensionExample:      'Exemplo: contribui €5.000 a 40% → economiza €2.000 em impostos → custo real: €3.000',

    tipsTitle: '💡 Dicas de Economia de Impostos para Imigrantes',
    tip1Title: 'Crédito Fiscal de Aluguel',
    tip1Value: 'Economize €1.000/ano',
    tip1Body:  'Se você aluga na Irlanda, tem direito a um crédito fiscal de €1.000 por ano. Solicite em minutos no Revenue myAccount → Créditos Fiscais → Rent Tax Credit. Muitos imigrantes nunca pedem isso.',
    tip2Title: 'Contribuições de Previdência',
    tip2Value: 'Até 40% de alívio',
    tip2Body:  'Cada €1 em previdência custa só €0,60 após o benefício fiscal (se você está na alíquota de 40%). Pergunte ao seu empregador sobre PRSA ou plano de pensão ocupacional. O governo devolve o imposto.',
    tip3Title: 'Esquema Bike to Work',
    tip3Value: 'Até €1.500 de desconto',
    tip3Body:  'Seu empregador compra uma bicicleta (até €1.500) e desconta do seu salário bruto antes dos impostos. Você economiza Imposto de Renda + USC + PRSI — tipicamente 30–52% do preço. Peça ao RH.',
    tip4Title: 'Despesas Médicas',
    tip4Value: '20% de volta',
    tip4Body:  'Guarde recibos de médico, dentista, receitas, fisioterapia, óptica. Peça 20% de volta no Revenue myAccount → Health expenses. Viagens ao Brasil para tratamento também podem se qualificar.',
    tip5Title: 'Auxílio Home Office',
    tip5Value: '€200–€500/ano',
    tip5Body:  'Se trabalha de casa, reclame 30% dos custos de aquecimento, eletricidade e internet por dia de home office. Registre os dias e guarde as contas. Solicite no Revenue myAccount.',
    tip6Title: 'Verifique Seus Créditos no Revenue',
    tip6Value: 'Dinheiro grátis',
    tip6Body:  'Acesse o Revenue myAccount e veja "Manage Your Tax Credits". Muitos imigrantes perdem o Personal Tax Credit, Home Carer Credit ou Single Person Child Carer Credit. Cada um vale centenas por ano.',

    howItWorksTitle: '📖 Como a Irlanda tributa',
    incomeTaxInfo:   '20% sobre os primeiros €42.000 · 40% acima disso. Reduzido por €3.750 em créditos padrão (pessoal + PAYE). Os créditos fazem com que os primeiros ~€18.750 não paguem imposto de renda.',
    uscInfo:         '0,5% → 2% → 4% → 8% em faixas salariais. Isento se renda total ≤ €13.000. Sem créditos — todos pagam desde €1.',
    prsiInfo:        '4% fixo sobre todo o salário para funcionários PAYE que ganham mais de €352/semana (€18.304/ano). Financia desemprego, licença-maternidade e aposentadoria.',

    minWageTitle:  '💼 Salário Mínimo',
    minWageHourly: '€13,50/hora',
    minWageDesc:   '39h/sem · 52 semanas = €27.378/ano bruto → ~€24.000 líquido.',
    calcMinWage:   'Calcular salário mínimo →',
    selectedLabel: '✓ Selecionado',

    stamp2Title: '📋 Estudando com Stamp 2?',
    stamp2Body:  '20h/sem durante o período letivo · 40h/sem nas férias (jun–set + dez–jan). Mesmas alíquotas. Em níveis de renda estudantil, o USC costuma ser zero e o imposto de renda próximo de zero após créditos.',

    sponsorCta:  'Procurando um sponsor de work permit após os estudos?',
    sponsorLink: 'Ver +18.000 empresas no ie-work-permits.com →',

    disclaimer: 'Estimativas · Pessoa solteira · Créditos padrão · Sem previdência ou deduções adicionais · Confirme no Revenue.ie',
    language: 'Idioma',
  },

  es: {
    siteName: 'IE Tax Calc',

    heroTitle: '¿Cuánto llevarás a casa?',
    heroSubtitle: 'Ingresa tu salario y ve tu sueldo neto después de los impuestos irlandeses — al instante.',
    taxYear: 'Tasas 2026 · Presupuesto oct/2025',

    annualLabel:  'Anual',
    monthlyLabel: 'Mensual',
    hourlyLabel:  'Por hora',

    inputPlaceholder:  'ej: 45.000',
    hourlyPlaceholder: 'ej: 25,50',
    inputPrefix: '€',

    hoursPerWeekLabel: 'h/semana',
    hoursTags: { stamp2Term: 'Stamp 2', fullTime: 'completa' },
    hourlyHint: 'año bruto',

    presetsLabel: 'Selección rápida:',

    takeHome:        'Salario Neto',
    perYear:         '/año',
    perMonth:        '/mes',
    effectiveRate:   'Tasa efectiva',
    totalDeductions: 'Total deducciones',
    marginalRate:    'Tipo marginal',

    breakdown:   'Desglose Completo',
    grossSalary: 'Salario Bruto',
    incomeTax:   'IRPF',
    usc:         'USC',
    prsi:        'PRSI',
    netTakeHome: 'Salario Neto',
    deductions:  'deducciones',

    netLabel: 'Neto',

    pensionTitle:        '🏦 Optimizador de Pensión',
    pensionSubtitle:     'Las aportaciones reducen solo el IRPF — no el USC ni el PRSI',
    pensionContribLabel: 'Aportación anual',
    pensionContribPlaceholder: 'ej: 5.000',
    pensionYouPutIn:     'Aportás',
    pensionTaxSaved:     'Impuesto ahorrado',
    pensionNetCost:      'Tu coste real',
    pensionAtRate:       'al tipo marginal',
    pensionNetCostNote:  'es lo que la pensión realmente te cuesta tras la deducción fiscal',
    pensionZeroTax:      'Sin IRPF a este salario — los créditos absorben todo el impuesto. Las aportaciones igualmente construyen tu fondo de jubilación.',
    pensionAgeNote:      'El límite máximo de aportación varía según la edad — Revenue.ie',
    pensionExample:      'Ejemplo: aportas €5.000 al 40% → ahorras €2.000 en impuestos → coste real: €3.000',

    tipsTitle: '💡 Consejos para Ahorrar en Impuestos',
    tip1Title: 'Crédito Fiscal por Alquiler',
    tip1Value: 'Ahorra €1.000/año',
    tip1Body:  'Si alquilas en Irlanda, tienes derecho a un crédito fiscal de €1.000 al año. Solicítalo en minutos en Revenue myAccount → Tax Credits → Rent Tax Credit. Muchos inmigrantes nunca lo reclaman.',
    tip2Title: 'Aportaciones a Pensión',
    tip2Value: 'Hasta 40% de deducción',
    tip2Body:  'Cada €1 en pensión te cuesta solo €0,60 tras la deducción fiscal (si tribulas al 40%). Pregunta a tu empresa por una PRSA o plan de pensión de empleo. El gobierno devuelve el impuesto.',
    tip3Title: 'Bike to Work',
    tip3Value: 'Hasta €1.500 de descuento',
    tip3Body:  'Tu empresa puede comprar una bicicleta (hasta €1.500) y descontarla de tu salario bruto antes de impuestos. Ahorras IRPF + USC + PRSI — típicamente 30–52% del precio. Pídelo a RRHH.',
    tip4Title: 'Gastos Médicos',
    tip4Value: '20% de vuelta',
    tip4Body:  'Guarda recibos de médicos, dentistas, recetas, fisio, óptica. Recupera el 20% en Revenue myAccount → Health expenses. Los viajes a tu país para tratamiento también pueden calificar.',
    tip5Title: 'Ayuda por Teletrabajo',
    tip5Value: '€200–€500/año',
    tip5Body:  'Si teletrabajas, reclama el 30% de calefacción, electricidad e internet por cada día en casa. Lleva registro de días y facturas. Solicítalo en Revenue myAccount.',
    tip6Title: 'Revisa Tus Créditos en Revenue',
    tip6Value: 'Dinero gratis',
    tip6Body:  'Entra en Revenue myAccount y revisa "Manage Your Tax Credits". Muchos inmigrantes pierden el Personal Tax Credit, Home Carer Credit o Single Person Child Carer Credit. Cada uno vale cientos al año.',

    howItWorksTitle: '📖 Cómo tributa Irlanda',
    incomeTaxInfo:   '20% sobre los primeros €42.000 · 40% por encima. Reducido por €3.750 en créditos estándar (personal + PAYE). Los créditos hacen que los primeros ~€18.750 no paguen IRPF.',
    uscInfo:         '0,5% → 2% → 4% → 8% en tramos salariales. Exento si ingresos totales ≤ €13.000. Sin créditos — todos pagan desde €1.',
    prsiInfo:        '4% fijo sobre todos los ingresos para empleados PAYE que ganan más de €352/semana (€18.304/año). Financia desempleo, baja maternal y pensión estatal.',

    minWageTitle:  '💼 Salario Mínimo',
    minWageHourly: '€13,50/hora',
    minWageDesc:   '39h/sem · 52 semanas = €27.378/año bruto → ~€24.000 neto.',
    calcMinWage:   'Calcular salario mínimo →',
    selectedLabel: '✓ Seleccionado',

    stamp2Title: '📋 ¿Estudiando con Stamp 2?',
    stamp2Body:  '20h/sem durante el período lectivo · 40h/sem en vacaciones (jun–sep + dic–ene). Mismas tasas. Con ingresos de estudiante, el USC suele ser cero y el IRPF casi cero tras créditos.',

    sponsorCta:  '¿Buscas un sponsor de permiso de trabajo después de estudiar?',
    sponsorLink: 'Ver +18.000 empresas en ie-work-permits.com →',

    disclaimer: 'Estimaciones · Persona soltera · Créditos estándar · Sin pensión ni deducciones adicionales · Verifica en Revenue.ie',
    language: 'Idioma',
  },
} as const

export type Language = keyof typeof translations
export type T = typeof translations['en']
export default translations
