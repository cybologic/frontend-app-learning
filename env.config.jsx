import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import { ChatbotPlugin } from '@edx/frontend-component-chatbot';

const config = {
  pluginSlots: {
    // Add chatbot to the footer slot
    'footer_slot': {
      keepDefault: true,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'openedx_chatbot',
            type: DIRECT_PLUGIN,
            priority: 50,
            RenderWidget: ChatbotPlugin,
          },
        },
      ],
    },
  },
};

export default config;
