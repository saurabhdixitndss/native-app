declare module 'morgan' {
  import { Request, Response, NextFunction } from 'express';

  namespace morgan {
    type FormatFn = (tokens: TokenIndexer, req: Request, res: Response) => string;
    type TokenCallbackFn = (req: Request, res: Response, arg?: string | number | boolean) => string | undefined;
    type TokenIndexer = (name: string, req: Request, res: Response, arg?: string | number | boolean) => string | undefined;

    interface Options<Request, Response> {
      immediate?: boolean;
      skip?: (req: Request, res: Response) => boolean;
      stream?: {
        write: (str: string) => void;
      };
    }

    function token(name: string, callback: TokenCallbackFn): morgan;
  }

  function morgan<Request, Response>(
    format: string | morgan.FormatFn,
    options?: morgan.Options<Request, Response>
  ): (req: Request, res: Response, next: NextFunction) => void;

  export = morgan;
}
