import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import middy, { MiddyfiedHandler } from '@middy/core';
import httpContentEncodingMiddleware from '@middy/http-content-encoding';
import httpContentNegotiationMiddleware from '@middy/http-content-negotiation';
import httpCorsMiddleware from '@middy/http-cors';
import inputOutputLogger from '@middy/input-output-logger';
import httpErrorHandlerMiddleware from '@middy/http-error-handler';
import httpEventNormalizerMiddleware from '@middy/http-event-normalizer';
import httpHeaderNormalizerMiddleware from '@middy/http-header-normalizer';
import httpJsonBodyParserMiddleware from '@middy/http-json-body-parser';
import httpResponseSerializerMiddleware from '@middy/http-response-serializer';
import httpSecurityHeadersMiddleware from '@middy/http-security-headers';
import httpUrlencodePathParametersParserMiddleware from '@middy/http-urlencode-path-parser';
import { Static, TSchema } from '@sinclair/typebox';
import { logger } from '@verso/utils/logger.js';
import { validator } from '@/middleware.js';

export const middyHandler = <T extends TSchema, R extends TSchema>({
  eventSchema,
  responseSchema,
}: {
  eventSchema: T;
  responseSchema: R;
}): MiddyfiedHandler<Static<T>, Static<R>> =>
  middy({
    timeoutEarlyResponse: () => {
      return { statusCode: 408 };
    },
  })
    .use(injectLambdaContext(logger))
    .use(httpEventNormalizerMiddleware())
    .use(inputOutputLogger())
    .use(httpHeaderNormalizerMiddleware())
    .use(
      httpContentNegotiationMiddleware({
        availableLanguages: ['en'],
        availableMediaTypes: ['application/json'],
      }),
    )
    .use(httpUrlencodePathParametersParserMiddleware())
    .use(httpJsonBodyParserMiddleware({ disableContentTypeError: true }))
    .use(httpSecurityHeadersMiddleware())
    .use(httpCorsMiddleware())
    .use(httpContentEncodingMiddleware())
    .use(
      httpResponseSerializerMiddleware({
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
        ],
        defaultContentType: 'application/json',
      }),
    )
    .use(validator({ eventSchema, responseSchema }))
    .use(httpErrorHandlerMiddleware()) as MiddyfiedHandler<Static<T>, Static<R>>;
