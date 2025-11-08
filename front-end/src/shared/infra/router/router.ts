import type { IRouter } from "./router.interface";

/**
 * Implementação de router usando a API de History do navegador
 * Gerencia navegação através do window.history
 */
export class WindowApiRouter implements IRouter {
  /**
   * Navega para uma rota específica adicionando uma entrada no histórico
   * @param route - Caminho da rota de destino
   */
  forward(route: string): void {
    window.history.pushState({}, "", route);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  /**
   * Volta para a rota anterior no histórico de navegação
   */
  back(): void {
    window.history.back();
  }
}
