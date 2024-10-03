// import {ListStatusOrder} from 'modules/requestServe/constants'
// import {StatusActivity} from 'modules/activity/typings'
import {SOCKET_URL} from 'services/src/APIConfig';
import io, {Socket} from 'socket.io-client';

interface ResponseSocket {
  lat: number;
  lng: number;
  type: string;
  data: any;
  message: string;
  status: string;
}
class SocketService {
  private static instance: SocketService | null = null;
  private socket: Socket | undefined;

  private constructor(private token: string) {
    this.socket = io(SOCKET_URL, {
      auth: {
        token: this.token,
      },
    });
  }

  public static getInstance(token?: string): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(token ?? '');
    }
    return SocketService.instance;
  }

  public async waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject('Socket is not initialized');
      }

      if (this.socket.connected) {
        return resolve();
      }

      this.socket.once('connect', () => {
        resolve();
      });

      this.socket.once('connect_error', error => {
        console.error('Socket connection failed', error);
        reject(error);
      });
    });
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public getId(): string {
    return this.socket?.id ?? '';
  }

  public on(event: string, callback: (response: ResponseSocket) => void): void {
    // console.log('On event ==>', event)
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    this.socket.on(event, (data: ResponseSocket) => {
      callback(data);

      this.socket?.on('connect', () => {
        console.error('socket connect ===>');
        this.socket?.on('reconnect ===>', () => {
          console.error('socket reconnect ===>');
        });
        this.socket?.on('close ===>', () => {
          console.error('socket close');
        });
        this.socket?.on('reconnect_attempt ===>', () => {
          console.error('socket reconnect_attempt');
        });
        this.socket?.on('reconnecting ===>', () => {
          console.error('socket reconnecting');
        });
        this.socket?.on('reconnect_error ===>', () => {
          console.error('socket reconnect_error');
        });
        this.socket?.on('reconnect_failed ===>', () => {
          console.error('socket reconnect_failed');
        });
      });

      this.socket?.on('disconnect', () => {
        console.error('socket disconnect');
      });
    });
  }
  public emit(event: string, args: any): void {
    if (!this.socket) {
      console.error('Socket is not initialized. Call getInstance() first.');
      return;
    }
    console.log('emit event ==>', event);
    this.socket.emit(event, args);
  }

  public off(event: string): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    this.socket.off(event);
  }

  public offAny(): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    this.socket.offAny();
  }

  public offAnyOutgoing(): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    this.socket.offAnyOutgoing();
  }

  public once(
    event: string,
    callback: (response: ResponseSocket) => void,
  ): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    this.socket.once(event, (data: ResponseSocket) => {
      callback(data);
    });
  }
}

export default SocketService;
