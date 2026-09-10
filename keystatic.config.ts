import { config, fields, collection, singleton } from '@keystatic/core';

// Solo import.meta.env: este archivo también se evalúa en el browser.
// Referenciar process.env sin guard rompe /keystatic (pantalla en blanco).
const repoOwner = String(
  import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER ?? '',
).trim();
const repoName = String(
  import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME ?? '',
).trim();

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
          description:
            'Para galletas con tamaños, este valor se usa como respaldo. El precio real lo define cada tamaño.',
          validation: { isRequired: true },
        }),
        cookieSizing: fields.conditional(
          fields.checkbox({
            label: 'Definir tamaños (solo galletas)',
            description:
              'Activa únicamente si la categoría es Galletas. Cada tamaño tiene su propio precio.',
            defaultValue: false,
          }),
          {
            false: fields.empty(),
            true: fields.array(
              fields.object({
                label: fields.text({
                  label: 'Tamaño',
                  validation: { isRequired: true },
                }),
                price: fields.number({
                  label: 'Precio (USD)',
                  validation: { isRequired: true },
                }),
              }),
              {
                label: 'Tamaños y precios',
                itemLabel: (props) => {
                  const size = props.fields.label.value || 'Tamaño';
                  const price = props.fields.price.value;
                  return price == null ? size : `${size} — $${price}`;
                },
              },
            ),
          },
        ),
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
          label: 'Métodos de pago / delivery (solo en la web)',
          description:
            'Se muestra en la página del carrito. Ya no se incluye en el mensaje de WhatsApp.',
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
