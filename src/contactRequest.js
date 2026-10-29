export function makeContactDraft({ type, email='', page='', message='' }) {
  const allowed = ['Acesso aos dados','Correção de dados','Exclusão de dados ou conta','Informações sobre privacidade','Dificuldade de acessibilidade','Atendimento'];
  if (!allowed.includes(type) || typeof message !== 'string' || message.trim().length < 10 || message.length > 1200) throw new Error('Escolha o assunto e descreva sua solicitação entre 10 e 1.200 caracteres.');
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>200)) throw new Error('Informe um e-mail válido.');
  if (typeof page!=='string' || page.length>150 || /[\r\n]/.test(page)) throw new Error('Revise a página informada.');
  const subject = `Rua 7 — ${type}`;
  const body = [`Assunto: ${type}`,email?`Retorno: ${email}`:'Retorno: responder ao remetente',page?`Página ou funcionalidade: ${page}`:'','Descrição:',message.trim()].filter(Boolean).join('\n');
  return { subject, body };
}
export function draftMailto(email, draft) { return `mailto:${email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`; }
