export const originalModel = Object.freeze({
  url: '/models/rua7-movimento-v2.glb',
  approximate: false,
  illustrative: true,
  note: 'Conceito original Rua 7. Imagens e modelo ilustrativos; produto ainda não disponível para venda.',
});

export function getProductModel(product) {
  if (product.modelUrl) return { url: product.modelUrl, approximate: false, note: '' };
  return product.id === 'tenis-floral' ? originalModel : null;
}
