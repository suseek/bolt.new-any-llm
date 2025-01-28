import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createAzure } from '@ai-sdk/azure';

export default class AzureOpenAIProvider extends BaseProvider {
  name = 'AzureOpenAI';
  getApiKeyLink = '';

  config = {
    apiTokenKey: 'AZURE_OPENAI_API_KEY',
  };

  staticModels: ModelInfo[] = [{ name: 'gpt-4o', label: 'GPT-4o', provider: 'AzureOpenAI', maxTokenAllowed: 8000 }];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'AZURE_OPENAI_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createAzure({
      apiKey,
      resourceName: process.env.AZURE_RESOURCE_NAME,
    });

    return openai(model);
  }
}
