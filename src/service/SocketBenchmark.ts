import match from '../assets/match.json' with { type: 'json' };
import { BENCHMARK_SEND_TIMEOUT } from '../constants/settings.ts';

const MATCH_STRING = JSON.stringify(match);
const SINGLE_CHAR = '7';

type OnTimeoutCalled = (message: string) => void;

export interface BenchmarkInfo {
  isActive: boolean;
  timeoutTime: number;
  benchmarkMessage: {
    isMatch: boolean;
    isSingleChar: boolean;
  };
}
export class SocketBenchmark {
  private timeoutLoppStarted = false;
  private _timeoutTime: number = BENCHMARK_SEND_TIMEOUT;
  private currentTimeout: NodeJS.Timeout = undefined;
  private benchmarkMessage: string = SINGLE_CHAR;

  updateTimeoutTime(time?: string) {
    if (!time) {
      this._timeoutTime = BENCHMARK_SEND_TIMEOUT;
    }
    this._timeoutTime = Number(time);
  }

  setMessageToMatch() {
    this.benchmarkMessage = MATCH_STRING;
  }

  setMessageToSingleChar() {
    this.benchmarkMessage = SINGLE_CHAR;
  }

  private loop(onTimeoutCalled: OnTimeoutCalled) {
    if (!this.timeoutLoppStarted) return;

    if (this.currentTimeout) return;

    this.currentTimeout = setTimeout(() => {
      onTimeoutCalled(this.benchmarkMessage);
      clearTimeout(this.currentTimeout);
      this.currentTimeout = undefined;

      this.startBenchmarkRoomLoop(onTimeoutCalled);
    }, this._timeoutTime);
  }

  public get info(): BenchmarkInfo {
    return {
      isActive: this.timeoutLoppStarted,
      timeoutTime: this._timeoutTime,
      benchmarkMessage: {
        isMatch: this.benchmarkMessage === MATCH_STRING,
        isSingleChar: this.benchmarkMessage === SINGLE_CHAR,
      },
    };
  }

  constructor() {}

  stopBenchmarkRoomLoop() {
    this.timeoutLoppStarted = false;
    clearTimeout(this.currentTimeout);
    this.currentTimeout = undefined;
  }
  startBenchmarkRoomLoop(onTimeoutCalled: OnTimeoutCalled) {
    this.timeoutLoppStarted = true;
    this.loop(onTimeoutCalled);
  }
}
