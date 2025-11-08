import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';
import {
  EnviromentStatusRepository,
  IEnviromentStatusRepository,
} from './infra/environment-status.repository';
import {
  UseCaseMediator,
  IUseCaseMediator,
  ListEnviromentStatusUseCase,
  GetLastEnvironmentStatusUseCase,
  GetCurrentEnviromentStatusUseCase,
  CalculateCurrentEnviromentStatusUseCase,
  GetLastHalfHourCurrentEnvironmentStatusUseCase,
} from './application';
import { AppController, CalculateAverageTask } from './presentation';
import { IRealTimeDatabase, FirebaseRealTimeDatabase } from './infra/firebase';

/**
 * Módulo principal da aplicação IoT
 *
 * Responsável por configurar e orquestrar todos os módulos, providers e controllers
 * da aplicação de monitoramento de status ambiental.
 *
 * @module AppModule
 *
 * Principais responsabilidades:
 * - Configuração de variáveis de ambiente via ConfigModule
 * - Integração com Firebase Realtime Database
 * - Configuração de tarefas agendadas (ScheduleModule)
 * - Registro de casos de uso e repositórios
 * - Configuração de injeção de dependências
 */
@Module({
  imports: [
    /**
     * ConfigModule - Gerencia variáveis de ambiente
     * @property {boolean} isGlobal - Torna o módulo disponível globalmente
     * @property {string} envFilePath - Caminho para o arquivo .env
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    /**
     * ScheduleModule - Habilita agendamento de tarefas
     * Usado para calcular médias periodicamente
     */
    ScheduleModule.forRoot(),
    /**
     * FirebaseModule - Configura conexão com Firebase Realtime Database
     * Carrega credenciais e URL do banco de dados a partir das variáveis de ambiente
     */
    FirebaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        googleApplicationCredential: configService.get<string>(
          'GOOGLE_APP_CREDENTIALS',
        ),
        databaseURL: configService.get<string>('DATABASE_URL'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    /**
     * Provider para acesso ao Firebase Realtime Database
     * @implements {IRealTimeDatabase}
     */
    {
      provide: IRealTimeDatabase,
      useClass: FirebaseRealTimeDatabase,
    },
    /**
     * Provider do repositório de status ambiental
     * @implements {IEnviromentStatusRepository}
     * @param {IRealTimeDatabase} IRealTimeDatabase - Dependência do banco de dados Firebase
     */
    {
      provide: IEnviromentStatusRepository,
      useFactory: (IRealTimeDatabase) =>
        new EnviromentStatusRepository(IRealTimeDatabase),
      inject: [IRealTimeDatabase],
    },
    /**
     * Use Case para listar todos os status ambientais
     * @param {IEnviromentStatusRepository} IEnviromentStatusRepository - Repositório de dados
     */
    {
      provide: ListEnviromentStatusUseCase,
      useFactory: (IEnviromentStatusRepository) =>
        new ListEnviromentStatusUseCase(IEnviromentStatusRepository),
      inject: [IEnviromentStatusRepository],
    },
    /**
     * Use Case para obter o status ambiental atual
     * @param {IEnviromentStatusRepository} IEnviromentStatusRepository - Repositório de dados
     */
    {
      provide: GetCurrentEnviromentStatusUseCase,
      useFactory: (IEnviromentStatusRepository) =>
        new GetCurrentEnviromentStatusUseCase(IEnviromentStatusRepository),
      inject: [IEnviromentStatusRepository],
    },
    /**
     * Use Case para calcular médias do status ambiental atual
     * @param {IEnviromentStatusRepository} IEnviromentStatusRepository - Repositório de dados
     */
    {
      provide: CalculateCurrentEnviromentStatusUseCase,
      useFactory: (IEnviromentStatusRepository) =>
        new CalculateCurrentEnviromentStatusUseCase(
          IEnviromentStatusRepository,
        ),
      inject: [IEnviromentStatusRepository],
    },
    /**
     * Use Case para obter status ambiental da última meia hora
     * @param {IEnviromentStatusRepository} IEnviromentStatusRepository - Repositório de dados
     */
    {
      provide: GetLastHalfHourCurrentEnvironmentStatusUseCase,
      useFactory: (IEnviromentStatusRepository) =>
        new GetLastHalfHourCurrentEnvironmentStatusUseCase(
          IEnviromentStatusRepository,
        ),
      inject: [IEnviromentStatusRepository],
    },
    /**
     * Use Case para obter o último status ambiental registrado
     * @param {IEnviromentStatusRepository} IEnviromentStatusRepository - Repositório de dados
     */
    {
      provide: GetLastEnvironmentStatusUseCase,
      useFactory: (IEnviromentStatusRepository) =>
        new GetLastEnvironmentStatusUseCase(IEnviromentStatusRepository),
      inject: [IEnviromentStatusRepository],
    },
    /**
     * Mediador de casos de uso
     * Centraliza o acesso a todos os use cases da aplicação
     *
     * @implements {IUseCaseMediator}
     * @param {ListEnviromentStatusUseCase} ListEnviromentStatusUseCase
     * @param {GetCurrentEnviromentStatusUseCase} GetCurrentEnviromentStatusUseCase
     * @param {CalculateCurrentEnviromentStatusUseCase} CalculateCurrentEnviromentStatusUseCase
     * @param {GetLastHalfHourCurrentEnvironmentStatusUseCase} GetLastHalfHourCurrentEnvironmentStatusUseCase
     * @param {GetLastEnvironmentStatusUseCase} GetLastEnvironmentStatusUseCase
     */
    {
      provide: IUseCaseMediator,
      useFactory: (
        ListEnviromentStatusUseCase,
        GetCurrentEnviromentStatusUseCase,
        CalculateCurrentEnviromentStatusUseCase,
        GetLastHalfHourCurrentEnvironmentStatusUseCase,
        GetLastEnvironmentStatusUseCase,
      ) =>
        new UseCaseMediator(
          ListEnviromentStatusUseCase,
          GetCurrentEnviromentStatusUseCase,
          CalculateCurrentEnviromentStatusUseCase,
          GetLastHalfHourCurrentEnvironmentStatusUseCase,
          GetLastEnvironmentStatusUseCase,
        ),
      inject: [
        ListEnviromentStatusUseCase,
        GetCurrentEnviromentStatusUseCase,
        CalculateCurrentEnviromentStatusUseCase,
        GetLastHalfHourCurrentEnvironmentStatusUseCase,
        GetLastEnvironmentStatusUseCase,
      ],
    },
    /**
     * Tarefa agendada para calcular médias
     * Executa periodicamente o cálculo de médias dos dados ambientais
     */
    CalculateAverageTask,
  ],
})
export class AppModule {}
