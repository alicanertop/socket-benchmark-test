import type { ENGINE_VALUES } from '../constants/engine.ts';
import type { BenchmarkInfo } from '../service/SocketBenchmark.ts';

export interface WS_INFO {
  URL: string;
  PORT: number;
  ENGINE: ENGINE_VALUES;
  CLIENT_COUNT?: number;
  BENCHMARK_INFO?: BenchmarkInfo;
}
