import { config } from '@bot/config';
import { SecretsModel } from '@bot/models';
import { logger } from '@bot/services';
import { SecretsType } from '@bot/types';
import { decrypt, encrypt, fetchCachedData, setValueToMemoryCache } from '@bot/utils';

export class SecretsMongoService {
  private secretKey: string;

  constructor() {
    this.secretKey = config.SECRET_ENCRYPTION;
  }

  async getSecrets(): Promise<SecretsType> {
    try {
      const secrets = await fetchCachedData(`cached-secrets`, async () =>
        SecretsModel.find({}).exec(),
      );

      return {
        gigaChatAccessToken: decrypt(secrets?.gigaChatAccessToken ?? '', this.secretKey),
        googleRefreshToken: decrypt(secrets?.googleRefreshToken ?? '', this.secretKey),
      };
    } catch (error) {
      logger.error(`mongoService::getSecrets::${JSON.stringify(error.message)}`);

      return {
        gigaChatAccessToken: {},
        googleRefreshToken: '',
      };
    }
  }

  async setSecrets({
    gigaChatAccessToken = {},
    googleRefreshToken = '',
  }: SecretsType): Promise<void> {
    try {
      const secrets = await SecretsModel.create({
        gigaChatAccessToken: encrypt(gigaChatAccessToken, this.secretKey),
        googleRefreshToken: encrypt(googleRefreshToken, this.secretKey),
      });

      setValueToMemoryCache(`cached-secrets`, JSON.stringify(secrets));
    } catch (error) {
      logger.error(`mongoService::setSecrets::${JSON.stringify(error.message)}`);
    }
  }
}
