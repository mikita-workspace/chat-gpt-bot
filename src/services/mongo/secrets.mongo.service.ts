import { config } from '@bot/config';
import { SecretsModel } from '@bot/models';
import { logger } from '@bot/services';
import { SecretsType } from '@bot/types';
import { decrypt, encrypt, fetchCachedData, setValueToMemoryCache } from '@bot/utils';

export class SecretsMongoService {
  async getSecrets(): Promise<SecretsType | null> {
    try {
      const secrets = await fetchCachedData(`cached-secrets`, async () =>
        SecretsModel.findOne({}).exec(),
      );

      if (secrets) {
        return {
          gigaChatAccessToken: decrypt(
            secrets?.gigaChatAccessToken ?? '',
            config.SECRET_ENCRYPTION,
          ),
          googleRefreshToken: decrypt(secrets?.googleRefreshToken ?? '', config.SECRET_ENCRYPTION),
        };
      }

      return null;
    } catch (error) {
      logger.error(`mongoService::getSecrets::${JSON.stringify(error.message)}`);

      return null;
    }
  }

  async setSecrets({
    gigaChatAccessToken = {},
    googleRefreshToken = '',
  }: SecretsType): Promise<void> {
    try {
      const existingSecrets = await this.getSecrets();

      const secrets = existingSecrets
        ? await SecretsModel.findOneAndUpdate(
            {},
            {
              gigaChatAccessToken: encrypt(
                gigaChatAccessToken || existingSecrets.gigaChatAccessToken,
                config.SECRET_ENCRYPTION,
              ),
              googleRefreshToken: encrypt(
                googleRefreshToken || existingSecrets.googleRefreshToken,
                config.SECRET_ENCRYPTION,
              ),
            },
            { new: true },
          )
        : await SecretsModel.create({
            gigaChatAccessToken: encrypt(gigaChatAccessToken, config.SECRET_ENCRYPTION),
            googleRefreshToken: encrypt(googleRefreshToken, config.SECRET_ENCRYPTION),
          });

      setValueToMemoryCache(`cached-secrets`, JSON.stringify(secrets));
    } catch (error) {
      logger.error(`mongoService::setSecrets::${JSON.stringify(error.message)}`);
    }
  }
}
