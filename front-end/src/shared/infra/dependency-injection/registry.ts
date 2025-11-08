/**
 * Registro para gerenciamento de injeção de dependências.
 * Implementa o padrão Singleton para garantir uma única instância na aplicação.
 */
export class Registry {
  private readonly dependencies: Record<string, unknown> = {};
  static instance: Registry | undefined;

  /**
   * Construtor privado para prevenir instanciação direta.
   * Use `getInstance()` para acessar a instância singleton.
   */
  private constructor() {}

  /**
   * Registra uma dependência no registry.
   *
   * @param name - Identificador único para a dependência
   * @param dependency - Instância da dependência a ser registrada
   */
  provide<T>(name: string, dependency: T) {
    this.dependencies[name] = dependency;
  }

  /**
   * Recupera uma dependência registrada do registry.
   *
   * @param name - Identificador único da dependência a ser recuperada
   * @returns A instância da dependência registrada
   * @throws {Error} Se a dependência não for encontrada no registry
   */
  inject<T>(name: string): T {
    const dependency = this.dependencies[name];
    if (!dependency) throw new Error(`Dependency: ${name} not found`);
    return dependency as T;
  }

  /**
   * Retorna a instância singleton do Registry.
   * Cria a instância se ela ainda não existir.
   *
   * @returns A instância singleton do Registry
   */
  static getInstance() {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }
}
