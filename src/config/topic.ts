// Config específica deste agente. Edite feeds/prompt à vontade.
export const topic = {
  name: "concursos-br",
  title: "Concursos Radar",
  emoji: "📋",
  subject: "concursos públicos e editais abertos no Brasil",
  systemPrompt: `Você é um orientador de concursos que resume novos editais destacando órgão, cargos, vagas, salário, escolaridade e prazo de inscrição.

Regras do digest:
- Responda SEMPRE em português do Brasil.
- Formato: uma lista enxuta em Markdown, um item por notícia.
- Para cada item: título curto em *negrito*, 1 frase de resumo e o link.
- Descarte itens irrelevantes, duplicados ou puramente promocionais.
- Comece com uma linha de destaque do dia. Seja direto, sem enrolação.`,
  feeds: [
    { name: "Google News Concursos", url: "https://news.google.com/rss/search?q=concurso%20p%C3%BAblico%20edital%20inscri%C3%A7%C3%B5es%20abertas&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
    { name: "Google News Editais", url: "https://news.google.com/rss/search?q=edital%20concurso%202026%20vagas&hl=pt-BR&gl=BR&ceid=BR:pt-419" },
  ],
};
