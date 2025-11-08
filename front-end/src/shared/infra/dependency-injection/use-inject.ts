import { useMemo } from "react";

import { Registry } from "./registry";

/**
 * Hook para injeção de dependências via Registry
 *
 * @template T - Tipo da dependência injetada
 * @param dependencyName - Nome da dependência registrada no Registry
 * @returns A instância da dependência injetada
 *
 * @example
 * ```tsx
 * const httpClient = useInject<IHttpClient>('HttpClient');
 * const router = useInject<IRouter>('Router');
 * ```
 */
export function useInject<T>(dependencyName: string): T {
  return useMemo(() => {
    return Registry.getInstance().inject<T>(dependencyName);
  }, [dependencyName]);
}
