/**
 * Interface para gerenciamento de navegação entre rotas
 */
export interface IRouter {
  /**
   * Navega para uma rota específica
   * @param route - Caminho da rota de destino
   */
  forward(route: string): void;

  /**
   * Volta para a rota anterior no histórico de navegação
   */
  back(): void;
}
