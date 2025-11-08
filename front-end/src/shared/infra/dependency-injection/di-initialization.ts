import { AxiosHttpClient, type IHttpClient } from "../http/http-client";
import { Registry } from "./registry";
import {
  HttpEvironmentGateway,
  type IEvironmentGateway,
} from "../../../application/environment-status-list.gateway";
import { WindowApiRouter } from "../router/router";
import type { IRouter } from "../router/router.interface";

/**
 * Inicializa todas as dependências da aplicação no container Registry.
 *
 * Esta função deve ser chamada durante o bootstrap da aplicação, antes do mount,
 * para garantir que todas as dependências estejam disponíveis quando necessário.
 *
 * @remarks
 * Registra as seguintes dependências:
 * - **Router**: Gerenciador de navegação entre rotas (WindowApiRouter)
 * - **HttpClient**: Cliente HTTP configurado com autenticação e refresh token
 * - **AuthStore**: Store para gerenciamento de estado de autenticação
 * - **SellerProductGateway**: Gateway para operações de produtos de vendedor
 *
 * @important
 * **ATENÇÃO**: As dependências devem ser registradas em ordem de dependência.
 * Dependências que são injetadas por outras devem ser registradas ANTES de seus consumidores.
 *
 * Exemplo: `SellerProductGateway` injeta `HttpClient` via `Registry.getInstance().inject('HttpClient')`,
 * portanto `HttpClient` deve ser registrado antes de `SellerProductGateway`.
 *
 * Ordem de registro nesta função:
 * 1. Router (sem dependências)
 * 2. HttpClient (sem dependências)
 * 3. AuthStore (sem dependências)
 * 4. SellerProductGateway (depende de HttpClient)
 *
 * @example
 * ```typescript
 * export const bootstrap = [
 *   () => {
 *     initializeDependencies();
 *     return Promise.resolve();
 *   },
 *   lifecycles.bootstrap,
 * ];
 * ```
 *
 * @see {@link Registry} para mais informações sobre o container de injeção de dependências
 */
export const initializeDependencies = (): void => {
  Registry.getInstance().provide<IRouter>("Router", new WindowApiRouter());
  Registry.getInstance().provide<IHttpClient>(
    "HttpClient",
    new AxiosHttpClient(
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
    )
  );
  Registry.getInstance().provide<IEvironmentGateway>(
    "EnvironmentGateway",
    new HttpEvironmentGateway()
  );
};
