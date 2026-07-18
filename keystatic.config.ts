import { config, fields, collection, singleton } from '@keystatic/core';

const repoOwner =
  import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER ||
  process.env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER;
const repoName =
  import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME ||
  process.env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME;

const storage =
  repoOwner && repoName
    ? {
        kind: 'github' as const,
        repo: `${repoOwner}/${repoName}`,
      }
    : {
        kind: 'local' as const,
      };

export default config({
  storage,
  collections: {
    products: collection({
      label: 'Productos',
      slugField: 'name',
      path: 'src/content/products/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Nombre' } }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Galletas', value: 'galletas' },
            { label: 'Tortas', value: 'tortas' },
            { label: 'Postres', value: 'postres' },
          ],
          defaultValue: 'galletas',
        }),
        description: fields.text({
          label: 'Descripción',
          multiline: true,
        }),
        price: fields.number({
          label: 'Precio (USD)',
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: 'Imagen',
          directory: 'public/images/products',
          publicPath: '/images/products/',
        }),
        available: fields.checkbox({
          label: 'Disponible',
          defaultValue: true,
        }),
        featured: fields.checkbox({
          label: 'Destacado en inicio',
          defaultValue: false,
        }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: 'Configuración del sitio',
      path: 'src/content/site',
      format: { data: 'yaml' },
      schema: {
        whatsappNumber: fields.text({
          label: 'WhatsApp (código país, sin +)',
          description:
            'Ejemplo: 584121234567. Si está vacío, se usa PUBLIC_WHATSAPP_NUMBER.',
        }),
        paymentNote: fields.text({
          label: 'Métodos de pago / delivery',
          multiline: true,
          defaultValue:
            'Pago móvil, transferencia o efectivo al entregar. Coordinamos zona y horario por WhatsApp.',
        }),
        orderGreeting: fields.text({
          label: 'Saludo del pedido',
          defaultValue: 'Hola! Quiero hacer un pedido en Delicateses Doña Rosa:',
        }),
      },
    }),
  },
});
