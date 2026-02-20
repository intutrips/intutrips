export const APP_VERSION = {
  version: '1.0.6',
  buildDate: new Date().toISOString(),
  releaseNotes: [
    'Migração completa para Supabase',
    'Sistema de autenticação implementado',
    'Painel administrativo funcional',
    'Gestão de destinos, guias, depoimentos e países'
  ]
};

export const getVersionDisplay = () => {
  return `v${APP_VERSION.version} (${new Date(APP_VERSION.buildDate).toLocaleDateString('pt-BR')})`;
};
